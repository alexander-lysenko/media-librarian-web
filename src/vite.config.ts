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
  define: {
    "process.env": process.env,
  },
  build: {
    manifest: true,
    outDir: "public/build",
    rollupOptions: {
      input: ["frontend/index.ts"],
    },
  },
  server: {
    open: false,
    host: "192.168.240.9",
    port: 3000,
  },
}));
