import type { FC } from "react";
import { proseCls } from "./constants";
import SectionHeading from "./SectionHeading";

/* ==================== Doc Section (Introduction style) ==================== */
/**
 * A titled documentation section.
 *
 * The heading spans the FULL content width — its underline is a section rule,
 * and a rule that stops two thirds of the way across reads as a broken border
 * rather than a divider. It also kept the whole page in a 565 px column while
 * every sibling /work/* page runs 949 px, which is the parity defect this
 * change exists to fix.
 *
 * The subtitle and body are read as sentences, so they keep the reading column
 * unless `wide` opts them out — grids, swatch walls and timelines are looked at
 * rather than read, and cramming those into a measure would be worse.
 *
 * Rhythm is two-level on purpose: the title and its subtitle are one unit and
 * sit close together; the gap before the body and the gap to the next section
 * are progressively larger. Previously every section was a flat 64 px apart
 * regardless of weight, so nothing grouped visually.
 */
const DocSection: FC<{
  title: string;
  subtitle?: string;
  /** Let the body span the full content width instead of the reading column. */
  wide?: boolean;
  children: React.ReactNode;
}> = ({ title, subtitle, wide = false, children }) => (
  <section className="mb-20">
    <SectionHeading title={title} />
    {subtitle && (
      <p
        className={`text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 ${proseCls}`}
      >
        {subtitle}
      </p>
    )}
    <div
      className={`space-y-6 text-light-text dark:text-dark-text leading-relaxed ${
        wide ? "" : proseCls
      }`}
    >
      {children}
    </div>
  </section>
);

export default DocSection;
