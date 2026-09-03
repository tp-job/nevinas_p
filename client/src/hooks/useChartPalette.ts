import { useMemo } from "react";
import { useCssTokens } from "./useCssTokens";

/**
 * The one chart palette, resolved from the live stylesheet.
 *
 * WHY THIS IS A SHARED HOOK AND NOT ANOTHER CONSTANT
 *
 * This codebase had grown THREE separate hardcoded chart palettes, none of
 * which held a single Nocturnal Atelier value:
 *
 *   - `pages/Performance.tsx`      #0f9d58 #5983FC #964EC2 #f4b400 #FF7BBF #3E60C1
 *   - `components/dashboard/constants.ts`  royal azure indigo orchid flamingo
 *                                          blue purple green yellow pink
 *   - `components/docs/constants.ts`       (palette-correct, but a fourth copy)
 *
 * Each was a place a palette change could not reach, and the Design System
 * page proved how that ends: its hand-kept copy had silently drifted to four
 * wrong values. Fixing them one file at a time just produces a fourth copy the
 * next time someone needs a chart colour, so the values live in exactly one
 * place now — index.css — and this hook reads them.
 *
 * Charts are the legitimate case for resolving tokens at runtime: recharts and
 * inline SVG take colour STRINGS, not utility classes. DS v3.2 designates the
 * sub-palette for exactly this (effects, SVG gradients, data visualisation).
 *
 * Roles are named by what they mean in a chart, not by hue, so a palette
 * change cannot silently invert a chart's meaning: `positive` stays the
 * success colour whatever success becomes.
 */
const TOKENS = [
  "--color-periwinkle",
  "--color-cool",
  "--color-haze",
  "--color-haze-deep",
  "--color-sub-ev1",
  "--color-sub-mount",
  "--color-success",
  "--color-warning",
] as const;

/**
 * One neutral fallback, deliberately not a per-role set.
 *
 * An earlier version of this fix listed a fallback hex per role, which quietly
 * recreated the hand-kept palette it was removing. Every variable above is
 * defined in index.css, so a miss is a bug worth seeing: the chart renders
 * flat and the cause is immediately obvious.
 */
const FALLBACK = "#878CB4";

export interface ChartPalette {
  /** Highest-emphasis series. */
  primary: string;
  /** Second series. */
  secondary: string;
  /** Third series, and low-emphasis fills. */
  tertiary: string;
  /** Grid lines and inactive bars. */
  muted: string;
  /** The one warm bridge tone. Sparingly — DS v3.2 caps it at ~30% of a view. */
  accent: string;
  /** Semantic, not decorative. */
  positive: string;
  warning: string;
}

export function useChartPalette(): ChartPalette {
  const live = useCssTokens([...TOKENS]);

  return useMemo(
    () => ({
      primary: live["--color-periwinkle"] || FALLBACK,
      secondary: live["--color-cool"] || FALLBACK,
      tertiary: live["--color-haze"] || FALLBACK,
      muted: live["--color-haze-deep"] || FALLBACK,
      accent: live["--color-sub-mount"] || FALLBACK,
      positive: live["--color-success"] || FALLBACK,
      warning: live["--color-warning"] || FALLBACK,
    }),
    [live],
  );
}
