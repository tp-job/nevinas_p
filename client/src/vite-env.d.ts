/// <reference types="vite/client" />

// vite-imagetools: a plain default import with directives (e.g.
// `foo.png?format=webp&w=600`) resolves to the emitted asset URL string.
declare module "*&format=webp" {
  const src: string;
  export default src;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.gltf" {
  const src: string;
  export default src;
}
