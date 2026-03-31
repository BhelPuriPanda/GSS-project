import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://daps-backend-fg54.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://daps-backend-fg54.onrender.com',
        changeOrigin: true,
      },
      '/compare': {
        target: 'https://daps-python.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
