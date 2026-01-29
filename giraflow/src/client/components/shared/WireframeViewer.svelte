<script lang="ts">
  import { wireframeReloadSignal } from "../../stores/model.svelte";
  import hljs from "highlight.js/lib/core";
  import xml from "highlight.js/lib/languages/xml";

  // Register HTML/XML language
  hljs.registerLanguage("xml", xml);

  interface Props {
    src: string;
    title?: string;
  }
  let { src, title = "Wireframe" }: Props = $props();

  let showCode = $state(false);
  let code = $state("");
  let highlightedCode = $state("");
  let loading = $state(false);

  // Extract filename from src path
  let filename = $derived(src.split("/").pop() || src);

  // Add cache-buster query param to force fresh load
  let cacheBustedSrc = $derived(
    wireframeReloadSignal.value > 0
      ? `${src}${src.includes("?") ? "&" : "?"}_t=${wireframeReloadSignal.value}`
      : src,
  );

  async function loadCode() {
    if (code && wireframeReloadSignal.value === 0) return;
    loading = true;
    try {
      const res = await fetch(cacheBustedSrc);
      code = await res.text();
      highlightedCode = hljs.highlight(code, { language: "xml" }).value;
    } catch (e) {
      code = "// Failed to load source";
      highlightedCode = code;
    }
    loading = false;
  }

  // Reload code when wireframe changes
  $effect(() => {
    if (wireframeReloadSignal.value > 0 && showCode) {
      loadCode();
    }
  });
</script>

<div class="wireframe-container">
  <div class="wireframe-header">
    <div class="wireframe-label">
      <span class="wireframe-filename">{filename}</span>
    </div>
    <label class="toggle-switch">
      <span class="toggle-label">Preview</span>
      <input
        type="checkbox"
        bind:checked={showCode}
        onchange={() => showCode && !code && loadCode()}
      />
      <span class="toggle-slider"></span>
      <span class="toggle-label">Code</span>
    </label>
  </div>

  {#if showCode}
    <div class="code-view">
      {#if loading}
        <span class="loading">Loading...</span>
      {:else}
        <pre><code>{@html highlightedCode}</code></pre>
      {/if}
    </div>
  {:else}
    {#key cacheBustedSrc}
      <iframe {title} src={cacheBustedSrc} class="wireframe-iframe"></iframe>
    {/key}
  {/if}
</div>

<style>
  .wireframe-container {
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
  }

  .wireframe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary, #f5f5f5);
    border-bottom: 1px solid var(--border);
  }

  .wireframe-label {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-secondary, #666);
  }

  .wireframe-filename {
    font-family: var(--font-mono, monospace);
    font-weight: 500;
  }

  .toggle-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
  }

  .toggle-label {
    color: var(--text-secondary, #666);
  }

  .toggle-switch input {
    display: none;
  }

  .toggle-slider {
    position: relative;
    width: 36px;
    height: 20px;
    background: var(--border, #ddd);
    border-radius: 10px;
    transition: background 0.2s;
  }

  .toggle-slider::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle-switch input:checked + .toggle-slider {
    background: var(--color-command, #3b82f6);
  }

  .toggle-switch input:checked + .toggle-slider::after {
    transform: translateX(16px);
  }

  .wireframe-iframe {
    width: 100%;
    height: 800px;
    border: none;
    display: block;
  }

  .code-view {
    height: 800px;
    overflow: auto;
    background: var(--bg-card, #fafafa);
    border-top: 1px solid var(--border, #eee);
  }

  .code-view pre {
    margin: 0;
    padding: 1rem;
  }

  .code-view code {
    font-family: var(--font-mono, monospace);
    font-size: 0.8rem;
    color: var(--text-primary, #333);
    white-space: pre;
  }

  .loading {
    display: block;
    padding: 1rem;
    color: var(--text-secondary);
  }

  /* highlight.js GitHub-style theme */
  .code-view :global(.hljs-tag) {
    color: #22863a;
  }
  .code-view :global(.hljs-name) {
    color: #22863a;
  }
  .code-view :global(.hljs-attr) {
    color: #6f42c1;
  }
  .code-view :global(.hljs-string) {
    color: #032f62;
  }
  .code-view :global(.hljs-comment) {
    color: #6a737d;
    font-style: italic;
  }
  .code-view :global(.hljs-doctag) {
    color: #6a737d;
  }
  .code-view :global(.hljs-keyword) {
    color: #d73a49;
  }
  .code-view :global(.hljs-meta) {
    color: #6a737d;
  }
</style>
