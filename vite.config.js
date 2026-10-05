import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Node 18 resolves "localhost" to IPv6 only; listen on all interfaces so 127.0.0.1 works too.
    host: true,
    port: 5173,
    open: true,
  },
});
