import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request the frontend makes to /api/* gets forwarded to the backend.
      // This means your frontend code can just call fetch('/api/products')
      // with NO hardcoded host/port — works in dev (proxied to 5001) and in
      // production (same-origin, since Express serves the build itself).
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // If your product images/uploads are served by the backend from a
      // static folder (e.g. app.use('/uploads', express.static(...))),
      // proxy that too so <img src="/uploads/xyz.jpg"> resolves correctly
      // in dev instead of 404-ing against the Vite dev server.
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});