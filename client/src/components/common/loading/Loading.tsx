import { useId, type FC } from "react";
import "@/styles/components/loading.css";

/**
 * Loading — inline spinner for a page region.
 *
 * Palette: this is an SVG gradient, which is one of the places DS v3.2 sanctions
 * the sub-palette ("effects, SVG gradients, WebGL particles"). It previously
 * used Google's brand colours (#4285f4 / #db4437 / #f4b400 / #0f9d58), which
 * belong to no palette in this project at all.
 *
 * The stops come from CSS custom properties set on the wrapper so the ring
 * flips with the theme — periwinkle-family on charcoal, haze-family on the pale
 * background. A single fixed gradient is unreadable in one mode or the other.
 */
const Loading: FC<{ label?: string }> = ({ label = "Loading" }) => {
  // Gradient ids must be unique per instance: two spinners on one page with
  // hardcoded ids would both resolve `url(#gradient1)` to whichever mounted
  // first, silently recolouring one of them.
  const uid = useId().replace(/:/g, "");
  const outerId = `spin-outer-${uid}`;
  const innerId = `spin-inner-${uid}`;

  return (
    <div
      role="status"
      aria-label={label}
      // Light-mode stops are the DARKER end of the palette and dark-mode stops
      // the lighter end, so the ring clears 3:1 against its background either
      // way (WCAG 1.4.11 — this is a meaningful non-text graphic). `--color-cool`
      // was the first choice for light `--spin-b` and measured 2.89:1 on
      // #F0F1F8; `--color-cool-deep` takes it to 5.03:1.
      className="flex justify-center items-center min-h-[350px]
                 [--spin-a:var(--color-haze)] [--spin-b:var(--color-cool-deep)]
                 [--spin-c:var(--color-haze-deep)] [--spin-d:var(--color-sub-ev1)]
                 dark:[--spin-a:var(--color-periwinkle)] dark:[--spin-b:var(--color-sub-cool)]
                 dark:[--spin-c:var(--color-sub-french)] dark:[--spin-d:var(--color-cool)]"
    >
      <div className="inline-block w-[100px] h-[100px] relative">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="w-full h-full origin-center
                     animate-[spin_2s_linear_infinite]
                     motion-reduce:animate-none"
        >
          <defs>
            <linearGradient id={outerId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--spin-a)" />
              <stop offset="100%" stopColor="var(--spin-b)" />
            </linearGradient>
            <linearGradient id={innerId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--spin-c)" />
              <stop offset="100%" stopColor="var(--spin-d)" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={`url(#${outerId})`}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="[stroke-dasharray:251.3274] [stroke-dashoffset:251.3274]
                    animate-[dash1_1.5s_cubic-bezier(0.66,0,0.34,1)_infinite_alternate]
                    motion-reduce:animate-none motion-reduce:[stroke-dashoffset:60]"
          />

          <circle
            cx="50"
            cy="50"
            r="30"
            stroke={`url(#${innerId})`}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="[stroke-dasharray:188.4956] [stroke-dashoffset:0]
                    animate-[dash2_1.5s_cubic-bezier(0.66,0,0.34,1)_infinite_alternate]
                    motion-reduce:animate-none motion-reduce:[stroke-dashoffset:120]"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loading;
