import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://daps-backend-fg54.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://daps-backend-fg54.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
