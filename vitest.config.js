/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: './src',
    include: ['**/__tests__/*.{ts,cts}', './**/*.{test,spec}.{ts,cts}']
  }
});
