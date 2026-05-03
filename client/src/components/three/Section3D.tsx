import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, Float } from "@react-three/drei";

interface ModelProps {
  url: string;
  rotationY?: number;
}

const Model = ({ url, rotationY = 0 }: ModelProps) => {
  const { scene } = useGLTF(url);
  return (
    <primitive object={scene} scale={1} rotation-y={rotationY} />
  );
};

interface Section3DProps {
  url: string;
  className?: string;
  rotationY?: number;
  intensity?: number;
  float?: boolean;
  interactive?: boolean;
  shadow?: boolean;
}

const Section3D: React.FC<Section3DProps> = ({
  url,
  className,
  rotationY = 0.003,
  intensity = 1.2,
  float = false,
  interactive = true,
  shadow = false,
}) => {
  const modelNode = <Model url={url} rotationY={rotationY} />;

  const modelContent = (
    <Stage
      intensity={intensity}
      environment="city"
      adjustCamera={!float}
    >
      {modelNode}
    </Stage>
  );

  return (
    <div className={className} style={{ background: 'transparent' }}>
      <Canvas shadows={shadow} camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          {interactive ? (
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              {float ? (
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                  {modelContent}
                </Float>
              ) : (
                modelContent
              )}
            </PresentationControls>
          ) : float ? (
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
              {modelContent}
            </Float>
          ) : (
            modelContent
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
export default Section3D;
