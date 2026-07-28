/// <reference types="vite/client" />

// vite-imagetools: a plain default import with directives (e.g.
// `foo.png?format=webp&w=600`) resolves to the emitted asset URL string.
declare module "*&format=webp" {
  const src: string;
  export default src;
}

// NO `declare module "*.glb"` here, on purpose.
//
// 3D models live in public/models/ and are referenced by absolute path
// (`/models/<name>.glb`), never imported. Importing one from src/ builds fine
// but breaks `npm run dev`: Vite's dev server answers a browser fetch() for
// /src/**/*.glb with the ~400-byte JS module that exports the URL instead of
// the file, so GLTFLoader gets "export default" and dies in JSON.parse.
//
// Leaving the ambient declaration out means that mistake fails loudly at the
// type level instead of silently working in prod and breaking in dev. See
// scripts/optimize-models.mjs for the full write-up.
