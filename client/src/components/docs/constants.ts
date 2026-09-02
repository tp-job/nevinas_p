// Shared constants for the Docs page sections.

// Section accents — tonal steps of the Nocturnal Atelier v3.2 main palette,
// used for per-category identification (Frontend/Backend/Dev Tools, chart
// dots, gradient bars). `warm` is the palette's one warm bridge tone
// (sub-palette, decorative-only) — keep it to a single accent role.
export const TH = {
  primary: "#878CB4", // Cool Gray
  secondary: "#465078", // Haze Purple
  tertiary: "#2E3558", // Haze Deep
  warm: "#85758F", // Mountbatten Pink — sub-palette, decorative only
  sub: "#524E68", // English Violet 1 — sub-palette, decorative only
};

/**
 * The reading column — RUNNING PARAGRAPHS ONLY.
 *
 * Sentences at the full content width measure ~110 characters per line, which
 * is roughly double a comfortable measure, so paragraphs still get a cap.
 *
 * Headings, section rules and grids deliberately do NOT get it. At 68ch this
 * was applied to the page header and every SectionHeading as well, which held
 * the whole page to a 565 px column while every other /work/* page runs 949 px
 * at the same viewport — the visible "Docs looks different" defect. 85ch keeps
 * the readability win without re-introducing the mismatch: measured 727 px at
 * 1440, so section rules span the full width and only prose is inset.
 *
 * In `ch` so it tracks the font, and applied on a 16 px context.
 */
export const proseCls = "max-w-[85ch]";

export const cardCls =
  "bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden";
