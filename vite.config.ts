import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        common: resolve(__dirname, 'src/common/index.ts'),
        browser: resolve(__dirname, 'src/browser/index.ts'),
        worker: resolve(__dirname, 'src/worker/index.ts'),
      },
      name: 'react-worker-hooks',
      formats: ['es', 'cjs'],
      // the proper extensions will be added
      fileName: (format, entryName) =>
        `${entryName}/index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },

  plugins: [dts()],
});
