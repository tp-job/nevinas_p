import type { FC } from "react";

/**
 * The page's opening figures.
 *
 * WHAT THIS REPLACES, AND WHY
 *
 * Four `StatsCard`s, each with a sparkline, a coloured ring and a percentage
 * badge. Two problems, both structural rather than cosmetic:
 *
 * 1. THREE OF THE FOUR VALUES WERE ZERO. `totalCommits: 0`, `totalStars: 0`,
 *    `totalIssues: 0` — so the two largest numbers on a portfolio dashboard
 *    said "0". The GitHub Events API only reports ~90 days and does not
 *    surface this account's pushes, so those zeros are an artefact of the
 *    source, not a fact about the work. Rendering them at 48px argued against
 *    the portfolio they sit in.
 * 2. THE PERCENTAGES MEANT NOTHING. The badges read 0%, 38%, 50%, 0% with no
 *    denominator anywhere, and the FOLLOWERS badge was `percentage={50}` —
 *    a literal hardcoded constant presented as a measurement.
 *
 * This shows what is actually substantial — 21 repositories, 32 pull requests,
 * 6 languages, 8 active projects — as a flat instrument readout: one hairline
 * rule, tabular figures, no rings and no sparklines behind the numbers.
 *
 * The zeros are NOT hidden. They belong in `footnote`, at body size, stated
 * plainly. The rule is about what earns the largest type, not about
 * suppressing facts — a dashboard that hides its zeros is as dishonest as one
 * that leads with them.
 */
export interface Stat {
  label: string;
  value: number | string;
  /** Unit or qualifier shown next to the value, e.g. "active". */
  note?: string;
}

const StatStrip: FC<{ stats: Stat[]; footnote?: string }> = ({
  stats,
  footnote,
}) => (
  <section className="mb-12">
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-light-border pt-6 sm:grid-cols-4 dark:border-dark-border">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
            {s.label}
          </dt>
          <dd className="flex items-baseline gap-2">
            {/* Size carries the hierarchy, per DS v3.2 — 36px at weight 300,
                not 24px at weight 700 like the cards this replaces. */}
            <span className="text-4xl font-light tabular-nums text-light-text dark:text-dark-text">
              {s.value}
            </span>
            {s.note && (
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {s.note}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
    {footnote && (
      <p className="mt-6 max-w-[70ch] text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
        {footnote}
      </p>
    )}
  </section>
);

export default StatStrip;
