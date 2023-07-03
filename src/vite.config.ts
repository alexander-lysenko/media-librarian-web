import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";

// @ts-ignore
import { dependencies } from "./package.json";

// noinspection SpellCheckingInspection
const vendorDeps = [
  "react",
  "react-router-dom",
  "react-dom",
  "react-hook-form",
  "axios",
  "dayjs",
  "i18next",
  "react-i18next",
  "zustand",
];

const muiDeps = [
  "@emotion/styled",
  "@emotion/react",
  "@mui/icons-material",
  "@mui/system",
  "@mui/material",
  "@mui/x-date-pickers",
];

function renderChunks(deps: Record<string, string>) {
  const chunks = {};

  Object.keys(deps).forEach((key) => {
    switch (true) {
      case muiDeps.includes(key):
        chunks["mui"] = [key];
        break;
      case vendorDeps.includes(key):
        break;
      default:
        chunks[key] = [key];
        break;
    }
  });

  return chunks;
}

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
      minify: "esbuild",
      // minify: false,
      // sourcemap: true,
      outDir: "public/build",
      rollupOptions: {
        input: ["frontend/index.ts"],
        output: {
          manualChunks: {
            vendor: vendorDeps,
            ...renderChunks(dependencies),
          },
        },
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
