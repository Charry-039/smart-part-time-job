import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 使用现代 Sass API
        silenceDeprecations: ['legacy-js-api'], // 抑制弃用警告
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    hmr: {
      overlay: false,
    },
  },
});
