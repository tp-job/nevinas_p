import { useState, type FC } from "react";

/**
 * A shell/JSON snippet block: language label, Copy button, horizontal scroll.
 *
 * No syntax-highlighting dependency. The payload here is shell commands and
 * short JSON response shapes — a highlighter earns its weight on a page of
 * real source code, not eight setup steps and a dozen response signatures.
 * Adding one to the critical path for that would cost more than it returns.
 *
 * `document.execCommand` is NOT used as a fallback for the Clipboard API: it
 * is deprecated, and every browser this project targets (see the DS's
 * baseline) has `navigator.clipboard.writeText`. A failed copy surfaces as
 * the button silently not flipping to "Copied" rather than a fallback that
 * would need its own testing surface.
 */
const CodeBlock: FC<{
  code: string;
  language?: string;
}> = ({ code, language = "bash" }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard denied (permissions, insecure context) — button just stays
         in its default state. Nothing else to degrade to. */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-light-border dark:border-dark-border bg-light-surface-2 dark:bg-dark-surface">
      <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-light-text-tertiary dark:text-dark-text-muted">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs
                     text-light-text-secondary dark:text-dark-text-secondary
                     transition-colors hover:bg-light-surface dark:hover:bg-dark-bg/50
                     hover:text-light-text dark:hover:text-dark-text
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure"
        >
          <i
            aria-hidden="true"
            className={copied ? "ri-check-line" : "ri-file-copy-line"}
          />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed">
        <code className="font-mono text-light-text dark:text-dark-text">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
