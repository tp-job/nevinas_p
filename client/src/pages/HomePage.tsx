import { useEffect, useRef, useState, createRef, type FC } from 'react';
import Navbar from '@/components/layouts/Navbar';
import Header from '@/components/layouts/Header';
import About from '@/components/ui/homepage/About';
import Services from '@/components/ui/homepage/Services';
import Work from '@/components/ui/homepage/Work';
import TimelineSection from '@/components/ui/homepage/Timeline';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StatementSlide, statements } from '@/components/ui/homepage/StatementSlides';
import TimelineScattered from '@/components/ui/homepage/TimelineScattered';
import BentoGrid from '@/components/ui/homepage/BentoGrid';
import CodeWithClarity from '@/components/ui/homepage/CodeWithClarity';
import AgencySection from '@/components/ui/homepage/AgencySection';
import FaqNewsFooter from '@/components/ui/homepage/FaqNewsFooter';
import ContactSplit from '@/components/ui/homepage/ContactSplit';
import SlideWrapper from '@/components/ui/homepage/SlideWrapper';
// import LiquidEther removed - effect now isolated in Header
// Removed external CSS import - now using CSS Modules

// SLIDE_PALETTES removed - palette now static in Header

// Define slides configuration for mapping
const getSlidesList = () => {
  const list = [
    { id: 'top', content: <Header />, variant: 'center' as const, scrollable: false },
    ...statements.map((_, i) => ({ id: `statement-${i}`, content: <StatementSlide index={i} />, variant: 'center' as const, scrollable: false })),
    { id: 'about', content: <ScrollReveal><About /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'timeline-sc', content: <TimelineScattered />, variant: 'fill' as const, scrollable: false },
    { id: 'bento', content: <BentoGrid />, variant: 'fill' as const, scrollable: true },
    { id: 'timeline', content: <ScrollReveal><TimelineSection /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'services', content: <ScrollReveal><Services /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'work', content: <ScrollReveal><Work /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'clarity', content: <CodeWithClarity />, variant: 'fill' as const, scrollable: true },
    { id: 'agency', content: <AgencySection />, variant: 'fill' as const, scrollable: true },
    { id: 'faq', content: <FaqNewsFooter />, variant: 'fill' as const, scrollable: true },
    { id: 'contact', content: <ContactSplit />, variant: 'fill' as const, scrollable: false }
  ];
  return list;
};

const HomePage: FC = () => {
  const scrollRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slidesList = getSlidesList();
  // Create refs for each sentinel
  const sentinelRefs = useRef(slidesList.map(() => createRef<HTMLDivElement>())).current;

  // Track active slide based on sentinels for color changing
  useEffect(() => {
    let timeoutId: number;
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let bestIdx = -1;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const idx = Number((entry.target as HTMLElement).dataset.slideIndex);
            if (!Number.isNaN(idx)) bestIdx = idx;
          }
        }
        if (bestIdx !== -1 && maxRatio > 0.4) {
          clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            setActiveSlide(bestIdx);
          }, 50);
        }
      },
      { root: scrollRef.current, threshold: [0.1, 0.4, 0.6, 0.9] }
    );

    sentinelRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [sentinelRefs]);

  useEffect(() => {
    document.documentElement.classList.add('homepage-slide-mode', 'homepage-theme');
    document.documentElement.dataset.homeSlide = String(activeSlide);
    return () => {
      document.documentElement.classList.remove('homepage-slide-mode', 'homepage-theme');
      delete document.documentElement.dataset.homeSlide;
    };
  }, [activeSlide]);

  // const etherColors removed - not used

  return (
    <div className="relative isolate h-svh min-h-svh overflow-hidden bg-transparent">

      <Navbar scrollContainerId="homepage-scroll" />

      <main
        ref={scrollRef}
        id="homepage-scroll"
        className="relative z-[var(--homepage-z-sticky)] h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* SENTINELS for Scroll Snapping */}
        <div className="absolute top-0 left-0 w-full z-[var(--homepage-z-base)] pointer-events-none">
          {slidesList.map((slide, i) => (
            <div
              key={`sentinel-${i}`}
              id={slide.id}
              data-slide-index={i}
              ref={sentinelRefs[i]}
              className="h-svh w-full snap-start snap-always"
            />
          ))}
        </div>

        {/* STICKY CONTAINER for Slides */}
        <div className="sticky top-0 left-0 w-full h-svh overflow-hidden z-[var(--homepage-z-overlay)] pointer-events-none">
          {slidesList.map((slide, i) => (
            <div key={`slide-${i}`} className="pointer-events-auto absolute inset-0 w-full h-full">
              <SlideWrapper
                slideIndex={i}
                variant={slide.variant}
                scrollable={slide.scrollable}
                sentinelRef={sentinelRefs[i]}
                scrollContainerRef={scrollRef}
              >
                {slide.content}
              </SlideWrapper>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
