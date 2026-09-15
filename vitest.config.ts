import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@knowthemd/ui': path.resolve(__dirname, './packages/ui/src'),
      '@knowthemd/markdown-engine': path.resolve(__dirname, './packages/markdown-engine/src'),
      '@knowthemd/editor': path.resolve(__dirname, './packages/editor/src'),
    },
  },
});
