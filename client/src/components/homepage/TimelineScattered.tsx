'use client';

/**
 * TimelineScattered.tsx — v2.1 · Nocturnal Atelier Design System v3.2
 *
 * FIXES vs v2.0 (the broken version)
 * ──────────────────────────────────────────────────────────────────
 * [BUG-1] LAYOUT MISMATCH: v2 introduced CSS Grid wrapper classes
 *         (`featWrapper`, `fw_tl/tr/bl/br`) that never existed in the
 *         CSS module — all 4 blocks collapsed to origin (top-left 0,0)
 *         and stacked visibly. FIX: removed the outer wrapper `motion.div`;
 *         mouse-parallax `style={{ x, y }}` is applied directly to
 *         `motion.article` which is already `position: absolute` via
 *         `.feat` + `.featTl/Tr/Bl/Br`. Framer Motion's transform sits
 *         on top of CSS absolute placement — correct and composited.
 *
 * [BUG-2] MISSING CLASSES: `styles.decor`, `styles.axisH/V`,
 *         `styles.corner*`, `styles.hoverLine`, `styles.featRight`
 *         referenced in JSX but absent from CSS module → undefined →
 *         className="undefined" → broken styling. FIX: all classes added
 *         to the updated CSS module (TimelineScattered.module.css v2.1).
 *
 * [BUG-3] ARROW + ICON ALIGNMENT: right-side blocks (tr, br) need
 *         `featArrRight` and `featIcoRight` modifiers; v2 dropped them
 *         because they lived in the now-removed wrapper. FIX: re-applied.
 *
 * PRESERVED from v2
 * ──────────────────────────────────────────────────────────────────
 * [F2] Mouse parallax — useMotionValue / useSpring / useTransform
 * [F3] Entry animation — opacity + y + blur, design-system easing
 * [F4] Hover — whileHover y:−4, duration ≤ 0.28s
 * [F5] Design-system tokens on SVG icons
 * [F6] "01"–"04" two-digit format
 * [F7] Decorative axis lines + corner L-marks
 * [F8] Center label — letter-spacing expansion animation
 * [F9] Semantic article / role="list"
 */

import React, { useRef, useCallback } from 'react';
import type { MotionValue } from 'framer-motion';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import styles from '@/styles/module/TimelineScattered.module.css';

/* ─────────────────────────────────────────────────
   SPRING CONFIG
   Low stiffness → laggy = depth feel.
   Never go above stiffness:90.
───────────────────────────────────────────────── */
const SPRING_CFG = { stiffness: 72, damping: 24, mass: 0.55 };

/* ─────────────────────────────────────────────────
   ANIMATION VARIANTS
   Design system: ease [0.22,1,0.36,1] · duration 0.65s
   Entry: opacity + y + blur (all compositor props)
───────────────────────────────────────────────── */
const entryVariants = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(7px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
};

/* Letter-spacing expansion on the center label */
const labelVariants = {
  hidden:  { opacity: 0, letterSpacing: '0.06em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.22em',
    transition: {
      duration: 0.85,
      delay: 1.05,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ─────────────────────────────────────────────────
   SVG ICONS
   Design system v3.2:
   - currentColor from --color-text-primary (themed)
   - --c-periwinkle (#C8CDEB) for accent rects / secondary ring
   - --c-cool (#878CB4) for tertiary ring (IconRings)
   - aria-hidden="true" on all decorative SVGs
───────────────────────────────────────────────── */
const IconCrosshair = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    <circle cx="16" cy="16" r="3" fill="currentColor" />
    <line x1="16" y1="2"  x2="16" y2="8"  stroke="currentColor" strokeWidth="1" />
    <line x1="16" y1="24" x2="16" y2="30" stroke="currentColor" strokeWidth="1" />
    <line x1="2"  y1="16" x2="8"  y2="16" stroke="currentColor" strokeWidth="1" />
    <line x1="24" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const IconHalfCircle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    {/* Right half filled */}
    <path d="M14 2 A12 12 0 0 1 14 26 Z" fill="currentColor" fillOpacity="0.82" />
    {/* Punch-through dot using scoped bg var */}
    <circle cx="14" cy="14" r="3" fill="var(--tl-slide-bg)" />
  </svg>
);

const IconDotGrid = () => (
  /* 3×3 grid — diagonal (TL, C, BR) uses periwinkle accent per design system */
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="2"  y="2"  width="6" height="6" rx="1" fill="var(--c-periwinkle, #C8CDEB)" />
    <rect x="10" y="2"  width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="18" y="2"  width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="2"  y="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="10" y="10" width="6" height="6" rx="1" fill="var(--c-periwinkle, #C8CDEB)" />
    <rect x="18" y="10" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="2"  y="18" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="10" y="18" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.62" />
    <rect x="18" y="18" width="6" height="6" rx="1" fill="var(--c-periwinkle, #C8CDEB)" />
  </svg>
);

const IconRings = () => (
  /* 3 overlapping circles — periwinkle + cool per design system */
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="9" stroke="currentColor"                  strokeWidth="1.5" strokeOpacity="0.62" />
    <circle cx="23" cy="13" r="9" stroke="var(--c-periwinkle, #C8CDEB)" strokeWidth="1.5" strokeOpacity="0.82" />
    <circle cx="13" cy="22" r="9" stroke="var(--c-cool,       #878CB4)" strokeWidth="1.5" strokeOpacity="0.48" fill="none" />
  </svg>
);

/* ─────────────────────────────────────────────────
   FEATURE DATA
   delay: 0.09s stagger per design system spec
───────────────────────────────────────────────── */
type FeatId = 'tl' | 'tr' | 'bl' | 'br';

interface Feature {
  id:         FeatId;
  num:        string;
  icon:       React.ReactNode;
  title:      React.ReactNode;
  lead:       React.ReactNode;
  leadMuted?: boolean;
  sub:        string;
  delay:      number;
}

const FEATURES: Feature[] = [
  {
    id: 'tl',
    num: '01',
    icon: <IconCrosshair />,
    title: <>I craft with<br />intention.</>,
    lead:  <>No learning curve.<br />Just a signal.</>,
    sub:   'Frontend development with HTML, CSS, JS — building interfaces that feel as good as they look.',
    delay: 0,
  },
  {
    id: 'tr',
    num: '02',
    icon: <IconHalfCircle />,
    title: <>I think<br />long term.</>,
    lead:  <>Every piece stands<br />alone — or flows as one.</>,
    sub:   'Building scalable systems and learning continuously to create products that redefine the future.',
    delay: 0.09,
  },
  {
    id: 'bl',
    num: '03',
    icon: <IconDotGrid />,
    title: <>Performance<br />Oriented.</>,
    lead:  '~60FPS~',
    leadMuted: true,
    sub:   'Fast as a cut. Light as breath. Low memory, zero layout shifts, native-friendly.',
    delay: 0.18,
  },
  {
    id: 'br',
    num: '04',
    icon: <IconRings />,
    title: <>I reach<br />for more.</>,
    lead:  <>Craft only what<br />you need.</>,
    sub:   'Becoming a developer who teaches, builds impactful systems, and pushes UI/UX boundaries.',
    delay: 0.27,
  },
];

/* ─────────────────────────────────────────────────
   POSITION CLASS MAP
   Maps feat.id → the absolute-position CSS class.
   This is the correct contract with the CSS module —
   NO featWrapper / fw_* grid classes needed.
───────────────────────────────────────────────── */
const POS_CLASS: Record<FeatId, string> = {
  tl: styles.featTl,
  tr: styles.featTr,
  bl: styles.featBl,
  br: styles.featBr,
};

/* ─────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────── */
const TimelineScattered: React.FC = () => {
  const containerRef   = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  /* ── Raw mouse MotionValues (normalized –1 → +1) */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* ── Spring smoothing — lag creates depth perception */
  const springX = useSpring(rawX, SPRING_CFG);
  const springY = useSpring(rawY, SPRING_CFG);

  /*
   * Per-quadrant parallax transforms.
   * Counter-directional: opposing corners move in opposite directions
   * relative to mouse — subtle z-axis tilt illusion.
   * All hooks called unconditionally (rules of hooks).
   * D=0 when prefers-reduced-motion → no movement.
   */
  const D = prefersReduced ? 0 : 1;

  const tlX = useTransform(springX, (v) => v * -14 * D);
  const tlY = useTransform(springY, (v) => v * -10 * D);
  const trX = useTransform(springX, (v) => v *  14 * D);
  const trY = useTransform(springY, (v) => v * -10 * D);
  const blX = useTransform(springX, (v) => v * -11 * D);
  const blY = useTransform(springY, (v) => v *  13 * D);
  const brX = useTransform(springX, (v) => v *  11 * D);
  const brY = useTransform(springY, (v) => v *  13 * D);

  /* Map id → MotionValues */
  const pxMap: Record<FeatId, { x: MotionValue<number>; y: MotionValue<number> }> = {
    tl: { x: tlX, y: tlY },
    tr: { x: trX, y: trY },
    bl: { x: blX, y: blY },
    br: { x: brX, y: brY },
  };

  /* ── Mouse handlers */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const el = containerRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      rawX.set(((e.clientX - left) / width)  * 2 - 1);
      rawY.set(((e.clientY - top)  / height) * 2 - 1);
    },
    [prefersReduced, rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className={styles.slide}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* ─── Decorative layer — axis lines + corner L-marks (aria-hidden) ─── */}
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.axisH} />
        <span className={styles.axisV} />
        <span className={`${styles.corner} ${styles.cornerTl}`} />
        <span className={`${styles.corner} ${styles.cornerTr}`} />
        <span className={`${styles.corner} ${styles.cornerBl}`} />
        <span className={`${styles.corner} ${styles.cornerBr}`} />
      </div>

      {/* ─── Feature Blocks ─────────────────────────────────────────────────
       *
       *  FIX [BUG-1]: Single motion.article — no outer featWrapper div.
       *
       *  The element is `position: absolute` via `.feat` + `.featTl/Tr/Bl/Br`.
       *  `style={{ x, y }}` adds a GPU-composited transform ON TOP of the CSS
       *  absolute placement — this is the correct pattern for parallax on
       *  absolutely-positioned elements with Framer Motion.
       *
       ──────────────────────────────────────────────────────────────────── */}
      {FEATURES.map((feat) => {
        const isRight = feat.id === 'tr' || feat.id === 'br';
        const { x, y } = pxMap[feat.id];

        return (
          <motion.article
            key={feat.id}
            className={[
              styles.feat,
              POS_CLASS[feat.id],
              isRight ? styles.featRight : '',
            ].filter(Boolean).join(' ')}
            style={{ x, y }}
            variants={entryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-6%' }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
              delay: feat.delay,
              filter: { duration: 0.5, ease: 'easeOut' },
            }}
            whileHover={
              prefersReduced
                ? undefined
                : { y: -4, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0 } }
            }
          >
            {/* Arrow — CSS translateX transition on hover */}
            <span
              className={[styles.featArr, isRight ? styles.featArrRight : ''].filter(Boolean).join(' ')}
              aria-hidden="true"
            >
              →
            </span>

            {/* Icon */}
            <div className={[styles.featIco, isRight ? styles.featIcoRight : ''].filter(Boolean).join(' ')}>
              {feat.icon}
            </div>

            {/* Number — large display figure, weight 200 */}
            <div className={styles.featNum} aria-hidden="true">{feat.num}</div>

            {/* Title */}
            <h3 className={styles.featTitle}>{feat.title}</h3>

            {/* Lead / tagline */}
            <p className={[styles.featLead, feat.leadMuted ? styles.featLeadMuted : ''].filter(Boolean).join(' ')}>
              {feat.lead}
            </p>

            {/* Body text — DM Mono */}
            <p className={[styles.featSub, isRight ? styles.featSubRight : ''].filter(Boolean).join(' ')}>
              {feat.sub}
            </p>

            {/* Hover accent line — width 0 → 100% via CSS on :hover */}
            <span className={styles.hoverLine} aria-hidden="true" />
          </motion.article>
        );
      })}

      {/* ─── Center label ───────────────────────────────────────────────── */}
      <motion.p
        className={styles.tlLabel}
        variants={labelVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        aria-label="Technologies: WebGL, Real-time render, Gyroscope"
      >
        WebGL · Real-time render · Gyroscope
      </motion.p>

      {/* ─── Mobile stack (shown below 768px via CSS) ───────────────────── */}
      <div className={styles.mobileStack} role="list">
        {FEATURES.map((feat, i) => {
          const isRight = feat.id === 'tr' || feat.id === 'br';
          return (
            <motion.div
              key={feat.id}
              role="listitem"
              className={[
                styles.mobileItem,
                isRight ? styles.mobileItemRight : '',
              ].filter(Boolean).join(' ')}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className={styles.mobileNum}   aria-hidden="true">{feat.num}</div>
              <div className={styles.mobileTitle}>{feat.title}</div>
              <div className={styles.mobileSub}>{feat.sub}</div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default TimelineScattered;