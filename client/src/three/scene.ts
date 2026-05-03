import * as THREE from "three";
export const createScene = (color: string | number | null = null) => {
  const scene = new THREE.Scene();
  if (color !== null) {
    scene.background = new THREE.Color(color);
  }
  return scene;
};
