import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/usccb': {
        target: 'https://bible.usccb.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/usccb/, ''),
        secure: false
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  }
})
