import { useEffect, useRef } from "react";
import * as THREE from "three";
import { lerp, smoothstep } from "@/lib/portfolioScroll";

type BgRefs = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pixPairs: THREE.Group[];
  bgIcos: THREE.Mesh[];
  bgRing: THREE.Mesh;
};

export function usePortfolioBackground(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  current: number,
  isLight: boolean,
  isContact: boolean,
) {
  const threeRef = useRef<BgRefs | null>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      parallaxRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1e202c, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 10;

    const pxGeo = new THREE.PlaneGeometry(0.2, 0.2);
    const pxMats = [
      new THREE.MeshBasicMaterial({ color: 0x5983fc }),
      new THREE.MeshBasicMaterial({ color: 0x964ec2 }),
      new THREE.MeshBasicMaterial({ color: 0x3e60c1 }),
    ];
    const pixPairs: THREE.Group[] = [];

    for (let i = 0; i < 12; i++) {
      const g = new THREE.Group();
      const s = 0.1 + Math.random() * 0.1;
      const mat = pxMats[i % 3];
      const a = new THREE.Mesh(pxGeo, mat);
      const b = new THREE.Mesh(pxGeo, mat);
      a.position.set(s, s, 0);
      b.position.set(-s, -s, 0);
      g.add(a, b);
      g.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 5 - 1,
      );
      g.userData = {
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.002,
        vr: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(g);
      pixPairs.push(g);
    }

    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x2e4583,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const bgIcos: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), icoMat.clone());
      m.scale.setScalar(0.5 + Math.random() * 1.8);
      m.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 9,
        -5 - Math.random() * 4,
      );
      m.userData = {
        rx: (Math.random() - 0.5) * 0.003,
        ry: (Math.random() - 0.5) * 0.004,
      };
      scene.add(m);
      bgIcos.push(m);
    }

    const bgRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.04, 6, 48),
      new THREE.MeshBasicMaterial({
        color: 0x50409a,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
    );
    bgRing.position.set(3.5, -1.5, -7);
    bgRing.rotation.x = 0.4;
    scene.add(bgRing);

    threeRef.current = { renderer, scene, camera, pixPairs, bgIcos, bgRing };

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      pxGeo.dispose();
      pxMats.forEach((m) => m.dispose());
      threeRef.current = null;
    };
  }, [canvasRef]);

  useEffect(() => {
    const refs = threeRef.current;
    if (!refs) return;

    const { renderer, scene, camera, pixPairs, bgIcos, bgRing } = refs;
    const loop = () => {
      const t = frameRef.current * 0.01;
      frameRef.current++;

      const pmx = parallaxRef.current.x;
      const pmy = parallaxRef.current.y;

      camera.position.x += (pmx * 0.38 - camera.position.x) * 0.04;
      camera.position.y += (-pmy * 0.24 - camera.position.y) * 0.04;
      camera.position.z = lerp(10, 8.2, current);
      camera.lookAt(0, 0, 0);

      if (isLight) {
        renderer.setClearColor(0xf0eeeb, 1);
      } else if (isContact) {
        renderer.setClearColor(0x13141e, 1);
      } else {
        renderer.setClearColor(0x1e202c, 1);
      }

      const bgOp = isLight ? 0 : 1;
      pixPairs.forEach((g) => {
        g.children.forEach((c) => {
          const mesh = c as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
          mesh.material.opacity = bgOp;
          mesh.material.transparent = true;
        });
        const ud = g.userData as {
          vx: number;
          vy: number;
          vr: number;
          phase: number;
        };
        g.position.x += ud.vx;
        g.position.y += ud.vy + Math.sin(t + ud.phase) * 0.0007;
        g.rotation.z += ud.vr;
        if (g.position.x > 10) g.position.x = -10;
        if (g.position.x < -10) g.position.x = 10;
        if (g.position.y > 7) g.position.y = -7;
        if (g.position.y < -7) g.position.y = 7;
      });

      bgIcos.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.opacity = isLight ? 0.04 : 0.18;
        const ud = m.userData as { rx: number; ry: number };
        m.rotation.x += ud.rx;
        m.rotation.y += ud.ry;
      });

      const ringMat = bgRing.material as THREE.MeshBasicMaterial;
      ringMat.opacity = isLight ? 0.04 : 0.2;
      bgRing.rotation.z += 0.025;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, isLight, isContact]);
}

export function usePortfolioGyro(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  visible: boolean,
  tlLocal: number,
) {
  const gyroRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    outerRing: THREE.Mesh;
    middleRing: THREE.Mesh;
    innerRing: THREE.Mesh;
    gyroGroup: THREE.Group;
    gGlow: THREE.PointLight;
    glowOrb: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  } | null>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      parallaxRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mkMat = (hex: number, hexEm: number, rough: number) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        metalness: 0.97,
        roughness: rough,
        emissive: new THREE.Color(hexEm),
        emissiveIntensity: 0.16,
      });

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.8, 8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x293556, 0.6));
    const gKey = new THREE.DirectionalLight(0xffffff, 2.5);
    gKey.position.set(5, 8, 6);
    const gRim = new THREE.DirectionalLight(0x5983fc, 1.4);
    gRim.position.set(-6, 2, -4);
    const gFill = new THREE.DirectionalLight(0x964ec2, 0.7);
    gFill.position.set(0, -4, 4);
    const gFlam = new THREE.DirectionalLight(0xff7bbf, 0.3);
    gFlam.position.set(4, 3, 2);
    const gGlow = new THREE.PointLight(0x5983fc, 6, 8);
    gGlow.position.set(0.25, -1.6, 0.3);
    scene.add(gKey, gRim, gFill, gFlam, gGlow);

    const gyroGroup = new THREE.Group();
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.175, 40, 220),
      mkMat(0x293556, 0x3e60c1, 0.07),
    );
    outerRing.rotation.x = Math.PI / 3;
    outerRing.rotation.z = Math.PI / 9;
    const middleRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.135, 40, 220),
      mkMat(0x313866, 0x5983fc, 0.06),
    );
    middleRing.rotation.x = -Math.PI / 5;
    middleRing.rotation.y = Math.PI / 4;
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.095, 32, 220),
      mkMat(0x50409a, 0x964ec2, 0.09),
    );
    innerRing.rotation.x = 0.18;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 128, 64),
      new THREE.MeshStandardMaterial({
        color: 0x0d1220,
        metalness: 1,
        roughness: 0.14,
        emissive: new THREE.Color(0x293556),
        emissiveIntensity: 0.28,
      }),
    );
    const glowOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x5983fc }),
    );
    glowOrb.position.set(0.22, -0.78, 0.25);
    gyroGroup.add(outerRing, middleRing, innerRing, sphere, glowOrb);
    gyroGroup.scale.setScalar(0.7);
    scene.add(gyroGroup);

    gyroRef.current = {
      renderer,
      scene,
      camera,
      outerRing,
      middleRing,
      innerRing,
      gyroGroup,
      gGlow,
      glowOrb,
    };

    const resize = () => {
      const sz = Math.round(
        Math.min(window.innerWidth * 0.5, window.innerHeight * 0.58, 580),
      );
      canvas.style.width = `${sz}px`;
      canvas.style.height = `${sz}px`;
      renderer.setSize(sz, sz, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      gyroRef.current = null;
    };
  }, [canvasRef]);

  useEffect(() => {
    if (!visible) return;
    const refs = gyroRef.current;
    if (!refs) return;

    const {
      renderer,
      scene,
      camera,
      outerRing,
      middleRing,
      innerRing,
      gyroGroup,
      gGlow,
      glowOrb,
    } = refs;

    const loop = () => {
      const t = frameRef.current * 0.01;
      frameRef.current++;

      outerRing.rotation.z += 0.005;
      middleRing.rotation.y += 0.007;
      innerRing.rotation.x += 0.003;
      gyroGroup.rotation.y = tlLocal * Math.PI * 2.2;
      const scl = 0.58 + smoothstep(Math.min(tlLocal * 4.5, 1)) * 0.44;
      gyroGroup.scale.setScalar(scl);

      const pmx = parallaxRef.current.x;
      camera.position.x = pmx * 0.6;
      camera.position.y = 0.8 + Math.sin(t * 0.4) * 0.14;
      camera.lookAt(0, 0, 0);
      gGlow.intensity = 5 + Math.sin(t * 1.3) * 2.2;
      glowOrb.material.color.setHSL(0.625 + Math.sin(t * 0.4) * 0.04, 0.92, 0.62);

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, tlLocal]);
}
