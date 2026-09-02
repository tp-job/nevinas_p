import { useEffect, useState } from "react";

/**
 * Read design-token values out of the live stylesheet.
 *
 * WHY THIS EXISTS
 *
 * The Docs design-system page used to render a hand-maintained copy of every
 * token hex in `data/docData.ts`. That copy had already drifted: it showed
 * Accent as #2E3558, Success #2E7D32, Error #C62828 and Warning #E65100, while
 * `index.css` defines #C8CDEB, #34a853, #ea4335 and #fbbc05. Four of the five
 * semantic swatches on the page were the wrong colour, and nothing could catch
 * it — two lists of hex codes in different files have no relationship a
 * compiler or a test can check.
 *
 * So the page stops keeping a copy. It resolves `--color-*` off
 * `document.documentElement` at mount, which is the same value the rest of the
 * site actually paints with. The list in docData is now only names and
 * variable references; a value there is a fallback for the case where the
 * variable does not resolve, not a second source of truth.
 *
 * THEME DEPENDENCE IS REAL AND DELIBERATE
 *
 * ThemeContext toggles a `dark` class on <html>, and some tokens (`--color-
 * accent`, the `--color-text-*` aliases) are redefined under it. Those resolve
 * differently per theme, so this re-reads whenever that class changes — a
 * value captured once at mount would quietly show the wrong theme's colour
 * after a toggle. Mode-specific tokens (`--color-light-*`, `--color-dark-*`)
 * are defined unconditionally and read the same in both, which is what lets
 * the spec sheet show light and dark side by side at once.
 *
 * Values come back as authored — `#0A0F19`, `rgba(255,255,255,0.55)` — not
 * normalised, because the point is to show what the stylesheet says.
 */
export function useCssTokens(variables: string[]): Record<string, string> {
  const key = variables.join(",");

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;

    const read = () => {
      const cs = getComputedStyle(root);
      const next: Record<string, string> = {};
      for (const v of key.split(",")) {
        const raw = cs.getPropertyValue(v).trim();
        if (raw) next[v] = raw;
      }
      setValues(next);
    };

    read();

    // Only the class attribute matters — that is the single thing ThemeContext
    // mutates. Observing the whole subtree would fire on every render of the
    // app for no benefit.
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [key]);

  return values;
}
