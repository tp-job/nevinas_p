import type { FC } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Component: Label — DS §2.3 type scale (`label` token)
// 0.58rem · font-semibold · tracking-[.22em] · uppercase · muted
// ─────────────────────────────────────────────────────────────────────────────
const SectionLabel: FC<{ children: string }> = ({ children }) => (
  <p
    className="text-[0.58rem] font-semibold tracking-[0.22em] uppercase
               text-cool opacity-60 mb-3"
  >
    {children}
  </p>
);

export default SectionLabel;
