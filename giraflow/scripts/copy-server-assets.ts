/**
 * Cross-platform script to copy assets for the server/CLI build.
 * Copies schema, AI instructions, and example giraflows to dist/server/server/.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(rootDir, '..');
const serverDistDir = path.join(rootDir, 'dist', 'server', 'server');

function copyFileSync(src: string, dest: string): void {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirRecursive(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying assets for server build...\n');

// Ensure dist directory exists
if (!fs.existsSync(serverDistDir)) {
  fs.mkdirSync(serverDistDir, { recursive: true });
}

// 1. Copy schema
const schemaSource = path.join(repoRoot, 'giraflow.schema.json');
const schemaDest = path.join(serverDistDir, 'giraflow.schema.json');
if (fs.existsSync(schemaSource)) {
  copyFileSync(schemaSource, schemaDest);
  console.log('  ✓ giraflow.schema.json');
} else {
  console.warn('  ⚠ giraflow.schema.json not found');
}

// 2. Copy AI instructions
const aiSource = path.join(repoRoot, 'docs', 'giraflow-ai-instructions.md');
const aiDest = path.join(serverDistDir, 'giraflow-ai-instructions.md');
if (fs.existsSync(aiSource)) {
  copyFileSync(aiSource, aiDest);
  console.log('  ✓ giraflow-ai-instructions.md');
} else {
  console.warn('  ⚠ giraflow-ai-instructions.md not found');
}

// 3. Copy example giraflows
const examplesSource = path.join(repoRoot, 'example-giraflows');
const examplesDest = path.join(serverDistDir, 'examples');
if (fs.existsSync(examplesSource)) {
  // Clean existing examples directory
  if (fs.existsSync(examplesDest)) {
    fs.rmSync(examplesDest, { recursive: true });
  }

  copyDirRecursive(examplesSource, examplesDest);
  console.log('  ✓ example-giraflows -> examples/');
} else {
  console.warn('  ⚠ example-giraflows not found');
}

console.log('\nDone!\n');
