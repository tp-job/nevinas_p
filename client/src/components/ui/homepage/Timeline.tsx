import { useEffect, useRef, useState } from "react";
import { DataTimeline } from "@/data/HomeData";
import "@/styles/components/timeline.css";

const useActiveIndex = (
  sectionRefs: React.MutableRefObject<HTMLDivElement[]>,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto') || document.getElementById("homepage-scroll") || window;
    
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
    handleScroll(); // Initial check

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
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto') || document.getElementById("homepage-scroll") || window;
    
    let rafId = 0;

    const updatePosition = () => {
      const activeSection = sectionRefs.current[activeIndex];
      const container = containerRef.current;
      if (!activeSection || !container) return;

      const sectionRect = activeSection.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const nextTop = sectionRect.top - containerRect.top + sectionRect.height / 2;
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

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const activeIndex = useActiveIndex(sectionRefs, containerRef);

  return (
    <section id="timeline" className="tl-root transition-colors duration-500 py-20">
      {/* Header Block — Canonical style */}
      <div className="mb-16 flex flex-col items-center text-center px-[8%]">
        <p className="text-xs font-medium tracking-widest uppercase mb-2 text-light-text-secondary dark:text-dark-text-secondary">
          Experience
        </p>
        <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-light-text dark:text-dark-text mb-1">
          My Journey
        </h2>
        <h3 className="font-zen text-xl font-light tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
          私の歩み
        </h3>
        <div className="w-12 h-1 bg-gradient-to-r from-[#c060f5] to-[#7b5aff] rounded-full mt-6 opacity-60" />
      </div>

      <div className="tl-wrapper" ref={containerRef}>
        <div className="tl-line" />
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
                <article className={`tl-card ${index === activeIndex ? "active" : ""}`}>
                  <span className="tl-badge">STEP {index + 1}</span>
                  <p className="tl-meta">{item.date}</p>
                  <h3 className="tl-title">{item.title}</h3>
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

