/**
 * ErrorDisplay — replaces the original `Error` component.
 *
 * Why renamed:
 *   `const Error` shadows the native JS `Error` constructor in any module
 *   that imports this file, causing silent runtime surprises. Use `ErrorDisplay`
 *   (or `ErrorState` / `ErrorMessage`) everywhere instead.
 *
 * Fixes applied:
 *   - role="alert" + aria-live="assertive" → screen readers announce errors
 *   - aria-hidden on all decorative elements (icon, divider, ambient glow)
 *   - Gradient divider: wrapper now has an explicit h-px so absolute children
 *     are positioned against a real box (0-height collapse was a silent bug)
 *   - Removed invalid `inset-x-auto` utility (not a Tailwind class)
 *   - Replaced broken `backdrop-blur-sm` + pseudo-element Tailwind chains on
 *     <span> with proper <div> children — more predictable, easier to maintain
 *   - Copy voice fixed: "I am having trouble…" → interface-passive third person
 *   - pointer-events-none + -z-10 on ambient glow (was -z-[1], inconsistent)
 */

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex justify-center items-center min-h-[350px] px-6"
    >
      <div className="mx-auto w-full max-w-lg relative flex flex-col items-center justify-center text-center">

        {/* ── Icon badge ─────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="
            relative flex items-center justify-center
            w-16 h-16 mb-6 rounded-[18px]
            bg-global-redpink/10 dark:bg-global-redpink/15
            border border-global-redpink/20 dark:border-global-redpink/30
          "
        >
          <i className="ri-error-warning-line text-3xl text-global-redpink" />
          {/* Glass-like inset highlight */}
          <span className="absolute inset-0 rounded-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]" />
        </div>

        {/* ── Error title ────────────────────────────────────────────────── */}
        <h3 className="
          mb-5 text-xl font-semibold tracking-tight leading-snug
          text-light-text dark:text-dark-text
        ">
          {error}
        </h3>

        {/* ── Gradient divider ───────────────────────────────────────────── */}
        {/*
          FIX: wrapper must have an explicit height so absolute children are
          positioned against a real box, not a 0px collapsed container.
          The radial-mask veil was also rendering at 0×0 — replaced with a
          cleaner layered approach.
        */}
        <div aria-hidden="true" className="relative w-full h-px">

          {/* Soft outer halo */}
          <div className="
            absolute inset-x-0 -top-px h-[3px]
            bg-gradient-to-r from-transparent via-global-redpink/40 to-transparent
            dark:via-global-purple/50
            blur-[3px]
          " />

          {/* Primary crisp line — adaptive to theme */}
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

        {/* ── Supporting copy ────────────────────────────────────────────── */}
        {/*
          FIX: copy voice changed from first-person ("I am having trouble…")
          to interface-passive ("Something went wrong…"), consistent with how
          system messages should read.
        */}
        <div className="mt-6 space-y-1.5">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Something went wrong while loading this content.
          </p>
          <p className="text-sm text-light-text-secondary/65 dark:text-dark-text-secondary/65">
            Please wait a moment and try again.
          </p>
        </div>

        {/* ── Ambient glow ───────────────────────────────────────────────── */}
        {/*
          FIX: replaced the <span> with pseudo-element Tailwind chains
          (fragile, hard to read) with two plain <div> blobs.
          backdrop-blur-sm removed — it was blurring content above, not the
          background behind. pointer-events-none ensures no accidental blocking.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 inset-0 overflow-hidden"
        >
          {/* Top purple-to-pink bloom */}
          <div className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-3/4 h-3/4
            bg-gradient-to-br from-global-purple/25 to-global-pink/20
            dark:from-global-purple/20 dark:to-global-pink/15
            blur-[80px] rounded-full
          " />

          {/* Bottom purple-to-blue wash */}
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
};

export default ErrorDisplay;