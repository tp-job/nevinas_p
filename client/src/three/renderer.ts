import * as THREE from "three";
export const createRenderer = (
  canvas: HTMLCanvasElement,
  width?: number,
  height?: number,
) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width || window.innerWidth, height || window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  /* Enable shadows renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; */ return renderer;
};
