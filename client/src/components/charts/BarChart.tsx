import type { FC, ReactNode } from "react";
import { niceTicks, axisMax, barHeightPct } from "./scale";

/**
 * The dashboard's bar chart, without recharts.
 *
 * WHY THIS EXISTS
 *
 * recharts was 93 KB gzipped on the Dashboard route, and both of that route's
 * bar charts are plain vertical bars on a linear integer scale with a grid, two
 * axes and a hover readout. That is the same thing WorkRhythm already draws in
 * flexbox with no dependency. recharts stays on /work/performance, which
 * genuinely needs area charts and multi-series composition.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * No animation, no responsive re-measure, no shared tooltip portal. The hover
 * readout is the native `title` attribute, which is keyboard- and
 * screen-reader-reachable for free and cannot desynchronise from the bar it
 * describes. If a future chart needs a real tooltip surface, that is the point
 * to reconsider — not now, on two bar charts.
 *
 * ACCESSIBILITY
 *
 * The plot is one `role="img"` with a written summary, following WorkRhythm:
 * a screen reader gets the finding, not 60 unlabelled rects. Callers must pass
 * `ariaLabel` — it is required, not optional, because an unlabelled chart is
 * the failure this pattern is meant to avoid.
 */

/** A row of chart data. `boolean` is allowed because callers carry flags
 *  alongside the values (WeeklyActivity's `isPeak`) and read them in colorFor. */
export type ChartRow = Record<string, string | number | boolean>;

export interface BarSeries {
  /** Key into each row of `data`. */
  key: string;
  /** Human name, used in the hover readout. */
  label: string;
  /** Resolved colour string (from useChartPalette). */
  color: string;
}

export interface BarChartProps {
  data: ChartRow[];
  /** Key holding each row's category label. */
  xKey: string;
  series: BarSeries[];
  /** Plot height in px, excluding the axis labels beneath. */
  height?: number;
  ariaLabel: string;
  /** Per-row colour override — WeeklyActivity highlights its peak day. */
  colorFor?: (row: ChartRow, index: number) => string | undefined;
  /** Gap between bars within a group, in px. */
  barGap?: number;
  /** Max width of a single bar, in px. */
  maxBarSize?: number;
  footer?: ReactNode;
}

const gridLine = "var(--color-haze-deep)";
const tickText = "var(--color-cool)";

const BarChart: FC<BarChartProps> = ({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  colorFor,
  barGap = 4,
  maxBarSize = 28,
  footer,
}) => {
  const values = data.flatMap((row) =>
    series.map((s) => Number(row[s.key]) || 0),
  );
  const ticks = niceTicks(Math.max(...values, 0));
  const top = axisMax(ticks);

  return (
    <div>
      <div className="flex" style={{ height }}>
        {/* Y axis. 32px matches the width recharts was configured with, so the
            plot area keeps its previous proportions. */}
        <div
          className="relative w-8 shrink-0 text-[11px] tabular-nums"
          style={{ color: tickText }}
          aria-hidden="true"
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-1 -translate-y-1/2"
              style={{ bottom: `${(t / top) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="relative flex-1"
          role="img"
          aria-label={ariaLabel}
        >
          {/* Horizontal grid only, matching `vertical={false}`. */}
          {ticks.map((t) => (
            <span
              key={t}
              className="pointer-events-none absolute inset-x-0 border-t border-dashed"
              style={{ bottom: `${(t / top) * 100}%`, borderColor: gridLine }}
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-around">
            {data.map((row, i) => (
              <div
                key={String(row[xKey]) || i}
                className="flex h-full flex-1 items-end justify-center"
                style={{ gap: barGap }}
              >
                {series.map((s) => {
                  const value = Number(row[s.key]) || 0;
                  return (
                    <div
                      key={s.key}
                      title={`${row[xKey]} — ${value} ${s.label}`}
                      className="w-full rounded-t-[2px]"
                      style={{
                        maxWidth: maxBarSize,
                        height: `${barHeightPct(value, top)}%`,
                        background: colorFor?.(row, i) ?? s.color,
                        opacity: value === 0 ? 0.3 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X axis labels, aligned to the plot area by the same 32px gutter. */}
      <div className="flex pt-2">
        <div className="w-8 shrink-0" aria-hidden="true" />
        <div
          className="flex flex-1 justify-around text-[11px]"
          style={{ color: tickText }}
          aria-hidden="true"
        >
          {data.map((row, i) => (
            <span key={String(row[xKey]) || i} className="flex-1 text-center">
              {String(row[xKey])}
            </span>
          ))}
        </div>
      </div>

      {footer}
    </div>
  );
};

export default BarChart;
