import type { FC } from "react";

/**
 * EmptyState — the "nothing here yet" counterpart to ErrorDisplay.
 *
 * Deliberately shares ErrorDisplay's composition (icon badge → title →
 * gradient divider → supporting copy → ambient glow) so a page that has no
 * data and a page that failed to load read as the same family instead of the
 * flat grey card the empty branch used to render. The legacy `global-*`
 * accents it borrows are already DS-mapped — `global-redpink` is #6E6078, a
 * muted purple-grey, not an alarm colour — so the treatment carries over
 * without importing any "something is wrong" signal.
 *
 * Two things are intentionally NOT copied from ErrorDisplay:
 *
 *   - `role="status"` + `aria-live="polite"`, not `alert`/`assertive`. An
 *     empty list is a normal outcome, not a failure, and interrupting a
 *     screen reader mid-sentence to announce it is the wrong trade — the
 *     same reasoning already applied to the toast viewport.
 *   - A neutral icon. `ri-error-warning-line` would tell the reader their
 *     request broke when it simply returned nothing.
 */
interface EmptyStateProps {
  /** Headline, e.g. "No Flutter projects found". */
  title: string;
  /** Optional first supporting line. */
  description?: string;
  /** Optional second, dimmer supporting line. */
  hint?: string;
  /** Remixicon class. Must exist in the subset — `npm run icons:subset`. */
  icon?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  hint,
  icon = "ri-folder-open-line",
}) => (
  <div
    role="status"
    aria-live="polite"
    className="flex justify-center items-center min-h-[350px] px-6"
  >
    <div className="mx-auto w-full max-w-lg relative flex flex-col items-center justify-center text-center">

      {/* ── Icon badge ───────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="
          relative flex items-center justify-center
          w-16 h-16 mb-6 rounded-[18px]
          bg-global-redpink/10 dark:bg-global-redpink/15
          border border-global-redpink/20 dark:border-global-redpink/30
        "
      >
        <i className={`${icon} text-3xl text-global-redpink dark:text-periwinkle`} />
        {/* Glass-like inset highlight */}
        <span className="absolute inset-0 rounded-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]" />
      </div>

      {/* ── Title ────────────────────────────────────────────────────────── */}
      {/* font-medium, not font-semibold: DS v3.2 leads hierarchy with size,
          and this is a quieter moment than an error. */}
      <h3 className="
        mb-5 text-xl font-medium tracking-tight leading-snug
        text-light-text dark:text-dark-text
      ">
        {title}
      </h3>

      {/* ── Gradient divider ─────────────────────────────────────────────── */}
      {/* The wrapper needs an explicit h-px so the absolute children have a
          real box to position against — a 0-height container silently
          collapses all three layers. */}
      <div aria-hidden="true" className="relative w-full h-px">
        {/* Soft outer halo */}
        <div className="
          absolute inset-x-0 -top-px h-[3px]
          bg-gradient-to-r from-transparent via-global-redpink/40 to-transparent
          dark:via-global-purple/50
          blur-[3px]
        " />
        {/* Primary crisp line */}
        <div className="
          absolute inset-0
          bg-gradient-to-r from-transparent via-global-redpink/75 to-transparent
          dark:via-global-purple
        " />
        {/* Narrow centered accent bloom */}
        <div className="
          absolute left-1/4 right-1/4 top-0 h-[2px]
          bg-gradient-to-r from-transparent via-global-pink to-transparent
          dark:via-global-pink/70
          blur-[4px]
        " />
      </div>

      {/* ── Supporting copy ──────────────────────────────────────────────── */}
      {(description || hint) && (
        <div className="mt-6 space-y-1.5">
          {description && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {description}
            </p>
          )}
          {/* /75, not the /65 ErrorDisplay uses: measured on the real page,
              /65 composites to 4.03:1 against the light background, under the
              4.5 AA bar. /75 lands at 5.27 and is still clearly quieter than
              the description above it (10.95). ErrorDisplay has the same /65
              and therefore the same defect — left alone here rather than
              changed as a drive-by, but it is worth a look. */}
          {hint && (
            <p className="text-sm text-light-text-secondary/75 dark:text-dark-text-secondary/75">
              {hint}
            </p>
          )}
        </div>
      )}

      {/* ── Ambient glow ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 inset-0 overflow-hidden"
      >
        <div className="
          absolute top-0 left-1/2 -translate-x-1/2
          w-3/4 h-3/4
          bg-gradient-to-br from-global-purple/25 to-global-pink/20
          dark:from-global-purple/20 dark:to-global-pink/15
          blur-[80px] rounded-full
        " />
        <div className="
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-1/2 h-2/5
          bg-gradient-to-br from-global-purple/15 to-global-blue/20
          dark:from-global-purple/20 dark:to-global-blue/25
          blur-[70px] rounded-full
        " />
      </div>

    </div>
  </div>
);

export default EmptyState;
