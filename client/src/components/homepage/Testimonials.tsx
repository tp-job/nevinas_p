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
    quote: "KYBR's craftsmanship is in a league of its own. The tactile precision of the OP-1 transformed our entire workflow — the kind of tool that makes you fall in love with the process again.",
    name: 'Yuki Tanaka',
    role: 'Lead Designer, Muji Studio Tokyo',
    initials: 'YT',
    source: '★',
  },
  {
    quote: "We evaluated dozens of controllers before choosing KYBR. The polymer keycap system and lock-in display are genuine innovations — not marketing language. It simply works, every time.",
    name: 'Sofia Marchetti',
    role: 'Director of Engineering, Braun Heritage',
    initials: 'SM',
    source: '⊕',
  },
  {
    quote: "From unboxing to first use, the attention to detail is extraordinary. Small magic moments — the weight, the click, the silence of a well-engineered mechanism. Truly iconic.",
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNav = (dir: -1 | 1) => {
    if (autoRef.current) clearInterval(autoRef.current);
    goTo(current + dir);
    autoRef.current = setInterval(() => goTo(current + 1), AUTO_INTERVAL_MS);
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" className={styles.testimonialsBg}>

      {/* Decorative blob */}
      <div
        className={styles.blob}
        style={{
          position: 'absolute', width: 500, height: 500,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle,rgba(255,255,255,.12),rgba(166,165,196,.08),transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative large quote mark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-2rem', left: '1.5rem',
          fontSize: 260, fontWeight: 700, lineHeight: 1,
          color: 'var(--color-shadow-sm)', pointerEvents: 'none', userSelect: 'none',
        }}
      >
        "
      </div>

      {/* ── HEADER ── */}
      <div style={{
        padding: '5rem 4rem 2.5rem',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem',
      }}>
        <h2 style={{
          fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300,
          lineHeight: 1.15, letterSpacing: '-.02em', color: 'var(--color-text-primary)',
        }}>
          Gather&apos;round —<br />client tales<br />incoming.
        </h2>
        <p style={{
          fontSize: 15, fontWeight: 400, lineHeight: 1.8,
          color: 'var(--color-text-secondary)', alignSelf: 'end',
        }}>
          Stories travel — about the ideas, the flow, the small magic moments
          that happen while building something together.
        </p>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 4rem', height: 1, background: 'var(--color-border-secondary)' }} />

      {/* ── STAGE ── */}
      <div style={{ padding: '2.5rem 4rem 2rem' }}>

        {/* Controls row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '2.5rem',
        }}>
          <button
            className={styles.neuBtn}
            style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '.16em',
              textTransform: 'uppercase', color: 'var(--color-text-secondary)', padding: '10px 20px',
            }}
            onClick={() => handleNav(-1)}
            aria-label="Previous testimonial"
          >
            PREV
          </button>

          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '.08em', color: 'var(--color-text-tertiary)' }}>
            {pad(current + 1)} / {pad(TESTIMONIALS.length)}
          </span>

          <button
            className={styles.neuBtn}
            style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '.16em',
              textTransform: 'uppercase', color: 'var(--color-text-secondary)', padding: '10px 20px',
            }}
            onClick={() => handleNav(1)}
            aria-label="Next testimonial"
          >
            NEXT
          </button>
        </div>

        {/* Quote body */}
        <div
          className={`${styles.testiBody}${isOut ? ` ${styles.testiBodyOut}` : ''}`}
          style={{ textAlign: 'center' }}
        >
          {/* Open quote */}
          <div style={{ fontSize: 48, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1, marginBottom: 10 }}>
            "
          </div>

          {/* Quote text */}
          <p style={{
            fontSize: 'clamp(17px,2.4vw,28px)', fontWeight: 300, fontStyle: 'italic',
            lineHeight: 1.55, letterSpacing: '-.01em', color: 'var(--color-text-primary)',
            maxWidth: 700, margin: '0 auto 10px',
          }}>
            {t.quote}
          </p>

          {/* Close quote (rotated) */}
          <div style={{
            fontSize: 48, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1,
            marginBottom: '2rem', transform: 'rotate(180deg)', display: 'inline-block',
          }}>
            "
          </div>

          {/* Author glass card */}
          <div
            className={styles.glassCard}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              borderRadius: 9999, padding: '10px 22px 10px 10px',
            }}
          >
            <div
              className={styles.neuCircle}
              style={{
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', flexShrink: 0,
              }}
            >
              {t.initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>{t.name}</p>
              <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)', marginTop: 1 }}>{t.role}</p>
            </div>
          </div>
        </div>

        {/* Source row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 12, marginTop: '2rem', paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border-secondary)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Source
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t.source}</span>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={styles.dotBtn}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                if (autoRef.current) clearInterval(autoRef.current);
                goTo(i);
                autoRef.current = setInterval(() => goTo(current + 1), AUTO_INTERVAL_MS);
              }}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === current ? 'var(--color-text-primary)' : 'var(--color-border-secondary)',
                transform: i === current ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 4rem', height: 1, background: 'var(--color-border-secondary)' }} />

      {/* ── TIME TO CONNECT ── */}
      <div
        id="connect"
        style={{ padding: '5rem 4rem', textAlign: 'center' }}
      >
        <h2 style={{
          fontSize: 'clamp(44px,7.5vw,108px)', fontWeight: 300,
          lineHeight: .95, letterSpacing: '-.04em', color: 'var(--color-text-primary)', marginBottom: 12,
        }}>
          Time to connect
        </h2>
        <p style={{ fontSize: 15, fontWeight: 400, color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
          Ready to build something extraordinary together?
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <a
            href="#"
            className={styles.shimmerHover}
            style={{
              fontSize: 13, fontWeight: 500, padding: '14px 36px',
              borderRadius: 9999, background: 'var(--color-text-primary)', color: 'var(--color-text-inverse)',
              textDecoration: 'none', boxShadow: '0 6px 24px var(--color-shadow-md)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            Get in Touch →
          </a>
          <a
            href="#"
            className={styles.neuBtn}
            style={{
              fontSize: 13, fontWeight: 500, padding: '14px 36px',
              color: 'var(--color-text-primary)', textDecoration: 'none', display: 'inline-block',
            }}
          >
            View All Work
          </a>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;