import { useEffect, useRef, useState } from "react";
import { DataTimeline } from "@/data/HomeData";
import "@/styles/components/timeline.css";

const useActiveIndex = (sectionRefs: React.MutableRefObject<HTMLDivElement[]>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-10% 0px -10% 0px" },
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

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
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeIndex, containerRef, sectionRefs]);

  return <div className="tl-dot" style={{ top }} />;
};

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const activeIndex = useActiveIndex(sectionRefs);

  return (
    <section id="timeline" className="tl-root transition-colors duration-500">
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
