// ─────────────────────────────────────────────────────────────
//  MA Studio — Horizontal Services § S6
//  HorizontalServices.tsx
//
//  Architecture:
//  • 550 vh outer wrapper creates scroll space
//  • position:sticky viewport + translateX track
//  • scroll progress drives panel index & progress bar
//  • Per-panel content fades in when panel becomes active
//  • Dot indicators + keyboard arrow navigation
//
//  Usage:
//  <HorizontalServices id="services" />
//  <HorizontalServices panels={customPanels} id="services" />
// ─────────────────────────────────────────────────────────────

'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { HorizontalServicesProps, ServicePanel } from '@/types/horizon';
import styles from '@/styles/module/HorizontalServices.module.css';
import iconCodeImg from '@/assets/image/noubackground/code-icon.png';
import iconWebImg from '@/assets/image/noubackground/web-icon.png';
import iconAIImg from '@/assets/image/noubackground/ai-solution.png';
import iconInteractiveImg from '@/assets/image/noubackground/hand-social.png';
import iconPortfolioImg from '@/assets/image/noubackground/nevinas-full-body.png';

// ─── Default Panel Data ────────────────────────────────────
const DEFAULT_PANELS: ServicePanel[] = [
  {
    num:         '01',
    titleJP:     '精巧な\nコード',
    tag:         'Development',
    description:
      'We craft precise, elegant code architecture — drawing from the same discipline that shapes traditional Japanese craftsmanship. Every line purposeful. Every system breathes.',
    icon: <img src={iconCodeImg} alt="Code" className={styles.iconImg} draggable={false} />,
  },
  {
    num:         '02',
    titleJP:     'Web の\n世界観',
    tag:         'Web Design',
    description:
      'Digital experiences that transcend the screen. We build worlds where users don\'t just visit — they immerse, feel, and remember long after they leave.',
    icon: <img src={iconWebImg} alt="Web" className={styles.iconImg} draggable={false} />,
  },
  {
    num:         '03',
    titleJP:     'AI の\n知恵',
    tag:         'AI Systems',
    description:
      'Integrating intelligence with intention. Our AI systems don\'t just automate — they understand context, culture, and nuance with deep precision.',
    icon: <img src={iconAIImg} alt="AI" className={styles.iconImg} draggable={false} />,
  },
  {
    num:         '04',
    titleJP:     '遊びと\n没入感',
    tag:         'Interactive',
    description:
      'Interactive worlds where every interaction sparks delight. From game mechanics to immersive web — we make technology playful and profound.',
    icon: <img src={iconInteractiveImg} alt="Interactive" className={styles.iconImg} draggable={false} />,
  },
  {
    num:         '05',
    titleJP:     '作品と\n記録',
    tag:         'Portfolio',
    description:
      'Your portfolio is your signature in the world. We build digital archives that tell your story with elegance, depth, and timeless quality across all generations.',
    icon: <img src={iconPortfolioImg} alt="Portfolio" className={styles.iconImg} draggable={false} />,
  },
];

// ─── Helpers ───────────────────────────────────────────────
/** Clamps a value between min and max. */
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, max));

// ─── Component ─────────────────────────────────────────────
const HorizontalServices: React.FC<HorizontalServicesProps> = ({
  panels       = DEFAULT_PANELS,
  id           = 'services',
  introBig     = '我々の\n技',
  introSub     = 'SCROLL TO EXPLORE OUR CRAFT',
}) => {
  const TOTAL  = panels.length + 1;   // +1 for intro panel
  const SCROLL = TOTAL - 1;           // scroll "steps"

  // Refs
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);

  // State
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [progressPct,  setProgressPct]  = useState(0);  // 0–100 within section
  const [visiblePanels, setVisiblePanels] = useState<Set<number>>(new Set([0]));

  // ── Dynamic CSS variable updates ────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Update CSS variable for panel count
    wrap.style.setProperty('--panel-count', TOTAL.toString());
  }, [TOTAL]);

  // ── Scroll handler ────────────────────────────────────────
  const updateScroll = useCallback(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!wrap || !track || !container) return;

    const containerRect = container.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    
    // Calculate scroll position within the container
    const containerScrollTop = container.scrollTop;
    const containerHeight = containerRect.height;
    const wrapHeight = wrapRect.height;
    const scrollableHeight = wrapHeight - containerHeight;
    
    const progress = Math.min(containerScrollTop / scrollableHeight, 1);

    // Translate track
    const tx = progress * SCROLL * 100;
    track.style.transform = `translateX(-${tx}vw)`;

    // Active panel index
    const idx = Math.round(progress * SCROLL);
    setActiveIndex(idx);
    setProgressPct(progress * 100);

    // Update visibility for animation (check on every scroll)
    setVisiblePanels(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, [SCROLL]);

  // ── Scroll listener (RAF-throttled) ───────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    updateScroll(); // initial paint

    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [updateScroll]);

  // ── Keyboard navigation ────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onKey = (e: KeyboardEvent) => {
      // Only handle when section is in view
      const { top, bottom } = container.getBoundingClientRect();
      if (top > window.innerHeight || bottom < 0) return;

      const containerHeight = container.clientHeight;
      const scrollableHeight = container.scrollHeight - containerHeight;
      const stepH = scrollableHeight / SCROLL;

      const currentScroll = container.scrollTop;
      const currentIndex = Math.round(currentScroll / stepH);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const targetIndex = Math.min(currentIndex + 1, SCROLL);
        const target = targetIndex * stepH;
        container.scrollTo({ top: target, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const targetIndex = Math.max(currentIndex - 1, 0);
        const target = targetIndex * stepH;
        container.scrollTo({ top: target, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [SCROLL]);

  // ── Dot click → scroll to panel ───────────────────────────
  const scrollToPanel = useCallback(
    (panelIndex: number) => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerHeight = container.clientHeight;
      const scrollableHeight = container.scrollHeight - containerHeight;
      const stepH = scrollableHeight / SCROLL;
      container.scrollTo({ top: panelIndex * stepH, behavior: 'smooth' });
    },
    [SCROLL],
  );

  // ── Memoised panel title (newline → <br/>) ─────────────────
  const renderTitle = (text: string) =>
    text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  // ── Intro title lines ──────────────────────────────────────
  const introLines = useMemo(() => renderTitle(introBig), [introBig]);

  // ── Dynamic CSS variable updates ────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Update CSS variable for panel count
    wrap.style.setProperty('--panel-count', TOTAL.toString());
    wrap.style.setProperty('--track-width', `${TOTAL * 100}vw`);
  }, [TOTAL]);

  // ─────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto overflow-x-hidden"
    >
      <div
        id={id}
        ref={wrapRef}
        className={styles.wrap}
        aria-label="Services — horizontal scroll section"
      >
        {/* ── Progress bar ── */}
        <div
          className={styles.progressBar}
          style={{ width: `${progressPct}%` }}
          aria-hidden="true"
        />

        <div className={styles.sticky}>
          {/* ── Track ── */}
          <div ref={trackRef} className={styles.track}>

          {/* ─── Panel 0 — Intro ─────────────────────────── */}
          <div className={styles.introPanel} aria-label="Services intro">
            <div className={styles.cornerTL} aria-hidden="true" />
            <div className={styles.cornerBR} aria-hidden="true" />

            <span className={styles.introLabel}>— Services</span>

            <h2 className={styles.introBig}>
              {introLines}
            </h2>

            <p className={styles.introSub}>{introSub}</p>

            <div className={styles.scrollHint} aria-hidden="true">
              <span>SCROLL</span>
              <div className={styles.scrollArrow}>
                <span />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    points="2,4 6,8 10,4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ─── Panels 1‥N — Services ───────────────────── */}
          {panels.map((panel, i) => {
            const panelIdx  = i + 1;   // 1-based in the track
            const isVisible = visiblePanels.has(panelIdx);
            const isLast    = panelIdx === TOTAL - 1;

            return (
              <div
                key={panel.num}
                className={styles.panel}
                aria-label={`Service ${panel.num}: ${panel.tag}`}
              >
                {/* Divider — not on last panel */}
                {!isLast && (
                  <div className={styles.divider} aria-hidden="true" />
                )}

                <div
                  className={`${styles.panelInner}${isVisible ? ` ${styles.visible}` : ''}`}
                >
                  {/* Icon */}
                  <div className={styles.iconWrap}>
                    {typeof panel.icon === 'string' ? (
                      <img
                        src={panel.icon}
                        alt={panel.iconAlt ?? panel.tag}
                        className={styles.iconImg}
                        draggable={false}
                      />
                    ) : panel.icon ? (
                      <div className={styles.iconSvgWrap}>
                        {panel.icon}
                      </div>
                    ) : null}
                  </div>

                  {/* Text */}
                  <div className={styles.textWrap}>
                    <div
                      className={styles.panelNum}
                      aria-hidden="true"
                    >
                      {panel.num}
                    </div>

                    <h3 className={styles.panelTitle}>
                      {renderTitle(panel.titleJP)}
                    </h3>

                    <p className={styles.panelDesc}>
                      {panel.description}
                    </p>

                    <span className={styles.panelTag}>
                      {panel.tag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>{/* /track */}

        {/* ── Dot indicators ── */}
        <nav
          className={styles.dots}
          aria-label="Service panel navigation"
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot}${activeIndex === i ? ` ${styles.dotActive}` : ''}`}
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to panel ${i === 0 ? 'intro' : panels[i - 1]?.tag ?? i}`}
              aria-current={activeIndex === i ? 'true' : undefined}
            />
          ))}
        </nav>
      </div>
    </div>
    </div>
  );
};

export default HorizontalServices;