import type { FC } from "react";

/**
 * Stable, URL-safe id from a section title.
 *
 * Deliberately NOT exported: the file would then export a component and a
 * function, which breaks Fast Refresh. Nothing else needs it — OnThisPage
 * reads the ids back off the DOM rather than recomputing them.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A section heading that can be linked to.
 *
 * The page previously had **zero** ids across 4.5 screens of content, so no
 * section could be deep-linked, and no table of contents was possible. Every
 * heading now carries a slug, and `data-doc-section` is the contract the
 * OnThisPage rail reads — DOM-scanned rather than passed down, because two of
 * the sections (Design System, Changelog) render their own DocSection from
 * inside separate components and would otherwise need prop drilling.
 *
 * `scroll-mt` keeps the heading clear of the fixed mobile top bar when a deep
 * link lands on it.
 *
 * Weight is 500 against the page title's 300: per DS v3.2 size leads hierarchy,
 * so a section must not out-weigh the title that owns it. Previously sections
 * were 600 while the title was 400 — the smaller text was the heavier one.
 */
const SectionHeading: FC<{ title: string }> = ({ title }) => {
  const id = slugify(title);
  return (
    <h2
      id={id}
      data-doc-section={title}
      className="group scroll-mt-24 mb-1.5 flex items-baseline gap-2
                 border-b border-light-border dark:border-dark-border pb-2
                 text-[1.75rem] font-medium leading-tight
                 text-light-text dark:text-dark-text"
    >
      {title}
      <a
        href={`#${id}`}
        aria-label={`Link to section: ${title}`}
        className="text-base font-normal opacity-0 transition-opacity
                   text-light-text-tertiary dark:text-dark-text-muted
                   group-hover:opacity-100 focus-visible:opacity-100
                   focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-matte-azure hover:text-matte-azure"
      >
        #
      </a>
    </h2>
  );
};

export default SectionHeading;
