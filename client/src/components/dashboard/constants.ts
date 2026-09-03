// Shared constants for the Dashboard page sections.

/**
 * Chart styling, read from the live stylesheet rather than restated here.
 *
 * This file used to export a `TH` map of ten hardcoded colours — royal, azure,
 * indigo, orchid, flamingo, blue, purple, green, yellow, pink — and not one of
 * them was a Nocturnal Atelier value. It was the third such palette in the
 * codebase (Performance.tsx and the docs constants had their own), so a change
 * to index.css could not reach any chart on the site.
 *
 * Colours now come from `hooks/useChartPalette`, which resolves `--color-*` at
 * runtime. Nothing here holds a colour value any more.
 */
export const gridColor = "var(--color-border-primary)";
export const tickColor = "var(--color-text-secondary)";
export const cardBg = "var(--color-surface-primary)";

/**
 * A dashboard section: spacing only, no surface.
 *
 * `cardCls` used to be a bordered, blurred, double-shadowed, rounded card that
 * also lifted on hover:
 *
 *     bg-… backdrop-blur-xl border … rounded-2xl … hover:-translate-y-0.5
 *     shadow-[0_4px_24px…] hover:shadow-[0_8px_40px…]
 *
 * Two problems. The hover lift sat on a chart, which is not a control and does
 * nothing when clicked — the same false affordance removed from TechStackCard
 * and StatsCard, missed at the time because the audit grepped
 * `hover:-translate-y-1` and this one is `-0.5`. And the card chrome itself is
 * the language the page moved away from: Work Rhythm and the stat strip are
 * flat sections separated by hairline rules, so keeping boxes around the
 * charts made one page look like two.
 *
 * Sections are now separated by their SectionHead rule and by whitespace.
 */
export const cardCls = "pb-2";
