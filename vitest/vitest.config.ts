/// <reference types="vitest" />

import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

const root = resolve(__dirname, '../')

export default defineConfig({
  root,
  mode: 'test',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/css/quasar.variables.scss";',
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vitest',
        'vue-router',
        'pinia',
        {
          'quasar/dist/quasar.esm.prod': [
            'Cookies',
            'Platform',
            'LocalStorage',
            'Quasar',
            'Notify',
          ],
        },
      ],
      dts: './vitest/vitest-auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
      app: resolve(root, '.'),
      boot: resolve(root, 'src/boot'),
      src: resolve(root, 'src'),
      css: resolve(root, 'src/css'),
      pages: resolve(root, 'src/pages'),
      components: resolve(root, 'src/components'),
      layouts: resolve(root, 'src/layouts'),
      assets: resolve(root, 'src/assets'),
      stores: resolve(root, 'src/stores'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
    coverage: {
      exclude: ['**/src/api/__mocks__/**'],
      reporter: ['clover', 'text'],
    },
  },
})
