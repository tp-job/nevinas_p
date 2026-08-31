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
 * The reading column.
 *
 * Prose was running the full width of the content wrapper — measured at 987 px
 * / ~110 characters per line, roughly double a comfortable measure. Everything
 * that is read as sentences gets this cap; grids and swatch walls opt out via
 * DocSection's `wide` prop.
 *
 * In `ch` so it tracks the font, and applied on a 16 px context.
 */
export const proseCls = "max-w-[68ch]";

export const cardCls =
  "bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden";
