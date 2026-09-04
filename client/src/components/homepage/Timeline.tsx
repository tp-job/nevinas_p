import { useEffect, useRef, useState } from "react";
import { DataTimeline } from "@/data/homeData";

/**
 * "My Journey" — a capability index, rendered as one.
 *
 * WHY THE OLD FORM READ AS DECORATION
 *
 * This was an alternating two-column timeline: a vertical spine, a dot that
 * tracked the scroll position, and glass cards badged STEP 1 through STEP 5.
 * Every one of those devices asserts a sequence.
 *
 * The data has no sequence. The five entries are Languages, Education,
 * Projects, Tools I Use and Future Goals — parallel facets of a profile, not
 * stages of anything. Their `date` field is not a date either; it holds
 * "Core Skills", "Learning Journey", "Portfolio Work", "Tech Stack", "Vision".
 * So the layout was claiming a progression the content cannot support, and a
 * reader who looks closely finds the claim empty. That is what makes a section
 * feel decorative rather than engineered: the form is doing work the data
 * is not backing.
 *
 * Now it is an indexed reference table — the thing it always was. Index,
 * category, subject, detail, one row each, on a hairline grid.
 *
 * A NOTE ON APPLYING THE DATA-PAGE LANGUAGE HERE
 *
 * The homepage review argued against carrying the dashboard's chrome onto this
 * page, and this is not a reversal of that. The rule was that chrome should
 * follow content type: atmosphere for the hero and the statements, structure
 * for reference material. This slide is the most reference-like content on the
 * homepage — a list of capabilities someone reads to find a fact — so it earns
 * the structured treatment where a hero slide would not.
 *
 * The scroll-tracking hook is kept: it still drives which row reads as active,
 * which is genuine feedback about where the reader is. Only the sequence
 * claims were removed.
 */

const useActiveIndex = (
  rowRefs: React.MutableRefObject<HTMLDivElement[]>,
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scrollContainer =
      containerRef.current?.closest(".overflow-y-auto") ||
      document.getElementById("homepage-scroll") ||
      window;

    const handleScroll = () => {
      if (!rowRefs.current.length) return;
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [rowRefs, containerRef]);

  return activeIndex;
};

const Timeline = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const activeIndex = useActiveIndex(rowRefs, containerRef);

  return (
    <section className="w-full px-[8%] py-20 transition-colors duration-500">
      {/* Header. Left-aligned over a hairline, matching the section headers on
          the data pages — a centred block with a gradient divider underneath
          reads as a marketing beat, which is the opposite of the ask. */}
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-light-border pb-3 dark:border-dark-border">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-light-text dark:text-dark-text">
            My Journey
          </h2>
          <span className="font-zen text-xs text-light-text-tertiary dark:text-dark-text-muted">
            私の歩み
          </span>
        </div>
        <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
          {DataTimeline.length} areas
        </span>
      </div>

      <div ref={containerRef}>
        <dl className="text-sm">
          {DataTimeline.map((item, index) => {
            const active = index === activeIndex;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) rowRefs.current[index] = el;
                }}
                className={`grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-light-border/60 py-5 transition-colors last:border-0 sm:grid-cols-[3rem_10rem_1fr] dark:border-dark-border/60 ${
                  active ? "" : "opacity-70"
                }`}
              >
                {/* Index, not a step. Zero-padded and tabular so the column is
                    a fixed rail the eye can run down. */}
                <span
                  className={`tabular-nums ${
                    active
                      ? "text-matte-azure"
                      : "text-light-text-tertiary dark:text-dark-text-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* The category — what `date` actually holds. */}
                <dt className="col-start-2 text-xs font-medium uppercase tracking-[0.12em] text-light-text-tertiary sm:col-start-2 dark:text-dark-text-muted">
                  {item.date}
                </dt>

                <dd className="col-start-2 sm:col-start-3 sm:row-start-1">
                  <p className="mb-1 text-base text-light-text dark:text-dark-text">
                    {item.title}
                  </p>
                  <p className="max-w-[68ch] text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                    {item.description}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default Timeline;
