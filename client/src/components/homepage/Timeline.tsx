import { useEffect, useRef, useState } from "react";
import { DataTimeline } from "@/data/homeData";
import "@/styles/module/Timeline.module.css";

// ─── Hooks — logic unchanged ─────────────────────────────────────

const useActiveIndex = (
  sectionRefs: React.MutableRefObject<HTMLDivElement[]>,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scrollContainer =
      containerRef.current?.closest(".overflow-y-auto") ||
      document.getElementById("homepage-scroll") ||
      window;

    const handleScroll = () => {
      if (!sectionRefs.current.length) return;

      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

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
  }, [sectionRefs, containerRef]);

  return activeIndex;
};

const TimelineDot = ({
  activeIndex,
  sectionRefs,
  containerRef,
}: {
  activeIndex: number;
  sectionRefs: React.MutableRefObject<HTMLDivElement[]>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const scrollContainer =
      containerRef.current?.closest(".overflow-y-auto") ||
      document.getElementById("homepage-scroll") ||
      window;

    let rafId = 0;

    const updatePosition = () => {
      const activeSection = sectionRefs.current[activeIndex];
      const container = containerRef.current;
      if (!activeSection || !container) return;

      const sectionRect = activeSection.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const nextTop =
        sectionRect.top - containerRect.top + sectionRect.height / 2;
      setTop(nextTop);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();
    scrollContainer.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(rafId);
      scrollContainer.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeIndex, containerRef, sectionRefs]);

  return <div className="tl-dot" style={{ top }} />;
};

// ─── Section ──────────────────────────────────────────────────────

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const activeIndex = useActiveIndex(sectionRefs, containerRef);

  return (
    <section
      id="timeline-content"
      className="tl-root transition-colors duration-500 py-20"
    >
      {/*
        ── Header block — DS §2.4 canonical pattern ──────────────────
        Eyebrow : text-xs font-semibold tracking-widest uppercase   (DS §2.3 label token)
                  color: text-haze (light) / dark:text-cool (dark)
        h2      : font-normal (400) — DS §2.2 h2 headline max weight
                  text-4xl sm:text-5xl matches DS headline-lg token
        JP sub  : font-zen font-light — Zen Kaku Gothic New 300, JP only (DS §2.1)
        Divider : from-haze to-cool — main palette gradient, opacity-60 per DS §2.5
      */}
      <div className="mb-16 flex flex-col items-center text-center px-[8%]">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2 text-haze dark:text-cool">
          {/* ↑ font-semibold (was font-medium) — DS §2.4 canonical eyebrow */}
          Experience
        </p>
        <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-light-text dark:text-dark-text mb-1">
          My Journey
        </h2>
        <h3 className="font-zen text-xl font-light tracking-wide text-haze dark:text-cool">
          私の歩み
        </h3>
        <div className="w-12 h-1 bg-gradient-to-r from-haze to-cool rounded-full mt-6 opacity-60" />
      </div>

      {/* ── Two-column timeline ────────────────────────────────────── */}
      <div className="tl-wrapper" ref={containerRef}>
        {/* Atmospheric spine — French Gray → Cool Gray Sub gradient (DS §1.7 sub-palette) */}
        <div className="tl-line" />

        {/* Periwinkle tracking dot — main palette accent (DS §1.1) */}
        <TimelineDot
          activeIndex={activeIndex}
          sectionRefs={sectionRefs}
          containerRef={containerRef}
        />

        {DataTimeline.map((item, index) => (
          <div
            key={item.id}
            data-index={index}
            ref={(el) => {
              if (el) sectionRefs.current[index] = el;
            }}
            className="tl-section"
          >
            <div className="tl-container">
              <div
                className="tl-card-wrap"
                style={{
                  justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                  gridColumn: index % 2 === 0 ? "1" : "2",
                }}
              >
                {/*
                  tl-card: DS §5.2 glass surface
                  active:  Surface-2 elevation + French Gray specular (DS §5.1)
                  Hover:   translateY(-2px) — DS §20 rule, never scale()
                */}
                <article
                  className={`tl-card ${index === activeIndex ? "active" : ""}`}
                  tabIndex={0}
                >
                  {/*
                    Badge: DS §13.2 chip "primary" recipe
                    font-semibold (600) label exception — DS §2.2
                  */}
                  <span className="tl-badge">STEP {index + 1}</span>

                  {/* Date: DS caption token — Cool Gray #878CB4 */}
                  <p className="tl-meta">{item.date}</p>

                  {/* Title: DS headline-sm — font-normal (400), Midnight / dark-text */}
                  <h3 className="tl-title">{item.title}</h3>

                  {/* Description: font-light (300) — Haze light / Cool Gray dark */}
                  <p className="tl-desc">{item.description}</p>
                </article>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;