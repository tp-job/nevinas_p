/**
 * Status palette — Nocturnal Atelier v3.2 §13.7/§1.10, extended for dark mode.
 *
 * Single source of truth for every status-coloured surface (Toast, Callout,
 * anything added later). Extracted from Toast.tsx rather than left inline,
 * because Callout needed the exact same four colours and a second hand-copied
 * hex set is how these things drift out of sync.
 *
 * WHY NOT the shared `--color-success` / `--color-error` / `--color-warning`
 * tokens in index.css: they currently hold Google's brand hex
 * (#34a853/#ea4335/#fbbc05) rather than the DS v3.2 values, and the
 * `--color-success-bg` / `-text` / `-border` triplets are declared only inside
 * `.dark { }` — there is no light-mode equivalent at all. Building on either
 * would import both defects into new code. Measured against those tokens
 * (light mode, 3:1 non-text bar): success 2.67, warning 1.54 — both fail. This
 * module's values were measured passing in both themes when Toast shipped:
 * body text 6.47–12.06 against the 4.5 AA bar, icons 3.30–10.31 against 3:1.
 *
 * The DS spec fixes one light-mode palette per type, which is not enough here
 * — the site is dark by default, and #1E233C text on a pale tint is
 * unreadable against a charcoal page. Each type carries both modes.
 */

export type StatusVariant = "info" | "success" | "warning" | "error";

export interface StatusSkin {
  /** Remixicon class — the subset is regenerated via `npm run icons:subset`. */
  icon: string;
  light: { bg: string; border: string; text: string; accent: string };
  dark: { bg: string; border: string; text: string; accent: string };
}

export const STATUS_SKIN: Record<StatusVariant, StatusSkin> = {
  info: {
    icon: "ri-information-line",
    // Main palette — info reuses cool gray, which §1.10 marks as on-palette.
    light: { bg: "rgba(200,205,235,0.78)", border: "#A8B0D9", text: "#1E233C", accent: "#465078" },
    dark: { bg: "rgba(46,53,88,0.82)", border: "rgba(200,205,235,0.28)", text: "#E8EAF5", accent: "#C8CDEB" },
  },
  success: {
    icon: "ri-check-line",
    light: { bg: "rgba(200,240,210,0.72)", border: "#a5d6a7", text: "#1b5e20", accent: "#2E7D32" },
    dark: { bg: "rgba(30,50,40,0.85)", border: "rgba(134,239,172,0.34)", text: "#D6F0DD", accent: "#86EFAC" },
  },
  warning: {
    icon: "ri-alert-line",
    light: { bg: "rgba(255,236,214,0.78)", border: "#ffcc80", text: "#7a3b00", accent: "#E65100" },
    dark: { bg: "rgba(58,44,26,0.85)", border: "rgba(251,191,36,0.34)", text: "#F6E3C4", accent: "#FBBF24" },
  },
  error: {
    icon: "ri-error-warning-line",
    light: { bg: "rgba(255,218,214,0.78)", border: "#ef9a9a", text: "#8e1414", accent: "#C62828" },
    dark: { bg: "rgba(58,30,32,0.85)", border: "rgba(252,165,165,0.34)", text: "#F7DADA", accent: "#FCA5A5" },
  },
};
