import type { FC } from "react";

/**
 * RouteFallback — the router's Suspense fallback.
 *
 * Deliberately tiny, and deliberately NOT `LoadingPage`.
 *
 * LoadingPage is a 626-line Neo-Tokyo HUD that lazy-imports LaserFlow and opens
 * a full-screen WebGL context. Because it was the Suspense fallback, it mounted
 * and unmounted on EVERY lazy route transition — which is precisely the loop
 * documented at the top of `three/webglGuard.ts` that got a deployed build
 * blacklisted by Chrome for page-caused context losses. That has two guards on
 * it now (the `beamBudgetSpent` latch and the guard itself), but the honest fix
 * is to stop putting a WebGL screen behind a spinner that typically shows for a
 * few hundred milliseconds.
 *
 * This renders no JS animation and no GPU work: a CSS-only pulse on tokens,
 * which costs nothing and cannot fail. LoadingPage is kept for the cold boot in
 * `index.html`/first paint and the `/loading` debug route, where a full-screen
 * treatment is actually the point.
 */
const RouteFallback: FC = () => (
  <div
    role="status"
    aria-label="Loading page"
    className="flex min-h-svh w-full items-center justify-center bg-light-bg dark:bg-dark-bg"
  >
    <div className="flex flex-col items-center gap-4">
      {/* Three dots, CSS keyframes only — no framer-motion, no rAF, no WebGL. */}
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-haze dark:bg-periwinkle
                       animate-pulse motion-reduce:animate-none"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <span className="text-xs tracking-[0.2em] uppercase text-light-text-muted dark:text-dark-text-muted">
        Loading
      </span>
    </div>
  </div>
);

export default RouteFallback;
