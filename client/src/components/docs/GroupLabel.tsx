import type { FC } from "react";

/**
 * A sub-section label: small caps over a hairline rule.
 *
 * This is the ONLY structural device the spec-sheet sections use. Both the
 * Design System and Architecture Overview sections previously wrapped their
 * groups in bordered, rounded, hover-lifting cards nested two and three deep,
 * which repeated the same border and radius at every level and so told the
 * reader nothing about what each boundary meant.
 *
 * A label and a rule cost one line and carry the same grouping information, so
 * a group is separated by typography rather than by another box.
 *
 * Extracted here when the second section needed it — it was defined privately
 * inside DesignSystemSection. Two sections sharing one label primitive is what
 * keeps them looking like one document instead of two takes on the same idea.
 */
const GroupLabel: FC<{ label: string; note?: string }> = ({ label, note }) => (
  <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-light-border pb-2 dark:border-dark-border">
    <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-light-text dark:text-dark-text">
      {label}
    </h4>
    {note && (
      <span className="text-xs text-light-text-tertiary dark:text-dark-text-muted">
        {note}
      </span>
    )}
  </div>
);

export default GroupLabel;
