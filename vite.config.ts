import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: './tsconfig.json'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      external: []
    }
  }
})
