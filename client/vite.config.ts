import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  server: {
    host: true,  // เปิดให้เข้าถึงจากเครือข่าย
    port: 10005,  // กำหนดพอร์ตใหม่
    // Proxy API + uploaded assets to the backend so the httpClient's
    // relative "/api" baseURL works in dev without CORS or hardcoded hosts.
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Split heavy third-party libraries into separate, long-term-cacheable
    // chunks so the main app bundle stays small and vendors download in
    // parallel (and stay cached across deploys since they rarely change).
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Order matters: check the more specific scopes before "react".
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui-vendor'
          if (
            id.includes('recharts') ||
            id.includes('@mui/x-charts') ||
            id.includes('d3-') ||
            id.includes('victory')
          )
            return 'charts-vendor'
          if (
            id.includes('framer-motion') ||
            id.includes('/motion/') ||
            id.includes('gsap') ||
            id.includes('animejs')
          )
            return 'motion-vendor'
          if (id.includes('react-router')) return 'router-vendor'
          if (id.includes('react-icons') || id.includes('remixicon') || id.includes('lucide')) return 'icons-vendor'
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
