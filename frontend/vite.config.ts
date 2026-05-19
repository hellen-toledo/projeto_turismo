import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:80';
const proxy = {
  '/api': {
    target: backendTarget,
    changeOrigin: true,
  },
  '/storage': {
    target: backendTarget,
    changeOrigin: true,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4173,
    strictPort: true,
    hmr: {
      host: 'localhost',
    },
    proxy,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    proxy,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
