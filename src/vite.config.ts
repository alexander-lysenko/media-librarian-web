import react from '@vitejs/plugin-react-swc';

// @ts-ignore
import { defineConfig, loadEnv } from 'vite';

// @ts-ignore
import { tanstackRouter } from '@tanstack/router-plugin/vite';

/**
 * Define config for Vite build
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: command === 'serve' ? '' : '/build/',
    root: './',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    envDir: '../',
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './frontend/routes',
        generatedRouteTree: './frontend/routeTree.gen.ts',
        quoteStyle: 'single',
        semicolons: true,
      }),
      react(),
    ],
    build: {
      manifest: true,
      minify: true,
      sourcemap: true,
      outDir: 'public/build',
      rolldownOptions: {
        input: ['./frontend/index.ts'],
        advancedChunks: {
          groups: [
            {
              name: 'mui',
              test: /[\\/]node_modules[\\/]@mui[\\/]/
            },
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
            },
          ],
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
        '/api/v1': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
        },
        '/api/unsplash': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
        },
        '/icons': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
