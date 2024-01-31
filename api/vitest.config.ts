import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: '/',
    exclude: [...configDefaults.exclude, '**/data/pg/**'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
