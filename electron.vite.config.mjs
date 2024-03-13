import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main'
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'electron/main/index.js')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload'
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'electron/preload/index.js')
      }
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer'
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'electron/renderer/index.js')
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
