import { useEffect, useMemo, useRef, useState, createRef, type FC, type RefObject } from 'react';
import Navbar from '@/components/layouts/Navbar';
import Header from '@/components/layouts/Header';
import About from '@/components/homepage/About';
import Work from '@/components/homepage/Work';
import TimelineSection from '@/components/homepage/Timeline';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StatementSlide, statements } from '@/components/homepage/StatementSlides';
import TimelineScattered from '@/components/homepage/TimelineScattered';
import BentoGrid from '@/components/homepage/BentoGrid';
import CodeWithClarity from '@/components/homepage/CodeWithClarity';
import AgencySection from '@/components/homepage/AgencySection';
import FaqNewsFooter from '@/components/homepage/FaqNewsFooter';
import ContactSplit from '@/components/homepage/ContactSplit';
import SlideWrapper from '@/components/homepage/SlideWrapper';
import Footer from '@/components/layouts/Footer';
import NodeMap from '@/components/homepage/Nodemap';
import LiquidEtherBackdrop from '@/components/layouts/LiquidEtherBackdrop';
import Testimonials from '@/components/homepage/Testimonials';
import HorizontalServices from '@/components/homepage/HorizontalServices';
// import ContributorTimeline from '@/components/homepage/ContributorTimeline';

const getSlidesList = (scrollContainerRef: RefObject<HTMLElement | null>) => {
  const list = [
    { id: 'top', content: <Header />, variant: 'center' as const, scrollable: false }, ...statements.map((_, i) => ({ id: `statement-${i}`, content: <StatementSlide index={i} />, variant: 'center' as const, scrollable: false })),
    { id: 'about', content: <ScrollReveal><About /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'timeline-sc', content: <TimelineScattered />, variant: 'fill' as const, scrollable: true },
    { id: 'timeline', content: <ScrollReveal><TimelineSection /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'bento', content: <BentoGrid />, variant: 'fill' as const, scrollable: true },
    { id: 'clarity', content: <CodeWithClarity />, variant: 'fill' as const, scrollable: true },
    { id: 'nodemap', content: <NodeMap />, variant: 'fill' as const, scrollable: true },
    { id: 'services', content: <HorizontalServices />, variant: 'fill' as const, scrollable: true },
    { id: 'work', content: <ScrollReveal><Work /></ScrollReveal>, variant: 'content' as const, scrollable: true },
    { id: 'agency', content: <AgencySection />, variant: 'fill' as const, scrollable: true },
    { id: 'testimonial', content: <Testimonials />, variant: 'fill' as const, scrollable: false },
    { id: 'faq', content: <FaqNewsFooter />, variant: 'fill' as const, scrollable: true },
    { id: 'contact', content: <ContactSplit />, variant: 'fill' as const, scrollable: true },
    { id: 'footer', content: <Footer />, variant: 'fill' as const, scrollable: false },
  ];
  return list;
};

const HomePage: FC = () => {
  const scrollRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Memoized: scrollRef's identity is stable for the component's lifetime, and
  // rebuilding this 15-element array (mounting/elements) on every activeSlide
  // change is unnecessary work.
  const slidesList = useMemo(() => getSlidesList(scrollRef), []);
  // Create refs for each sentinel
  const sentinelRefs = useRef(slidesList.map(() => createRef<HTMLDivElement>())).current;

  // Indices of the slides that show the LiquidEther mesh (Header + statements +
  // Footer). A single shared backdrop behind the stack is faded/paused for every
  // other slide, so only ONE WebGL context runs instead of one per slide.
  const etherSlideSet = useMemo(
    () =>
      new Set(
        slidesList
          .map((s, i) => ({ id: s.id, i }))
          .filter(
            ({ id }) =>
              id === 'top' || id.startsWith('statement-') || id === 'footer',
          )
          .map(({ i }) => i),
      ),
    [slidesList],
  );

  // ── Progressive slide mounting ───────────────────────────────────────────
  // Only slides within one step of the active one are mounted. At first paint
  // that means 2 slides instead of ~18, which is the single biggest lever on
  // Total Blocking Time — previously the initial render had to construct every
  // section of the site (bento grid, node map, charts, testimonials, contact…)
  // before the header could become interactive.
  //
  // The set only ever GROWS. Unmounting slides after they scroll away would
  // reclaim more memory, but it would also re-run their entry animations and
  // discard internal scroll position each time the user scrolled back — jank
  // that costs more than it saves. Growing means a full scroll-through ends up
  // at today's memory usage, while the initial load (what a cold visit and
  // Lighthouse both measure) is dramatically cheaper.
  const [mountedSlides, setMountedSlides] = useState<Set<number>>(() => new Set([0, 1]));

  // Growth is deliberately withheld until the user actually scrolls.
  //
  // activeSlide comes from an IntersectionObserver over 18 full-height
  // sentinels. While the first paint is still settling — svh resolving, fonts
  // swapping, images landing — that observer can briefly report a slide far
  // from the top. Because the mounted set only grows, one such transient blip
  // permanently mounts a band of heavy slides, and the cost is paid forever.
  // That showed up as a bimodal cold-load: most runs mounted 2 slides, some
  // mounted many and spent 1.5-2s in mount work (16-20 long tasks vs 3).
  //
  // A real visitor cannot reach slide N without scrolling, so treating "has
  // scrolled" as the precondition costs nothing and makes the cold load
  // deterministic.
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || hasScrolled) return;
    const onScroll = () => {
      if (el.scrollTop > 0) setHasScrolled(true);
    };
    // Anchor navigation (e.g. href="#work") also scrolls the container, so this
    // covers programmatic jumps as well as user input.
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // catch a restored scroll position on mount
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasScrolled]);

  useEffect(() => {
    if (!hasScrolled) return;
    setMountedSlides((prev) => {
      const next = new Set(prev);
      let grew = false;
      for (const i of [activeSlide - 1, activeSlide, activeSlide + 1]) {
        if (i >= 0 && i < slidesList.length && !next.has(i)) {
          next.add(i);
          grew = true;
        }
      }
      return grew ? next : prev;
    });
  }, [activeSlide, slidesList.length, hasScrolled]);

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
    <div className="relative isolate h-svh min-h-svh overflow-hidden bg-transparent homepage-root">

      {/* Navbar wrapper — zero-height: Navbar is position:fixed so it doesn't need layout space */}
      <header className="site-header absolute top-0 left-0 right-0 h-0 overflow-visible z-50">
        <a href="#homepage-scroll" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-charcoal focus:text-dark-text-primary focus:p-2">Skip to content</a>
        <Navbar scrollContainerId="homepage-scroll" />
      </header>

      <main
        ref={scrollRef}
        id="homepage-scroll"
        className="relative z-[var(--homepage-z-sticky)] h-svh w-full overflow-y-auto overflow-x-hidden scroll-smooth" 
        style={{ scrollSnapType: 'y mandatory', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
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
          {/* Single shared LiquidEther behind every slide — one WebGL context
              instead of one per slide. Visible/animated only while an
              ether-slide (Header / statements / Footer) is active. */}
          <LiquidEtherBackdrop active={etherSlideSet.has(activeSlide)} />

          {slidesList.map((slide, i) => (
            <div key={`slide-${i}`} className="pointer-events-auto absolute inset-0 w-full h-full">
              <SlideWrapper
                slideIndex={i}
                variant={slide.variant}
                scrollable={slide.scrollable}
                sentinelRef={sentinelRefs[i]}
                scrollContainerRef={scrollRef}
                mounted={mountedSlides.has(i)}
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