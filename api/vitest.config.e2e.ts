import swc from 'unplugin-swc';
import { defineConfig, configDefaults } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    environment: 'node',
    watch: true,
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    exclude: [...configDefaults.exclude, '**/data/**'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
