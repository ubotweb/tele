import { defineConfig } from 'vite';
import honox from 'honox/vite';
import client from 'honox/vite/client';
import adapter from '@hono/vite-dev-server/cloudflare';

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()]
    };
  }

  return {
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          // Memastikan output file SSR diberi nama _worker.js untuk Cloudflare Pages
          entryFileNames: '_worker.js' 
        }
      },
      ssr: 'app/server.ts'
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
