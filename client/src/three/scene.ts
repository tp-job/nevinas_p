import * as THREE from "three";
export const createScene = (color: string | number = 0xfafaf9) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(color);
  return scene;
};
