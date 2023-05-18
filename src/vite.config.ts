import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

/**
 * Define config for Vite build
 */
export default defineConfig(({ command }) => ({
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
  },
}));
