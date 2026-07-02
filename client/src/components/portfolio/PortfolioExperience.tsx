import { useEffect, useMemo, useRef, useState } from "react";
import { getSlideStyle } from "@/lib/portfolioScroll";
import { usePortfolioScroll } from "@/hooks/usePortfolioScroll";
import {
  usePortfolioBackground,
  usePortfolioGyro,
} from "./three/usePortfolioBackground";
import PortfolioCursor from "./PortfolioCursor";
import PortfolioNav from "./PortfolioNav";
import PortfolioHUD from "./PortfolioHUD";
import {
  LIGHT_SLIDE_INDICES,
  SLIDE_COUNT,
  SLIDE_INDEX,
} from "./portfolioConfig";
import {
  AboutSlide,
  BentoSlide,
  HeroSlide,
  StatementSlides,
  TimelineSlide,
} from "./slides/EarlySlides";
import { JourneySlide, ServicesSlide, WorkSlide } from "./slides/MidSlides";
import {
  AgencySlide,
  ClaritySlide,
  ContactSlide,
} from "./slides/LateSlides";
import FaqSlide from "./slides/FaqSlide";
import RscSlide from "./slides/RscSlide";

export default function PortfolioExperience() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const gyroRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);
  const frameRef = useRef(0);
  const lastFpsRef = useRef(performance.now());

  const { current, activeIndex, progressPercent, goToSlide } =
    usePortfolioScroll(SLIDE_COUNT);

  const isLight = (LIGHT_SLIDE_INDICES as Set<number>).has(activeIndex);
  const isContact = activeIndex === SLIDE_INDEX.CONTACT;

  const tlProgress = useMemo(() => {
    const start = SLIDE_INDEX.TIMELINE / SLIDE_COUNT;
    const end = (SLIDE_INDEX.TIMELINE + 1) / SLIDE_COUNT;
    if (current < start - 0.01 || current >= end + 0.01) return { isTL: false, tlLocal: 0 };
    const tlLocal = Math.max(0, Math.min(1, (current - start) / (end - start)));
    return { isTL: true, tlLocal };
  }, [current]);

  usePortfolioBackground(bgRef, current, isLight, isContact);
  usePortfolioGyro(gyroRef, tlProgress.isTL, tlProgress.tlLocal);

  useEffect(() => {
    document.documentElement.classList.add("portfolio-mode");
    return () => document.documentElement.classList.remove("portfolio-mode");
  }, []);

  useEffect(() => {
    document.body.className = isLight ? "lt-hint" : "dk-hint";
  }, [isLight]);

  useEffect(() => {
    let id = 0;
    const tick = (now: number) => {
      frameRef.current++;
      if (frameRef.current % 8 === 0) {
        const instant = 1000 / (now - lastFpsRef.current);
        lastFpsRef.current = now;
        setFps((f) => Math.round(Math.min(f * 0.9 + instant * 0.1, 999)));
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const slideStyle = (index: number): React.CSSProperties => {
    const s = getSlideStyle(current, index, SLIDE_COUNT);
    return {
      opacity: s.opacity,
      transform: `translateY(${s.translateY}px)`,
      pointerEvents: s.pointerEvents,
    };
  };

  const showScrollLabel =
    tlProgress.isTL || activeIndex === SLIDE_INDEX.BENTO;

  return (
    <div className="portfolio-root" id="top">
      <canvas id="c" ref={bgRef} />
      <canvas
        id="gyro-c"
        ref={gyroRef}
        className={tlProgress.isTL ? "vis" : ""}
      />

      <PortfolioCursor isLight={isLight} />
      <PortfolioNav isLight={isLight} onGoto={goToSlide} />
      <PortfolioHUD
        slideCount={SLIDE_COUNT}
        activeIndex={activeIndex}
        progressPercent={progressPercent}
        current={current}
        isLight={isLight}
        showScrollLabel={showScrollLabel}
        showHint={current < 0.03}
        fps={fps}
      />

      <div id="stage">
        <HeroSlide style={slideStyle(0)} heroActive={activeIndex === 0} />
        <StatementSlides
          slideStyle={slideStyle}
          statementActive={activeIndex >= 1 && activeIndex <= 4 ? activeIndex : null}
        />
        <AboutSlide style={slideStyle(SLIDE_INDEX.ABOUT)} />
        <TimelineSlide
          style={slideStyle(SLIDE_INDEX.TIMELINE)}
          tlLocal={tlProgress.tlLocal}
        />
        <BentoSlide style={slideStyle(SLIDE_INDEX.BENTO)} />
        <JourneySlide style={slideStyle(SLIDE_INDEX.JOURNEY)} />
        <ServicesSlide style={slideStyle(SLIDE_INDEX.SERVICES)} />
        <WorkSlide style={slideStyle(SLIDE_INDEX.WORK)} />
        <ClaritySlide style={slideStyle(SLIDE_INDEX.CLARITY)} />
        <AgencySlide
          style={slideStyle(SLIDE_INDEX.AGENCY)}
          onGotoContact={() => goToSlide(SLIDE_INDEX.CONTACT)}
        />
        <ContactSlide style={slideStyle(SLIDE_INDEX.CONTACT)} />
        <FaqSlide style={slideStyle(SLIDE_INDEX.FAQ)} />
        <RscSlide style={slideStyle(SLIDE_INDEX.RSC)} />
      </div>
    </div>
  );
}
