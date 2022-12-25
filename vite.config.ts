import { defineConfig } from "vite";
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  build: { minify: false, modulePreload: { polyfill: false }/*, rollupOptions: {plugins: [babel({preset})]}*/ },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
