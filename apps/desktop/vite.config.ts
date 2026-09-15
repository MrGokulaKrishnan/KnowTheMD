import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@knowthemd/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@knowthemd/markdown-engine': path.resolve(__dirname, '../../packages/markdown-engine/src'),
      '@knowthemd/editor': path.resolve(__dirname, '../../packages/editor/src'),
    },
  },
  server: {
    port: 3000,
  },
});
