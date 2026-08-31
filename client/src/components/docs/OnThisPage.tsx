import { useEffect, useState, type FC } from "react";

interface Entry {
  id: string;
  label: string;
}

/**
 * "On this page" — the spine.
 *
 * The page runs several screens with no way to navigate it. This rail lists
 * every section and tracks which one is in view.
 *
 * TWO THINGS HERE ARE EASY TO GET WRONG, AND BOTH FAIL SILENTLY:
 *
 * 1. The scroll container is `main` in WorkLayout (`overflow-y-auto`), NOT the
 *    viewport. An IntersectionObserver left on its default root observes the
 *    viewport, appears to work on first paint, and then never updates as the
 *    user scrolls. The observer below is explicitly rooted on the nearest
 *    scrollable ancestor.
 * 2. Sections are discovered from the DOM via `data-doc-section` rather than
 *    passed in, because Design System and Changelog render their own
 *    DocSection from inside separate components.
 */
const OnThisPage: FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-doc-section]"),
    );
    setEntries(
      nodes.map((n) => ({ id: n.id, label: n.dataset.docSection ?? n.id })),
    );
    if (nodes.length === 0) return;

    // Walk up to the real scroller. Falling back to null (viewport) would be
    // the silent-failure case described above, so prefer an explicit find.
    let root: HTMLElement | null = nodes[0].parentElement;
    while (root && root !== document.body) {
      const oy = getComputedStyle(root).overflowY;
      if (oy === "auto" || oy === "scroll") break;
      root = root.parentElement;
    }
    const scroller = root && root !== document.body ? root : null;

    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((r) => seen.set(r.target.id, r.isIntersecting));
        // The topmost section currently in view wins, so scrolling back up
        // re-activates the earlier entry rather than sticking on the last one.
        const current = nodes.find((n) => seen.get(n.id));
        if (current) setActiveId(current.id);
      },
      {
        root: scroller,
        // Trip the moment a heading reaches the upper third — matches where a
        // reader's eye is, rather than waiting for it to hit the very top.
        rootMargin: "-96px 0px -66% 0px",
        threshold: 0,
      },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      data-toc-active={activeId}
      className="sticky top-4 max-h-[calc(100svh-6rem)] overflow-y-auto"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
        On this page
      </p>
      <ul className="space-y-1 border-l border-light-border dark:border-dark-border">
        {entries.map((e) => {
          const active = e.id === activeId;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={active ? "true" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                  active
                    ? "border-matte-azure font-medium text-matte-azure"
                    : "border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:border-light-border dark:hover:border-dark-border hover:text-light-text dark:hover:text-dark-text"
                }`}
              >
                {e.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default OnThisPage;
