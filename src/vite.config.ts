import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import type { ManualChunksOption } from "rollup";

const combineManualChunks: ManualChunksOption = (id) => {
  if (id.includes("node_modules/@mui")) {
    return "mui";
  } else if (id.includes("node_modules")) {
    // return "vendor";
    return id.toString().split("node_modules/")[1].split("/")[0].toString();
  }
};

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
    plugins: [react()],
    build: {
      manifest: true,
      minify: "esbuild",
      // minify: false,
      // sourcemap: true,
      outDir: "public/build",
      rollupOptions: {
        input: ["frontend/index.ts"],
        output: {
          manualChunks: combineManualChunks,
        },
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      open: false,
      host: true,
      port: 3000,
      cors: true,
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
