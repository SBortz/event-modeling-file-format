import JSZip from 'jszip';
import type { GiraflowModel, Actor } from './types';
import { buildSliceViewModel, exportSlicesToJson } from './models/slice-model';

/**
 * Extract all wireframe paths from the model (from Actor elements)
 */
function extractWireframePaths(model: GiraflowModel): string[] {
  const wireframes = new Set<string>();

  for (const element of model.timeline) {
    if (element.type === 'actor') {
      const actor = element as Actor;
      if (actor.wireframes) {
        for (const wf of actor.wireframes) {
          wireframes.add(wf);
        }
      }
    }
  }

  return Array.from(wireframes);
}

/**
 * Check if content is the Vite index page (SPA fallback) instead of actual wireframe
 */
function isViteFallbackPage(content: string): boolean {
  return content.includes('/@vite/client') || content.includes('/src/client/main.ts');
}

/**
 * Fetch a wireframe from the server
 */
async function fetchWireframe(wireframePath: string, exampleFolder: string | null): Promise<string | null> {
  try {
    // Build the correct URL based on mode
    // wireframePath is like "wireframes/user-2.html" (already includes wireframes/ prefix)
    let url: string;
    if (exampleFolder) {
      // Public mode with example folder
      url = `/examples/${exampleFolder}/${wireframePath}`;
    } else {
      // Local mode or session-based giraflow
      // wireframePath already has wireframes/ prefix, so just use it directly
      url = `/${wireframePath}`;
    }

    console.log('[download-zip] Fetching wireframe:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.log('[download-zip] Fetch failed with status:', res.status);
      return null;
    }

    const content = await res.text();

    // Check if we got the Vite SPA fallback page instead of actual wireframe
    if (isViteFallbackPage(content)) {
      console.log('[download-zip] Got Vite fallback page instead of wireframe for:', url);
      return null;
    }

    return content;
  } catch (e) {
    console.error('[download-zip] Error fetching wireframe:', e);
    return null;
  }
}

export async function downloadProjectZip(
  model: GiraflowModel,
  rawJson: string,
  editedWireframes: Map<string, string>,
  exampleFolder: string | null
): Promise<void> {
  const zip = new JSZip();

  // Sanitize name for filename
  const safeName = (model.name || 'giraflow').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  // Add JSON file
  zip.file(`${safeName}.giraflow.json`, rawJson);

  // Create the .giraflow asset folder
  const assetFolder = zip.folder(`${safeName}.giraflow`);

  // Generate and add slices.json inside the .giraflow folder
  const sliceViewModel = buildSliceViewModel(model);
  const slicesJson = exportSlicesToJson(sliceViewModel.slices);
  assetFolder?.file('slices.json', slicesJson);

  // Extract all wireframe paths from the model
  const allWireframePaths = extractWireframePaths(model);

  // Only create wireframes folder if there are any wireframes
  if (allWireframePaths.length > 0) {
    const folder = assetFolder?.folder('wireframes');

    // Add wired-elements.js library inside wireframes folder so wireframes work offline
    try {
      const wiredElementsRes = await fetch('/lib/wired-elements.js');
      if (wiredElementsRes.ok) {
        const wiredElementsJs = await wiredElementsRes.text();
        folder?.folder('lib')?.file('wired-elements.js', wiredElementsJs);
      }
    } catch {
      // Ignore if wired-elements.js can't be fetched
    }

    for (const wireframePath of allWireframePaths) {
      // Check if there's an edited version
      // editedWireframes keys can be full paths like "/examples/foo/wireframes/bar.html"
      // or just the filename like "bar.html"
      const filename = wireframePath.split('/').pop() || wireframePath;

      // Look for edited version (check various key formats)
      let content: string | null = null;

      for (const [key, value] of editedWireframes) {
        const keyFilename = key.split('/').pop() || key;
        if (keyFilename === filename || key === wireframePath) {
          content = value;
          break;
        }
      }

      // If not edited, fetch from server
      if (!content) {
        content = await fetchWireframe(wireframePath, exampleFolder);
      }

      // Add to zip if we have content
      if (content) {
        // Adjust wired-elements.js path from absolute to relative (lib is inside wireframes folder)
        const adjustedContent = content.replace(
          /src=["']\/lib\/wired-elements\.js["']/g,
          'src="lib/wired-elements.js"'
        );
        folder?.file(filename, adjustedContent);
      }
    }
  }

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
