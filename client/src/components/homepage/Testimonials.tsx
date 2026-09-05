import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '@/styles/module/Testimonials.module.css';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  source: string;
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The site's UX was exceptional, easy, and intuitive to navigate. The backend system also worked flawlessly. Overall, we have received a lot of compliments.",
    name: 'Daniel Reynolds',
    role: 'Executive Producer, Kaleida',
    initials: 'DR',
    source: '©',
  },
  {
    quote: "Nevinas' craftsmanship is in a league of its own. Every animation and interaction felt deliberate — the kind of frontend work that makes you fall in love with the web again.",
    name: 'Yuki Tanaka',
    role: 'Lead Designer, Muji Studio Tokyo',
    initials: 'YT',
    source: '★',
  },
  {
    quote: "We reviewed dozens of portfolios before this collaboration. The clean architecture and attention to performance are genuine strengths — not marketing language. It simply works, every time.",
    name: 'Sofia Marchetti',
    role: 'Director of Engineering, Braun Heritage',
    initials: 'SM',
    source: '⊕',
  },
  {
    quote: "From the first prototype to launch, the attention to detail was extraordinary. Small magic moments — the motion, the typography, the quiet precision of a well-engineered interface.",
    name: 'Marcus Okonkwo',
    role: 'Creative Director, Colour & Form',
    initials: 'MO',
    source: '◈',
  },
];

const AUTO_INTERVAL_MS = 7000;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Testimonials: React.FC = () => {
  const [current, setCurrent]   = useState<number>(0);
  const [isOut,   setIsOut]     = useState<boolean>(false);
  const autoRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setIsOut(true);
    setTimeout(() => {
      setCurrent(((idx % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
      setIsOut(false);
    }, 380);
  }, []);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => goTo(current + 1), AUTO_INTERVAL_MS);
  }, [current, goTo]);

  /* Start/restart auto-play whenever current changes */
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setCurrent(prev => {
        setIsOut(true);
        setTimeout(() => {
          setCurrent((prev + 1) % TESTIMONIALS.length);
          setIsOut(false);
        }, 380);
        return prev; // will be overwritten in timeout
      });
    }, AUTO_INTERVAL_MS);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  const handleNav = (dir: -1 | 1) => {
    goTo(current + dir);
    resetAuto();
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" className={styles.testimonialsBg}>

      {/* Decorative blob */}
      <div
        className={`${styles.blob} absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-[radial-gradient(circle,theme(--color-light-surface/.12),theme(--color-sub-cool/.08),transparent)]`}
      />

      {/* Decorative large quote mark */}
      <div
        aria-hidden="true"
        className="absolute -top-8 left-6 text-[260px] font-medium leading-none text-shadow-sm pointer-events-none select-none"
      >
        "
      </div>

      {/* ── HEADER ── */}
      {/* Was grid-cols-2 + px-16 unconditionally: ~91 px per column on a phone,
          which broke the headline into one word per line. */}
      <div className="py-14 px-5 pb-8 sm:px-10 md:py-20 md:px-16 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
        <h2 className="text-[clamp(26px,6.5vw,50px)] font-light leading-[1.15] tracking-[-0.02em] text-light-text dark:text-dark-text text-pretty">
          Gather&apos;round —<br className="hidden md:inline" />{' '}
          client tales<br className="hidden md:inline" />{' '}
          incoming.
        </h2>
        <p className="text-[15px] font-normal leading-[1.8] text-haze dark:text-cool self-end">
          Stories travel — about the ideas, the flow, the small magic moments
          that happen while building something together.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 sm:mx-10 md:mx-16 h-px bg-cool-pale dark:bg-haze-deep" />

      {/* ── STAGE ── */}
      <div className="py-8 px-5 pb-6 sm:px-10 md:py-10 md:px-16 md:pb-8">

        {/* Controls row */}
        <div className="flex items-center justify-between mb-10">
          <button
            className={`${styles.neuBtn} text-xs font-medium tracking-[0.16em] uppercase text-haze dark:text-cool py-2.5 px-5`}
            onClick={() => handleNav(-1)}
            aria-label="Previous testimonial"
          >
            PREV
          </button>

          <span className="text-[13px] font-medium tracking-[0.08em] text-cool dark:text-haze-light">
            {pad(current + 1)} / {pad(TESTIMONIALS.length)}
          </span>

          <button
            className={`${styles.neuBtn} text-xs font-medium tracking-[0.16em] uppercase text-haze dark:text-cool py-2.5 px-5`}
            onClick={() => handleNav(1)}
            aria-label="Next testimonial"
          >
            NEXT
          </button>
        </div>

        {/* Quote body */}
        <div
          className={`${styles.testiBody}${isOut ? ` ${styles.testiBodyOut}` : ''} text-center`}
        >
          {/* Open quote */}
          <div className="text-5xl font-light text-haze dark:text-cool leading-none mb-2.5">
            "
          </div>

          {/* Quote text */}
          <p className="text-[clamp(17px,2.4vw,28px)] font-light italic leading-[1.55] tracking-[-0.01em] text-light-text dark:text-dark-text max-w-[700px] mx-auto mb-2.5">
            {t.quote}
          </p>

          {/* Close quote (rotated) */}
          <div className="text-5xl font-light text-haze dark:text-cool leading-none mb-8 rotate-180 inline-block">
            "
          </div>

          {/* Author glass card */}
          <div
            className={`${styles.glassCard} inline-flex items-center gap-3.5 rounded-full py-2.5 pl-2.5 pr-5.5`}
          >
            <div
              className={`${styles.neuCircle} w-11 h-11 flex items-center justify-center text-[13px] font-medium text-light-text dark:text-dark-text shrink-0`}
            >
              {t.initials}
            </div>
            <div className="text-left">
              <p className="text-[15px] font-medium text-light-text dark:text-dark-text">{t.name}</p>
              <p className="text-[13px] font-normal text-haze dark:text-cool mt-px">{t.role}</p>
            </div>
          </div>
        </div>

        {/* Source row */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-cool-pale dark:border-haze-deep">
          <span className="text-[10px] font-medium tracking-[0.16em] uppercase text-cool dark:text-haze-light">
            Source
          </span>
          <span className="text-[22px] font-medium text-haze dark:text-cool">{t.source}</span>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dotBtn} w-2 h-2 rounded-full ${i === current ? 'bg-light-text dark:bg-dark-text scale-[1.4]' : 'bg-cool-pale dark:bg-haze-deep scale-100'}`}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                goTo(i);
                resetAuto();
              }}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 sm:mx-10 md:mx-16 h-px bg-cool-pale dark:bg-haze-deep" />

      {/* ── TIME TO CONNECT ── */}
      <div
        id="connect"
        className="py-14 px-5 sm:px-10 md:py-20 md:px-16 text-center"
      >
        <h2 className="text-[clamp(44px,7.5vw,108px)] font-light leading-[0.95] tracking-[-0.04em] text-light-text dark:text-dark-text mb-3">
          Time to connect
        </h2>
        <p className="text-[15px] font-normal text-haze dark:text-cool mb-10">
          Ready to build something extraordinary together?
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`${styles.shimmerHover} text-[13px] font-medium py-3.5 px-9 rounded-full bg-light-text dark:bg-dark-text text-dark-text-primary dark:text-midnight no-underline shadow-md relative overflow-hidden`}
          >
            Get in Touch →
          </a>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`${styles.neuBtn} text-[13px] font-medium py-3.5 px-9 text-light-text dark:text-dark-text no-underline inline-block`}
          >
            View All Work
          </a>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;
