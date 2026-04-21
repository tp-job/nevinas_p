import * as THREE from "three";
export const createCamera = (
  width: number,
  height: number,
  fov: number = 45,
) => {
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  camera.position.set(0, 1, 8);
  return camera;
};
