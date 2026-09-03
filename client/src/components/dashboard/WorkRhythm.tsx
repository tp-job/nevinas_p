import type { FC } from "react";

/**
 * Work Rhythm — when this project actually gets built.
 *
 * WHY THIS IS THE PAGE'S CENTREPIECE
 *
 * The design system is called Nocturnal Atelier — 夜の工房, night workshop. That
 * could be a mood board someone picked. It is not: the event data says 60% of
 * this project's recorded activity falls between 20:00 and 06:00, it peaks at
 * 20:00, and there is no activity at all between 02:00 and 12:00.
 *
 * So the most emotional element on the page is also the most rigorous one — a
 * real 24-hour distribution with a stated denominator and labelled axes. That
 * is the only honest way "convey the emotion" belongs on an engineering page:
 * the feeling has to BE the evidence, not decoration laid on top of it.
 *
 * WHAT IT REPLACES
 *
 * The "Activity Pulse" heatmap, which fabricated its data. There is no day-by-
 * hour matrix in the API — only two independent 1-D marginals — and the
 * component invented every cell from them:
 *
 *     Math.round(((dayVal + hourVal) / 2) * 4)
 *
 * It rendered as a GitHub-style contribution grid, which reads as per-cell
 * measurement, while carrying none. A dashboard that shows data it does not
 * have is worse than one that shows less.
 *
 * COLOUR CARRIES THE MEANING, NOT DECORATION
 *
 * Night hours are drawn in periwinkle and day hours in haze. That is the whole
 * point of the chart, so the colour split IS the data — not a palette applied
 * for variety. Both are main-palette tokens.
 */

/** Hours counted as night. 20:00-23:59 plus 00:00-05:59. */
const isNight = (hour: number) => hour >= 20 || hour < 6;

const pad = (n: number) => String(n).padStart(2, "0");

const WorkRhythm: FC<{ hourActivity: number[] }> = ({ hourActivity }) => {
  // Defensive: the API returns 24 buckets, but a short array would silently
  // render a truncated day rather than an obviously broken one.
  const hours = Array.from({ length: 24 }, (_, i) => hourActivity[i] ?? 0);
  const total = hours.reduce((a, b) => a + b, 0);
  const max = Math.max(...hours, 1);

  const nightTotal = hours.reduce(
    (sum, v, h) => (isNight(h) ? sum + v : sum),
    0,
  );
  const nightShare = total > 0 ? Math.round((nightTotal / total) * 100) : 0;
  const peakHour = hours.indexOf(max);

  // Nothing to say if the sync produced no events — better than drawing a flat
  // row of empty bars and implying the work never happened.
  if (total === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-light-border pb-2 dark:border-dark-border">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-light-text dark:text-dark-text">
            Work Rhythm
          </h2>
          <span className="font-zen text-xs text-light-text-tertiary dark:text-dark-text-muted">
            夜の工房
          </span>
        </div>
        {/* The denominator is stated. Every percentage on this page names what
            it is a percentage of — the old KPI badges did not, and one of them
            was hardcoded to 50. */}
        <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
          {total} events · last 90 days of GitHub activity
        </span>
      </div>

      <p className="mb-6 max-w-[60ch] text-base leading-relaxed text-light-text dark:text-dark-text">
        <span className="tabular-nums">{nightShare}%</span> of the work on this
        project happens between 20:00 and 06:00, peaking at{" "}
        <span className="tabular-nums">{pad(peakHour)}:00</span>. The design
        system is named for it.
      </p>

      {/* 24 bars, one per hour. `items-end` so every bar grows from the same
          baseline and the silhouette of the night is readable at a glance. */}
      <div
        className="flex h-32 items-end gap-[3px]"
        role="img"
        aria-label={`Activity by hour of day. ${nightShare} percent of ${total} events occur between 20:00 and 06:00. Peak hour ${pad(peakHour)}:00.`}
      >
        {hours.map((value, hour) => (
          <div
            key={hour}
            title={`${pad(hour)}:00 — ${value} event${value === 1 ? "" : "s"}`}
            className="flex-1 rounded-sm transition-colors"
            style={{
              // A floor of 2px so an empty hour still reads as a measured zero
              // rather than a gap where no bar was drawn.
              height: `${Math.max((value / max) * 100, 1.5)}%`,
              background: isNight(hour)
                ? "var(--color-periwinkle)"
                : "var(--color-haze)",
              opacity: value === 0 ? 0.25 : 1,
            }}
          />
        ))}
      </div>

      {/* Axis. Four anchors rather than 24 labels — the shape is the point and
          a label under every bar would out-weigh the data. */}
      <div className="mt-2 flex justify-between text-[11px] tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: "var(--color-periwinkle)" }}
          />
          Night · 20:00–06:00
          <span className="tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
            {nightTotal}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: "var(--color-haze)" }}
          />
          Day · 06:00–20:00
          <span className="tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
            {total - nightTotal}
          </span>
        </span>
      </div>
    </section>
  );
};

export default WorkRhythm;
