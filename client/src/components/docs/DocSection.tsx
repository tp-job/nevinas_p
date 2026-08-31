import type { FC } from "react";
import { proseCls } from "./constants";
import SectionHeading from "./SectionHeading";

/* ==================== Doc Section (Introduction style) ==================== */
/**
 * A titled documentation section.
 *
 * The heading and subtitle ALWAYS sit in the reading column, so every section
 * starts on the same left edge and shares the same measure. Only the body opts
 * out, via `wide` — grids, swatch walls and timelines are looked at rather than
 * read, and cramming them into 68ch would be worse, not better.
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
    <div className={proseCls}>
      <SectionHeading title={title} />
      {subtitle && (
        <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-8">
          {subtitle}
        </p>
      )}
    </div>
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
