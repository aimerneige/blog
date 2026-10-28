import { defineConfig } from "vite";
export default defineConfig({
  root: "web",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: {
      onwarn(warning, warn) {
        if (warning.code !== "MODULE_LEVEL_DIRECTIVE") warn(warning);
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.ADMIN_DEV_PORT || 5173),
    strictPort: true,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${process.env.PORT || 4321}`,
        changeOrigin: true,
      },
      "/images": {
        target: `http://127.0.0.1:${process.env.PORT || 4321}`,
        changeOrigin: true,
      },
    },
  },
});
