/**
 * Axis scale maths for the dashboard's plain-SVG/flexbox charts.
 *
 * Pulled out as pure functions so the tick behaviour can be tested directly —
 * the failure mode here is silent (a chart that renders beautifully against a
 * wrong axis), which is exactly the class the test suite exists for.
 *
 * These replace recharts' automatic domain. The dashboard's charts count
 * events, so the axis is integer-only: recharts was configured with
 * `allowDecimals={false}` and the replacement must not quietly reintroduce
 * fractional ticks.
 */

/**
 * Ticks from 0 up to a "nice" bound at or above `max`, using a 1/2/5×10ⁿ step.
 *
 * Always integers (minimum step 1) and always at least [0, 1], so an empty
 * dataset draws a real axis rather than collapsing to a single line.
 */
export function niceTicks(max: number, targetCount = 4): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0, 1];

  const rawStep = max / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalised = rawStep / magnitude;
  const niceStep =
    (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10) *
    magnitude;

  // Counts are whole events; a 0.5 tick would be meaningless.
  const step = Math.max(1, Math.round(niceStep));
  const upper = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let v = 0; v <= upper; v += step) ticks.push(v);
  return ticks;
}

/** The top of the axis — the last tick, which is >= max by construction. */
export const axisMax = (ticks: number[]): number => ticks[ticks.length - 1] ?? 1;

/**
 * A bar's height as a percentage of the plot area.
 *
 * Floors at a hairline so a measured zero still reads as a drawn bar rather
 * than a gap where nothing was rendered — the same choice WorkRhythm makes.
 */
export function barHeightPct(value: number, max: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (max <= 0) return 0;
  return Math.max((value / max) * 100, 1.5);
}
