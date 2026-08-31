import type { FC, ReactNode } from "react";

/**
 * A collapsed block for reference material that would otherwise dominate.
 *
 * Native `<details>` on purpose: it is keyboard accessible, searchable by the
 * browser's find-in-page in modern engines, and needs no JavaScript — which
 * matters here because the page's other interactive affordance (the scroll-spy
 * rail) already depends on frame callbacks.
 */
const Disclosure: FC<{
  summary: string;
  hint?: string;
  children: ReactNode;
}> = ({ summary, hint, children }) => (
  <details className="group rounded-2xl border border-light-border dark:border-dark-border bg-light-surface/40 dark:bg-dark-surface/30">
    <summary
      className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-5 py-4
                 text-light-text dark:text-dark-text
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure
                 hover:bg-light-surface/60 dark:hover:bg-dark-surface/50 transition-colors"
    >
      <i
        aria-hidden="true"
        className="ri-arrow-right-s-line text-lg leading-none transition-transform group-open:rotate-90"
      />
      <span className="font-medium">{summary}</span>
      {hint && (
        <span className="ml-auto text-xs text-light-text-tertiary dark:text-dark-text-muted">
          {hint}
        </span>
      )}
    </summary>
    <div className="px-5 pb-5 pt-1">{children}</div>
  </details>
);

export default Disclosure;
