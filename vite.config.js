import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginProxy from './vite-plugin-proxy.js'

export default defineConfig({
  plugins: [
    react(),
    vitePluginProxy() // Proxy built into Vite dev server!
  ],
  server: {
    host: '0.0.0.0', // Expose on all network interfaces
    port: 5173,
  },
})

