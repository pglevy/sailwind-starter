import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    // Set the warning limit to 1000 kB (1 MB)
    chunkSizeWarningLimit: 1000, 
  }
})
