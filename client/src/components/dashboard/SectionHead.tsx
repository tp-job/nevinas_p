import type { FC, ReactNode } from "react";

/**
 * The header every dashboard section uses.
 *
 * The page's own sections (StatStrip, Work Rhythm, "Elsewhere on this site")
 * introduce themselves with a small-caps label over a hairline rule, with any
 * meta pushed to the right. The chart sections were still introducing
 * themselves as `text-xl` headings inside bordered, shadowed, gradient-topped
 * cards — the visual language the rest of the page had just left behind, so
 * the page read as two designs stacked.
 *
 * Same device as `docs/GroupLabel`, kept as a separate component because this
 * one carries a `meta` slot (event counts, totals) that the docs one has no
 * use for, and importing across feature folders to save nine lines would
 * couple two unrelated pages.
 */
const SectionHead: FC<{
  title: string;
  /** Optional one-line description under the rule. */
  subtitle?: string;
  /** Right-aligned counts, legends or totals. */
  meta?: ReactNode;
}> = ({ title, subtitle, meta }) => (
  <>
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-light-border pb-2 dark:border-dark-border">
      <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-light-text dark:text-dark-text">
        {title}
      </h2>
      {meta}
    </div>
    {subtitle && (
      <p className="mb-5 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {subtitle}
      </p>
    )}
  </>
);

export default SectionHead;
