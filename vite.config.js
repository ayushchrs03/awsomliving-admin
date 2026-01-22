import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react(), tailwindcss(), pluginRewriteAll()],
    build: {
      rollupOptions: {
        output: { manualChunks: undefined },
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "src/css/index.scss";`,
    //     },
    //   },
    // },
  };
});
