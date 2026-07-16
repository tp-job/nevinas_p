import { lazy, Suspense, useEffect, useRef, useState, type FC } from "react";
import { useReducedMotion } from "framer-motion";

// three.js lives entirely inside LiquidEther. Lazy-importing it keeps the ~500 KB
// three-vendor chunk off the homepage's critical path — it now loads on idle,
// after first paint, instead of blocking LCP.
const LiquidEther = lazy(() => import("@/components/effect/LiquidEther"));

/** DS periwinkle mesh — index.css @theme palette, minimal wave motion */
const DS_ETHER_PALETTE = [
  "#E8EAF5", // periwinkle-pale
  "#C8CDEB", // periwinkle
  "#A8B0D9", // periwinkle-mid
  "#878CB4", // cool
];

// Static placeholder painted immediately (and the permanent background for
// reduced-motion users). Approximates the effect's resting periwinkle field so
// the swap to the live sim is visually seamless.
const PLACEHOLDER_GRADIENT =
  "radial-gradient(120% 120% at 50% 0%, #E8EAF5 0%, #C8CDEB 32%, #A8B0D9 60%, #878CB4 100%)";

const LiquidEtherBackdrop: FC = () => {
  const reduced = useReducedMotion();
  const [mountEffect, setMountEffect] = useState(false);
  const idleRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    // Defer WebGL init until the browser is idle so it never competes with the
    // initial render / hydration. Falls back to a timeout where rIC is missing.
    const ric = window.requestIdleCallback;
    if (ric) {
      idleRef.current = ric(() => setMountEffect(true), { timeout: 2500 });
      return () => {
        if (idleRef.current != null) window.cancelIdleCallback?.(idleRef.current);
      };
    }
    const t = window.setTimeout(() => setMountEffect(true), 1500);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
      style={{ background: PLACEHOLDER_GRADIENT }}
    >
      {mountEffect && (
        <Suspense fallback={null}>
          <LiquidEther
            className="h-full w-full"
            style={{ width: "100%", height: "100%", WebkitFontSmoothing: "antialiased" }}
            colors={DS_ETHER_PALETTE}
            resolution={0.5}
            mouseForce={10}
            cursorSize={90}
            autoDemo
            autoSpeed={0.85}
            autoIntensity={0.42}
            isViscous
            viscous={32}
            iterationsViscous={26}
          />
        </Suspense>
      )}
    </div>
  );
};

export default LiquidEtherBackdrop;
