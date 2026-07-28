'use client';

/**
 * SpiralRingStage.tsx — centre-stage GLB viewer for TimelineScattered
 * Nocturnal Atelier v3.2
 *
 * WHAT IT DOES
 * ───────────────────────────────────────────────────────────────────────────
 * Renders `spiral-ring` in the dead centre of the slide, behind the four
 * quadrant feature blocks. The camera drifts with the pointer; the model turns
 * slowly on its own axis. Everything else in this file is about making that
 * affordable.
 *
 * WHY RAW three.js AND NOT @react-three/fiber
 * ───────────────────────────────────────────────────────────────────────────
 * R3F's <Canvas> constructs its own WebGLRenderer, which routes around
 * `src/three/webglGuard.ts`. That guard exists because an unguarded renderer
 * got the deployed page blacklisted by Chrome's context-loss counter and took
 * the whole portfolio down with it (see the file header there). A decorative
 * background is never worth reintroducing that failure mode, so this goes
 * through `createGuardedRenderer` like every other WebGL surface in the app.
 *
 * DEVICE GATING — two independent signals, per CLAUDE.md rule 2
 * ───────────────────────────────────────────────────────────────────────────
 * `isMobile` and `tier` answer different questions and are used separately:
 *
 *   isMobile → WHICH ASSET. Phones get the lq build (25k tris / 512² maps,
 *              271 KB) instead of hq (60k tris / 1024² maps, 614 KB), plus a
 *              lower pixel-ratio cap, antialias off, and a 30 fps cap. This is
 *              the "reduce quality on mobile" requirement, and it keys off
 *              screen/input class — the only signal Lighthouse's mobile profile
 *              reports honestly (rule 3).
 *   tier     → WHETHER TO RENDER AT ALL. `low` means the hardware genuinely
 *              can't afford it; those devices get the CSS fallback halo. Note a
 *              phone is always `low` tier, so mobile currently lands on the
 *              fallback by that rule — `renderOnLowTier` lets the caller opt
 *              phones back in to the lq path (which is what the slide does).
 *   reducedMotion → renders exactly one frame and stops. Composition intact,
 *              no animation, no rAF.
 *
 * COST CONTROL
 * ───────────────────────────────────────────────────────────────────────────
 * - Nothing is fetched or constructed until an IntersectionObserver says the
 *   slide is within 200px of the viewport. This is slide 8-ish of 18 on the
 *   homepage; it must not touch the initial load.
 * - GLTFLoader / meshopt decoder / RoomEnvironment are dynamic imports so they
 *   land in their own chunk rather than on the homepage critical path.
 * - The rAF loop stops when the slide scrolls away and when the tab is hidden.
 *   A background <canvas> spinning a 60k-tri PBR model is pure battery burn.
 */

import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import { useDeviceProfile } from '@/hooks/useDeviceCapability';
import { createGuardedRenderer, isWebGLAvailable, releaseRenderer } from '@/three/webglGuard';
import styles from '@/styles/module/SpiralRingStage.module.css';

/*
 * Served from public/, referenced by absolute path — NOT imported from src/.
 *
 * The obvious version (`import url from '@/models/x.glb'`) builds fine and gets
 * a hashed filename, but breaks `npm run dev`: Vite's dev server answers a
 * browser fetch() for /src/**\/*.glb with the 406-byte JS module that exports
 * the URL rather than the file itself, so GLTFLoader receives "export default"
 * and dies in JSON.parse. Dev-only breakage that a production build hides is
 * the worst kind, so the models live in public/ where dev and prod agree.
 *
 * Consequence: no content hash. These filenames are treated as immutable — a
 * re-exported model gets a NEW filename (see scripts/optimize-models.mjs).
 */
const MODEL_HQ = '/models/spiral-ring-hq.glb';
const MODEL_LQ = '/models/spiral-ring-lq.glb';

/* ─────────────────────────────────────────────────
   TUNING
───────────────────────────────────────────────── */

/** Camera distance at 1:1 aspect. Pulled back further in portrait, see fit(). */
const BASE_DISTANCE = 5.2;

/** Largest model dimension after normalisation, in world units. */
const TARGET_SIZE = 2.6;

/** How far the camera slides at full pointer deflection. Deliberately small —
    "moves slightly" is the brief, and a big sweep reads as a bug, not depth. */
const PARALLAX_X = 0.85;
const PARALLAX_Y = 0.55;

/** Camera easing per frame at 60fps. Low = laggy = depth, same reasoning as the
    Framer spring on the surrounding feature blocks. */
const CAMERA_EASE = 0.06;

/** Idle Y-axis rotation, radians per second. */
const SPIN_SPEED = 0.16;

/** Mobile renders at half rate. The model turns slowly enough that 30fps is
    indistinguishable, and it halves GPU time and battery draw. */
const MOBILE_FRAME_MS = 1000 / 30;

/**
 * Release every GPU resource under `root`.
 *
 * three disposes nothing automatically — geometries, materials and textures
 * hold VRAM until told otherwise, and a GLTF scene owns all three. Textures are
 * found by scanning material properties rather than by naming the slots
 * (`map`, `normalMap`, …) so a re-exported asset that gains, say, an AO map
 * doesn't quietly start leaking.
 */
function disposeTree(root: THREE.Object3D | null): void {
  root?.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.geometry.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      material.dispose();
    }
  });
}

export interface SpiralRingStageProps {
  /**
   * Normalised pointer position, -1 → +1, sourced from the parent slide so we
   * don't attach a second mousemove listener for the same data. Optional — when
   * absent the camera holds centre; on touch devices it drifts on its own
   * regardless, since there is no hover position to track.
   */
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  /**
   * Render on `low`-tier devices using the lq asset instead of showing the CSS
   * fallback. Phones are always low tier, so this is what puts the model on
   * mobile at all — the caller opts in knowing it costs a WebGL context.
   */
  renderOnLowTier?: boolean;
  className?: string;
}

const SpiralRingStage: React.FC<SpiralRingStageProps> = ({
  pointerX,
  pointerY,
  renderOnLowTier = false,
  className,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { tier, isMobile, reducedMotion } = useDeviceProfile();

  /** True once the slide is close enough to the viewport to be worth building. */
  const [near, setNear] = useState(false);
  /** Drives the fade-in — the canvas stays transparent until the GLB is decoded. */
  const [ready, setReady] = useState(false);

  /* Live intersection state for the render loop. Kept in a ref, not state: the
     loop reads it every frame and re-rendering React 60x/s would be absurd. */
  const visibleRef = useRef(false);

  /* Pointer values are read inside rAF, so they must not be effect deps —
     a ref keeps the effect from tearing down when the parent re-renders. */
  const pointerRef = useRef({ x: pointerX, y: pointerY });
  pointerRef.current = { x: pointerX, y: pointerY };

  /*
   * The device profile is read through a ref, NOT through the scene effect's
   * deps, and this is load-bearing.
   *
   * `useDeviceProfile` deliberately starts pessimistic ({ tier: 'low',
   * isMobile: true }) and relaxes in a mount effect once it can probe. If the
   * scene effect depended on `isMobile`, that one-render correction would tear
   * down a live WebGL context and rebuild it — observed in practice as the lq
   * asset being fetched and immediately thrown away for the hq one. Churning
   * contexts is precisely what got the deployed page blacklisted before (see
   * three/webglGuard.ts), so the effect resolves the profile ONCE at build time
   * and holds that decision.
   *
   * The same reasoning covers a 2-in-1 docking a mouse mid-visit: `isMobile`
   * flips, and rebuilding the whole scene to swap LOD would cost far more than
   * the sharper asset is worth.
   */
  const profileRef = useRef({ isMobile, reducedMotion });
  profileRef.current = { isMobile, reducedMotion };

  /*
   * `allowed` stays a dep because it gates whether a context may exist at all.
   * It only ever flips false → true (a `low` device relaxing to `high` without
   * `renderOnLowTier`), which is exactly the case that SHOULD build.
   */
  const allowed = (tier === 'high' || renderOnLowTier) && isWebGLAvailable();

  /* ── Near-viewport gate ─────────────────────────────────────────────────
     Two thresholds from one observer: `near` (200px margin) latches once and
     triggers the build; `visibleRef` tracks actual on-screen state and gates
     the loop so an off-screen slide costs nothing. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !allowed) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      visibleRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) setNear(true);
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowed]);

  /* ── Scene lifecycle ────────────────────────────────────────────────────
     One effect, one context, built at most once per mount. See profileRef above
     for why the device profile is read here rather than declared as a dep. */
  useEffect(() => {
    if (!near || !allowed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    /* Snapshot the profile for the lifetime of this context. Everything below
       reads these locals — never the render-scoped props — so the scene can't
       half-change out from under itself. */
    const { isMobile, reducedMotion } = profileRef.current;

    /* Set before any await. The async model load can resolve after unmount, and
       a renderer released twice or a scene mutated post-teardown is exactly the
       kind of leak that trips the guard's live-context cap. */
    let disposed = false;
    let rafId = 0;

    const renderer = createGuardedRenderer({
      canvas,
      alpha: true,
      // MSAA is the single biggest fill-rate cost here and phones can't spare
      // it. The model is a smooth organic form, so the aliasing it hides is
      // minimal at mobile pixel densities anyway.
      antialias: !isMobile,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });
    // Guard returns null when the browser refuses a context. Bail to the CSS
    // fallback rather than throwing — a background effect must never be able to
    // take the page down.
    if (!renderer) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, BASE_DISTANCE);

    /* Base Z is owned by fit(); the loop only ever touches x/y. */
    let baseZ = BASE_DISTANCE;

    /* A modest key light on top of the environment map. The environment does
       the PBR work; this just gives the silhouette a direction. */
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 4, 5);
    scene.add(key, new THREE.AmbientLight(0xc8cdeb, 0.35));

    const group = new THREE.Group();
    scene.add(group);

    /* Resources created inside the async block, captured for cleanup. */
    let envRenderTarget: THREE.WebGLRenderTarget | null = null;
    let model: THREE.Group | null = null;

    const fit = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      /* In portrait the horizontal FOV collapses, so a ring framed for a wide
         viewport would clip at the sides. Backing off by the aspect ratio keeps
         the whole silhouette on screen; the clamp stops extreme viewports from
         pushing it to a speck. */
      baseZ = aspect < 1 ? BASE_DISTANCE / Math.max(aspect, 0.55) : BASE_DISTANCE;
      camera.position.z = baseZ;
      camera.updateProjectionMatrix();
    };

    fit();
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(wrap);

    const clock = new THREE.Clock();
    const renderFrame = () => renderer.render(scene, camera);

    /* ── Async build ─────────────────────────────────────────────────────
       Loader, meshopt decoder and the procedural environment are all dynamic
       imports: they're worth ~100KB and none of it belongs on the homepage's
       initial chunk. */
    (async () => {
      const [{ GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
      ]);
      if (disposed) return;

      /* The GLBs are EXT_meshopt_compression (see scripts/optimize-models.mjs).
         Without this the loader throws on an unsupported extension. */
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);

      /* Kick the download off BEFORE building the environment: the PMREM pass
         below is a ~270ms synchronous main-thread block on first run, and the
         GLB fetch is the longer pole. Starting the request first means the two
         overlap instead of stacking. */
      const url = isMobile ? MODEL_LQ : MODEL_HQ;
      const modelPromise = loader.loadAsync(url).catch((err: unknown) => {
        console.warn('[SpiralRingStage] model failed to load; keeping CSS fallback.', err);
        return null;
      });

      /* A procedural room instead of an HDRI: no network request, no decode,
         and it gives the material something to reflect.

         This is NOT optional and is not a candidate for the mobile quality cut.
         The asset ships `metalness: 1` with a metalness map, and a metal PBR
         surface reflects its environment for essentially all of its shading —
         measured on this exact model, dropping `scene.environment` puts 58.5%
         of its pixels at near-black and drags mean luminance from 121 to 33.
         Compensating with brighter lights only gets to 65 with 30% still black:
         you cannot light your way out of a missing reflection. Skipping this
         wouldn't be a lower-quality model, it would be a broken-looking one.

         The 270ms first-call cost is ~244ms of one-time shader compilation
         (a second fromScene() in the same context measures 24ms) — the price of
         the first PBR render in any fresh WebGL context, not of PMREM as such.
         It is paid once, off the critical path, only when the slide is near. */
      const pmrem = new THREE.PMREMGenerator(renderer);
      envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      pmrem.dispose();
      scene.environment = envRenderTarget.texture;

      const gltf = await modelPromise;
      if (disposed || !gltf) return;

      model = gltf.scene;

      /* Normalise: the export is neither centred nor unit-scaled, so frame it
         ourselves rather than hand-tuning magic offsets that break the next
         time the asset is re-exported. */
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) model.scale.setScalar(TARGET_SIZE / maxDim);

      /* No shadow maps anywhere in this scene — there's no ground plane to
         catch them, so casting would be pure cost for zero pixels. */
      model.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = false;
          node.receiveShadow = false;
        }
      });

      /* A slight lean reads as "placed" rather than "floating at origin". */
      group.rotation.set(0.18, -0.4, 0.08);
      group.add(model);

      /*
       * Paint immediately rather than waiting for the next animation tick.
       *
       * This is also the ONLY draw the reduced-motion path ever gets, so it has
       * to happen here — after the model is in the scene. Rendering a single
       * frame up front (before the ~300ms load) drew an empty scene and left
       * those users staring at a blank canvas forever.
       */
      camera.lookAt(0, 0, 0);
      renderFrame();
      setReady(true);
    })();

    /* ── Render loop ─────────────────────────────────────────────────────── */
    let sinceLastFrame = 0;

    const loop = () => {
      rafId = requestAnimationFrame(loop);

      /* Delta is clamped: returning to a backgrounded tab hands back a huge
         delta that would snap the model through a visible jump. */
      const delta = Math.min(clock.getDelta(), 0.05);

      // Off-screen or backgrounded: keep the loop alive (cheap) but skip the
      // GPU work entirely.
      if (!visibleRef.current || document.hidden) return;

      if (isMobile) {
        sinceLastFrame += delta * 1000;
        if (sinceLastFrame < MOBILE_FRAME_MS) return;
        sinceLastFrame = 0;
      }

      const elapsed = clock.getElapsedTime();

      /* Pointer drives the camera wherever there is one. Touch devices have no
         hover position to read — their MotionValues would sit at 0 forever — so
         they get a slow lissajous drift instead. Keyed off `isMobile` rather
         than "did the values change", because 0,0 is a legitimate pointer
         position (dead centre, and where the parent resets on mouseleave). */
      const targetX = isMobile
        ? Math.sin(elapsed * 0.22) * PARALLAX_X * 0.5
        : (pointerRef.current.x?.get() ?? 0) * PARALLAX_X;
      const targetY = isMobile
        ? Math.cos(elapsed * 0.17) * PARALLAX_Y * 0.5
        : -(pointerRef.current.y?.get() ?? 0) * PARALLAX_Y;

      /* Frame-rate-independent exponential ease, so the 30fps mobile path
         settles at the same speed as the 60fps desktop one. */
      const ease = 1 - Math.pow(1 - CAMERA_EASE, delta * 60);
      camera.position.x += (targetX - camera.position.x) * ease;
      camera.position.y += (targetY - camera.position.y) * ease;
      camera.position.z = baseZ;
      camera.lookAt(0, 0, 0);

      group.rotation.y += SPIN_SPEED * delta;

      renderFrame();
    };

    /* Reduced motion gets the single frame drawn above and no loop at all —
       the composition survives, the animation doesn't. */
    if (!reducedMotion) rafId = requestAnimationFrame(loop);

    /* ── Teardown ────────────────────────────────────────────────────────
       One path, whatever happened above. three does not garbage-collect GPU
       memory; every geometry, material and texture has to be disposed by hand
       or the VRAM stays allocated for the life of the document.

       `model` and `envRenderTarget` may still be null here — unmounting during
       the async build is the common case on a fast scroll past the slide, and
       `disposed` stops that build from touching anything afterwards. */
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      disposeTree(model);
      envRenderTarget?.dispose();
      key.dispose();
      releaseRenderer(renderer);
    };
  }, [near, allowed]);

  /* Fallback is not an error state — it's the design's floor. The halo keeps
     the centre of the composition occupied on every device that skips WebGL. */
  if (!allowed) {
    return <div className={[styles.stage, styles.fallback, className].filter(Boolean).join(' ')} aria-hidden="true" />;
  }

  return (
    <div
      ref={wrapRef}
      className={[styles.stage, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {/* The halo sits under the canvas permanently: it covers the load gap and
          afterwards reads as the model's ambient glow. */}
      <div className={styles.halo} />
      <canvas
        ref={canvasRef}
        className={[styles.canvas, ready ? styles.canvasReady : ''].filter(Boolean).join(' ')}
      />
    </div>
  );
};

export default SpiralRingStage;
