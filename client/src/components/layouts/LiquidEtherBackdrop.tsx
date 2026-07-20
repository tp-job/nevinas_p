import { lazy, Suspense, useEffect, useRef, useState, type FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";

// three.js lives entirely inside LiquidEther. Lazy-importing it keeps the ~500 KB
// three-vendor chunk off the homepage's critical path — it now loads on idle,
// after first paint, instead of blocking LCP.
const LiquidEther = lazy(() => import("@/components/effect/LiquidEther"));

// ─── Theme-aware mesh palettes (index.css @theme scale) ──────────────────────
// The ether renders the palette only where the fluid moves; at rest it is
// transparent, so the placeholder below is the dominant background tone. Both
// must match the active theme or dark mode gets a bright lavender wash.

/** Light: soft periwinkle motion streaks over a near-white field. */
const ETHER_PALETTE_LIGHT = [
  "#E8EAF5", // periwinkle-pale
  "#C8CDEB", // periwinkle
  "#A8B0D9", // periwinkle-mid
  "#878CB4", // cool
];

/** Dark: muted midnight→cool streaks — a subtle aurora, never a bright wash. */
const ETHER_PALETTE_DARK = [
  "#2E3558", // midnight-light
  "#465078", // haze
  "#5E6491", // cool-deep
  "#878CB4", // cool
];

// Placeholders fade OUT to the exact page bg (light #F0F1F8 / dark #0A0F19) at
// the edges so the mesh dissolves seamlessly into the plain-bg slides — no hard
// "purple → white" seam. Painted immediately and kept for reduced-motion users.
const PLACEHOLDER_LIGHT =
  "radial-gradient(140% 120% at 50% 0%, #E8EAF5 0%, #DDDFF0 45%, #F0F1F8 100%)";
const PLACEHOLDER_DARK =
  "radial-gradient(140% 120% at 50% 0%, #1E233C 0%, #13172B 48%, #0A0F19 100%)";

interface LiquidEtherBackdropProps {
  /**
   * Whether this backdrop's slide is currently on-screen. When false, the
   * whole layer fades to 0 and the WebGL loop pauses — letting a single shared
   * backdrop cover multiple slides at the cost of just one live context.
   * Defaults to true so standalone usage is unaffected.
   */
  active?: boolean;
}

const LiquidEtherBackdrop: FC<LiquidEtherBackdropProps> = ({ active = true }) => {
  const reduced = useReducedMotion();
  const { isDark } = useTheme();
  const { isMobile, reducedMotion } = useDeviceProfile();
  const [mountEffect, setMountEffect] = useState(false);
  const idleRef = useRef<number | null>(null);

  // Gated on MOBILE, not on the general capability tier.
  //
  // Every desktop and laptop gets the fluid sim, including modest ones — this
  // is the signature backdrop of the site and it is worth the frames there.
  // Phones and tablets do not: a full-screen viscous solve every frame is the
  // single largest drain on a handheld's battery and thermals, and it competes
  // with scrolling for the main thread. The radial-gradient placeholder below
  // is the dominant tone of the effect anyway, so those devices still get the
  // intended look, just static.
  //
  // reducedMotion is honoured separately — that is an accessibility
  // preference, not a performance guess, so it wins on any device.
  const allowEffect = !isMobile && !reducedMotion && !reduced;

  // Stable per-theme references — only remounts the WebGL colors on theme flip.
  const palette = isDark ? ETHER_PALETTE_DARK : ETHER_PALETTE_LIGHT;
  const placeholder = isDark ? PLACEHOLDER_DARK : PLACEHOLDER_LIGHT;

  useEffect(() => {
    if (!allowEffect) {
      // Tier can settle to 'low' after mount; tear the sim down if it does.
      setMountEffect(false);
      return;
    }
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
  }, [allowEffect]);

  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
      style={{ background: placeholder }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {mountEffect && (
        <Suspense fallback={null}>
          <LiquidEther
            className="h-full w-full"
            style={{ width: "100%", height: "100%", WebkitFontSmoothing: "antialiased" }}
            colors={palette}
            resolution={0.5}
            mouseForce={10}
            cursorSize={90}
            autoDemo
            autoSpeed={0.85}
            autoIntensity={0.42}
            isViscous
            viscous={32}
            iterationsViscous={26}
            paused={!active}
          />
        </Suspense>
      )}
    </motion.div>
  );
};

export default LiquidEtherBackdrop;
