import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";

/**
 * Define config for Vite build
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: command === "serve" ? "" : "/build/",
    root: command === "serve" ? "./frontend" : "",
    publicDir: "fake_dir_so_nothing_gets_copied",
    envDir: "../",
    plugins: [react(), splitVendorChunkPlugin()],
    build: {
      manifest: true,
      outDir: "public/build",
      rollupOptions: {
        input: ["frontend/index.ts"],
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      open: false,
      host: true,
      port: 3000,
      cors: false,
      proxy: {
        "/api/v1": {
          target: env.VITE_APP_URL,
          changeOrigin: true,
        },
        "/home": {
          target: env.VITE_APP_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
