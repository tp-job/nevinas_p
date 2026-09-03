import type { FC } from "react";

/**
 * A single figure with its label, for use inside a section that already has a
 * surface of its own.
 *
 * It used to render its own bordered, rounded, filled box plus a second
 * rounded tile behind its icon — so a KpiBadge sitting inside a section card
 * put three nested rounded borders on screen, each repeating the same radius
 * and surface and none of them telling the reader anything. The icon tile in
 * particular was a box drawn around a glyph to make it look like a component.
 *
 * Now: the figure, the label, and a small accent-coloured icon inline. The
 * parent section provides the only surface.
 */
const KpiBadge: FC<{
  icon: string;
  value: string | number;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => (
  <div className="flex items-baseline gap-2">
    <i aria-hidden="true" className={`${icon} text-sm`} style={{ color }} />
    <span className="text-lg font-medium leading-none tabular-nums text-light-text dark:text-dark-text">
      {value}
    </span>
    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
      {label}
    </span>
  </div>
);

export default KpiBadge;
