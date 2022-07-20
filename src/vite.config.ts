import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Define config for Vite build
 */
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "" : "/build/",
  root: command === "serve" ? "./frontend" : "",
  publicDir: "fake_dir_so_nothing_gets_copied",
  plugins: [react()],
  build: {
    manifest: true,
    outDir: "public/build",
    rollupOptions: {
      input: ["frontend/index.ts"],
    },
  },
  server: {
    host: "localhost",
    port: 3000,
  },
}));
