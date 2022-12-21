import { defineConfig } from "vite";
//import babel from '@rollup/plugin-babel';

export default defineConfig({
  build: { minify: false, modulePreload: { polyfill: false }/*, rollupOptions: {plugins: [babel({preset})]}*/ },
});
