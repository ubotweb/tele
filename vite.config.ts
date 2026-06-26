import { defineConfig } from 'vite';
import honox from 'honox/vite';
import client from 'honox/vite/client';
import adapter from '@hono/vite-dev-server/cloudflare';

export default defineConfig(({ mode }) => {
  // Mode Klien: Membangun komponen interaktif frontend (Islands)
  if (mode === 'client') {
    return {
      plugins: [client()]
    };
  }

  // Mode Server (Bawaan): Membangun backend SSR tanpa mencari index.html
  return {
    build: {
      emptyOutDir: false,
      ssr: 'app/server.ts' // Mengarahkan Vite secara eksplisit ke file server
    },
    plugins: [
      honox({
        devServer: {
          adapter
        }
      })
    ]
  };
});
