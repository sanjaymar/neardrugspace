import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      'ketcher-core': 'ketcher-core/dist/index.js',
      'ketcher-react': 'ketcher-react/dist/index.js'
    
    }
  },
  server: {
    cors: true,
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://172.20.137.175:49222', 
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 将api替换为空
      },
      '/api2': {
        target: 'http://172.20.137.175:90', 
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api2/, '') // 将api2替换为空
      }
    }
  },
  define: {
    'process.env': {},
    global: 'window'
  }
});