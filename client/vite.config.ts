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
    // Proxy /api to the backend so the httpClient's relative "/api" baseURL
    // works in dev without CORS or hardcoded hosts.
    //
    // Deliberately NOT proxying /uploads: gallery images live in client/public
    // and are served same-origin by the static host in production. Proxying
    // /uploads here would shadow public/ with the backend's 404s, so dev would
    // disagree with production about where images come from — which is exactly
    // how they ended up broken on the deployed site in the first place.
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  // `vite preview` serves the real production build (hashed chunks, minified),
  // which is the only way to exercise code-splitting locally. It needs the same
  // backend proxy as the dev server, otherwise every /work route trips the
  // global 5xx error overlay and can't be verified.
  preview: {
    port: 10006,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
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
    // NO manualChunks. A hand-rolled substring-based manualChunks previously
    // caused a production-only "Cannot read properties of undefined (reading
    // 'forwardRef')" — splitting by substring can place two modules of one
    // dependency cycle into different chunks, so a chunk reads an import
    // before the cycle has initialised it.
    //
    // Lumping everything into one 'vendor' chunk fixed that crash, but cost
    // far more than it saved: recharts, @xyflow, react-markdown, gsap and
    // animejs are reachable ONLY from lazy routes, yet every homepage visitor
    // downloaded them inside the 1 MB vendor bundle.
    //
    // Rollup's automatic chunking is cycle-safe by construction (it groups
    // modules by the set of entry/dynamic chunks that reach them, so a cycle
    // can never straddle a chunk boundary) AND splits along the existing
    // React.lazy() route boundaries. That gives correct output and a much
    // smaller homepage critical path, so we simply let it do its job.
  },
})
