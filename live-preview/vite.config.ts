import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/events': {
        target: 'http://localhost:3000',
      },
    },
  },
});
