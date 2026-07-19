import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // imagetools only transforms imports carrying a query directive
  // (e.g. `?format=webp&w=600`); plain image imports pass through untouched.
  plugins: [react(), tailwindcss(), imagetools()],
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
          // three.js (and @react-three/*) has no runtime dependency on React
          // internals at module-init time, so it's safe to isolate — it never
          // calls e.g. React.forwardRef() at the top level.
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
          // Everything else (react, react-dom, react-router, framer-motion,
          // gsap, recharts + its react-redux/@reduxjs/toolkit dependencies,
          // icons, mui, d3-*, victory) stays in ONE chunk. Splitting these
          // apart by substring previously created a circular dependency
          // between chunks (recharts → react-redux → react, but react-redux
          // and react-redux's own react-toolkit deps landed in different
          // chunks) which made "React" read as undefined mid-cycle —
          // surfacing as "Cannot read properties of undefined (reading
          // 'forwardRef')" in production only, since dev's non-bundled ESM
          // graph never hit the cycle.
          return 'vendor'
        },
      },
    },
  },
})
