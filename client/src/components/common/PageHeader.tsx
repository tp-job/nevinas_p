import type { FC, ReactNode } from "react";

/**
 * The page header every /work/* route opens with.
 *
 * WHY THIS EXISTS
 *
 * This block was hand-duplicated across twelve pages — Dashboard, Performance,
 * TechStack, ToolsPage, Repository, Website, React, Tailwind, Flutter, Docs,
 * Gallery and Blog. Twelve copies of three lines of markup is twelve places to
 * miss when the scale changes, and they had already drifted apart in three
 * separate ways before this component existed:
 *
 * 1. BOTTOM MARGIN split 7/5 between `mb-4` and `mb-6`, with no pattern behind
 *    which page got which. Standardised on `mb-6` (24px, on the 8px scale).
 * 2. DASHBOARD'S JAPANESE SUBTITLE ran at `text-[0.72rem] font-light` — 11.5px
 *    against everyone else's 20px `text-xl`. Nearly half the size, on the one
 *    page most likely to be seen first.
 * 3. DOCS had been corrected to <p>/<h1>/<p> while the other eleven still
 *    rendered the title as an <h2> with no <h1> anywhere in <main>, so those
 *    pages never announced what they were to a screen reader.
 *
 * SEMANTICS
 *
 * The title is an <h1> — one per page, which is what a page title is. The
 * eyebrow and the Japanese subtitle are <p>, because a label is not a section
 * heading; rendering them as <h4>/<h3> invented a heading hierarchy that
 * described nothing and put an h4 above an h2.
 *
 * This costs nothing visually. There are no global heading styles in this
 * codebase — Tailwind preflight resets them and every size here is set by an
 * explicit class — so <p class="text-lg"> and <h4 class="text-lg"> paint
 * identically. Verified by measurement, not assumption: 18px/400, 48px/400,
 * 20px/400 at 1440px, unchanged before and after.
 */
const PageHeader: FC<{
  /** Small line above the title — "Developer Analytics", "Skill Showcase". */
  eyebrow: string;
  title: string;
  /** Japanese subtitle. Optional so a page without one does not render an empty line. */
  jp?: string;
  /**
   * Right-aligned slot, baseline-aligned with the title block.
   *
   * Exists for Repository, which puts its "Graph View" link here. Without a
   * slot that page would have had to keep its own copy of the header markup —
   * which is exactly the duplication this component removes, reintroduced for
   * one link.
   */
  actions?: ReactNode;
  /** Escape hatch for a page that genuinely needs different spacing. */
  className?: string;
}> = ({ eyebrow, title, jp, actions, className = "" }) => (
  <div
    className={`mb-6 flex flex-wrap items-end justify-between gap-3 ${className}`}
  >
    <div className="min-w-0">
      <p className="mb-1 text-lg text-light-text dark:text-dark-text">
        {eyebrow}
      </p>
      <h1 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
        {title}
      </h1>
      {jp && (
        <p className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
          {jp}
        </p>
      )}
    </div>
    {actions}
  </div>
);

export default PageHeader;
