import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'app/static',
  base: '/rule_engine/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/static/js'),
      '@components': path.resolve(__dirname, './app/static/js/components'),
    },
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})