import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { ifLivePlugin } from './src/vite-plugin-if-live.ts';

export default defineConfig(({ mode }) => {
  const isPublic = mode === 'public';

  return {
    plugins: [svelte(), ifLivePlugin()],
    root: '.',
    publicDir: 'public',
    build: {
      outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: isPublic
        ? {
            input: 'index-public.html',
          }
        : undefined,
    },
    // Use different entry point for public mode
    ...(isPublic && {
      resolve: {
        alias: {
          './main.ts': './main-public.ts',
        },
      },
    }),
  };
});
