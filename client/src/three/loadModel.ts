import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

export const loadModel = async (
  url: string
): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center model
        model.position.sub(center);

        // Normalize scale
        const maxDim = Math.max(size.x, size.y, size.z);
        const TARGET_SIZE = 2;
        if (maxDim > 0) {
          model.scale.setScalar(TARGET_SIZE / maxDim);
        }

        // Shadows
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        resolve(model);
      },
      undefined,
      reject
    );
  });
};