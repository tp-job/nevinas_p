import { useEffect, useState, type FC } from "react";
import GroupLabel from "./GroupLabel";

interface Entry {
  id: string;
  label: string;
}

/**
 * Icon per section, keyed by the slug SectionHeading derives from its title.
 *
 * Unlike ArchitectureGrid's old FIELD_ICONS map (13 keys against 22 data
 * entries, so most rows fell through to one generic glyph and the icons
 * carried no information), this page has exactly six sections and all six are
 * mapped — an icon here actually distinguishes its row. `checkboxBlank` is
 * the fallback for a section nobody has mapped yet, same convention as the
 * rest of the docs components.
 */
const SECTION_ICONS: Record<string, string> = {
  "what-you-can-do": "ri-flashlight-line",
  "architecture-overview": "ri-stack-line",
  "project-structure": "ri-folder-3-line",
  "design-system": "ri-palette-line",
  changelog: "ri-git-commit-line",
  "project-docs": "ri-book-open-line",
};
const FALLBACK_ICON = "ri-checkbox-blank-circle-line";

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
 *
 * VISUAL TREATMENT
 *
 * This used to be a bare hairline-and-text list with no box of its own — at
 * the `lg` breakpoint the rail sat in open space with nothing marking it as a
 * distinct piece of UI, which read as "the right side is empty" even though
 * it had content.
 *
 * It's now a bordered surface with an icon and an active-state pill per row —
 * the same recipe Sidebar.tsx already uses for the app's own primary nav
 * (`bg-matte-azure/10 text-matte-azure` on the active NavLink, inside its own
 * bordered `glass-premium` aside). Reusing that recipe rather than inventing a
 * new one is what keeps this looking like part of the same app.
 *
 * The box classes are gated to `lg:` ONLY. Below `lg`, Docs.tsx already wraps
 * this component in a bordered `<details>` — a second border here would be a
 * card inside a card, exactly what the Design System and Architecture
 * sections were rebuilt to stop doing. Icons and the active pill still apply
 * at every width; only the outer border/background/padding is lg-only.
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
      className="sticky top-4 max-h-[calc(100svh-6rem)] overflow-y-auto
                 lg:rounded-2xl lg:border lg:border-light-border lg:bg-light-surface lg:p-4 lg:shadow-sm
                 lg:dark:border-dark-border lg:dark:bg-dark-bg"
    >
      {/* Hidden below lg: the disclosure wrapper in Docs.tsx puts the same
          label on its <summary> there, so this would be a second "On this
          page" beneath the collapsed toggle. Shown at lg, where there is no
          summary and this is the only label. Matches the `lg:grid` rail
          breakpoint in Docs.tsx — the two must move together.

          Reuses GroupLabel rather than a one-off <p> so the rail's header
          reads as the same device as every group heading in the Design
          System and Architecture sections, instead of a fourth label style
          on one page. GroupLabel's own bottom margin/rule stands in for what
          was previously a separate `mb-3`. */}
      <div className="hidden lg:block">
        <GroupLabel label="On this page" />
      </div>
      <ul className="space-y-0.5">
        {entries.map((e) => {
          const active = e.id === activeId;
          const icon = SECTION_ICONS[e.id] ?? FALLBACK_ICON;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={active ? "true" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  active
                    ? "bg-matte-azure/10 font-medium text-matte-azure"
                    : "text-light-text-secondary hover:bg-light-surface/50 hover:text-light-text dark:text-dark-text-secondary dark:hover:bg-dark-surface/50 dark:hover:text-dark-text"
                }`}
              >
                <i
                  aria-hidden="true"
                  className={`${icon} shrink-0 text-base ${
                    active
                      ? "text-matte-azure"
                      : "text-light-text-tertiary dark:text-dark-text-muted"
                  }`}
                />
                <span className="truncate">{e.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default OnThisPage;
