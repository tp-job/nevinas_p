/**
 * ParticleScrollLazy — the form the effect should be used in on real pages.
 *
 * ParticleScroll's core is ~14 kB of GLSL and WebGL setup that can only paint
 * when the browser has the experimental html-in-canvas APIs — which ship behind
 * a Chromium flag and are absent essentially everywhere. Importing the effect
 * directly therefore puts a chunk on the critical path that, for very nearly
 * every visitor, downloads and then renders nothing.
 *
 * This component checks the two cheap gates FIRST — capability and device tier,
 * neither of which needs the core — and only then dynamically imports it. When
 * either gate says no, the children render as ordinary DOM and the core is
 * never requested at all.
 *
 * `children` doubles as the Suspense fallback, so the plain content is on
 * screen from the first paint and the effect simply takes over once its chunk
 * arrives. There is no spinner and no layout shift.
 */

import { Suspense, lazy, useMemo, type ReactNode } from "react";
import { supportsHtmlInCanvas } from "./particle-scroll/support";
import { useDeviceProfile } from "@/hooks/useDeviceCapability";
import type { ParticleScrollOptions } from "./particle-scroll/types";

const ParticleScroll = lazy(() => import("./ParticleScroll"));

export interface ParticleScrollLazyProps extends ParticleScrollOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Whether the effect should render — see ParticleScroll's own `active`. */
  active?: boolean;
  /** Force standalone element-scroll mode instead of slide progress. */
  useSlideProgress?: boolean;
}

export function ParticleScrollLazy({
  children,
  className,
  style,
  ...rest
}: ParticleScrollLazyProps) {
  const { tier, isMobile } = useDeviceProfile();

  // Probed once per mount. The result cannot change for the lifetime of a
  // document, so re-running it on every render would be pure waste.
  const supported = useMemo(() => supportsHtmlInCanvas(), []);
  const enabled = supported && !isMobile && tier !== "low";

  if (!enabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className={className} style={style}>
          {children}
        </div>
      }
    >
      <ParticleScroll className={className} style={style} {...rest}>
        {children}
      </ParticleScroll>
    </Suspense>
  );
}

export default ParticleScrollLazy;
