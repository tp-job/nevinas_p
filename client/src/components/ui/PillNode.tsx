/**
 * components/ui/PillNode.tsx
 * -----------------------------------------------------------------------------
 * Small rounded "chip" used for tech-stack tags, node labels, etc.
 * Matches the spec in design-v3-2.md (Section 13.11): glass pill with three
 * visual states, optional leading icon slot, dark-mode tokens throughout.
 *
 * Note vs. the doc as written: the doc's own snippet uses `text-[#E8EAF5]`
 * style hex literals directly, which is fine and compiles either way — but
 * since the rest of this codebase reads from --dark-* custom properties via
 * the `text-(--token)` parenthesis syntax (see the note in
 * ContributorTimeline.tsx about why the bracket form silently breaks), this
 * version uses that same token syntax instead of hardcoded hex, so a theme
 * change updates this component for free.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from "react";

export type PillNodeVariant = "default" | "active" | "muted";

interface PillNodeProps {
  label: string;
  variant?: PillNodeVariant;
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<PillNodeVariant, string> = {
  default: "bg-white/[0.08] border-white/[0.18] text-(--dark-text)",
  active:
    "bg-[rgba(200,205,235,0.15)] border-[rgba(200,205,235,0.35)] text-periwinkle",
  muted: "bg-white/[0.04] border-white/[0.08] text-(--dark-text-muted)",
};

export function PillNode({ label, variant = "default", icon }: PillNodeProps) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full
                 border px-3.5 text-xs font-medium backdrop-blur-[10px]
                 transition-all duration-200
                 hover:border-[rgba(200,205,235,0.30)] hover:bg-[rgba(200,205,235,0.15)]
                 ${VARIANT_STYLES[variant]}`}
    >
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {label}
    </span>
  );
}