import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/module/TimelineScattered.module.css';

/**
 * TimelineScattered — corrected to match interactive-v2.html #s-tl
 *
 * CRITICAL FIXES vs original TSX:
 * ─────────────────────────────────────────────────────────────────
 * [C1] feat-num: text-[0.65rem] font-bold → clamp(3rem,6vw,5.5rem) weight 200
 *      Numbers are HUGE display figures, not tiny labels
 *
 * [C2] feat-title: text-2xl sm:text-3xl → clamp(1rem,2.2vw,1.55rem)
 *      Title is moderate, NOT oversized
 *
 * [C3] feat-sub: text-sm (default sans) → DM Mono clamp(.58rem,1vw,.72rem)
 *      Body text uses monospace font at tiny size
 *
 * [C4] feat-arr: text-xl → .58rem rgba(20,18,16,.3)
 *      Arrow is tiny muted label, NOT large
 *
 * [C5] SVG icons: replaced CSS-div approximations with exact blueprint SVGs
 *      - feat 1: crosshair
 *      - feat 2: half-filled circle
 *      - feat 3: 3×3 dot grid (diagonal azure accent)
 *      - feat 4: 3 overlapping circles
 *
 * [C6] Positions: (10%/8%) → exact blueprint (13%/5% top, 11%/5% bottom)
 *
 * [C7] tl-label: top-1/2 center → bottom:5% center (blueprint: .tl-label)
 *
 * [C8] Container: py-20 px-4→20 removed → padding:0 (blueprint: #s-tl)
 *
 * [C9] Removed joystick.png + integrationStatus.png — not in blueprint
 */

/* ── Framer Motion variants — match blueprint translateY(22px) reveal */
const featVariants = {
  hidden: (dir: { x: number; y: number }) => ({
    opacity: 0,
    x: dir.x,
    y: dir.y,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const labelVariant = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.9 } },
};

/* ── SVG Icons — exact from blueprint HTML */
const IconCrosshair = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="10" stroke="var(--color-text-primary)" strokeWidth="1" />
    <circle cx="16" cy="16" r="3"  fill="var(--color-text-primary)" />
    <line x1="16" y1="2"  x2="16" y2="8"  stroke="var(--color-text-primary)" strokeWidth="1" />
    <line x1="16" y1="24" x2="16" y2="30" stroke="var(--color-text-primary)" strokeWidth="1" />
    <line x1="2"  y1="16" x2="8"  y2="16" stroke="var(--color-text-primary)" strokeWidth="1" />
    <line x1="24" y1="16" x2="30" y2="16" stroke="var(--color-text-primary)" strokeWidth="1" />
  </svg>
);

const IconHalfCircle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" stroke="var(--color-text-primary)" strokeWidth="1" />
    <path   d="M14 2 A12 12 0 0 1 14 26 Z" fill="var(--color-text-primary)" />
    <circle cx="14" cy="14" r="3" fill="var(--color-bg-primary)" />
  </svg>
);

const IconDotGrid = () => (
  /* diagonal azure accent — matches blueprint exactly */
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="2"  y="2"  width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
    <rect x="10" y="2"  width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="18" y="2"  width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="2"  y="10" width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="10" y="10" width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
    <rect x="18" y="10" width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="2"  y="18" width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="10" y="18" width="6" height="6" rx="1" fill="var(--color-text-primary)" />
    <rect x="18" y="18" width="6" height="6" rx="1" fill="var(--color-matte-azure)" />
  </svg>
);

const IconRings = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="13" cy="13" r="9" stroke="var(--color-text-primary)" strokeWidth="2" />
    <circle cx="23" cy="13" r="9" stroke="var(--color-matte-azure)" strokeWidth="2" />
    <circle cx="13" cy="22" r="9" stroke="var(--color-matte-azure)" strokeWidth="2" fill="none" />
  </svg>
);

/* ── Data */
const mobileItems = [
  {
    num: '1', title: 'I craft with\nintention.', align: 'left' as const,
    sub: 'Frontend development with HTML, CSS, JS — building interfaces that feel as good as they look.',
  },
  {
    num: '2', title: 'I think\nlong term.', align: 'right' as const,
    sub: 'Building scalable systems and learning continuously to create products that redefine the future.',
  },
  {
    num: '3', title: 'Performance\nOriented.', align: 'left' as const,
    sub: 'Fast as a cut. Light as breath. Low memory, zero layout shifts, native-friendly.',
  },
  {
    num: '4', title: 'I reach\nfor more.', align: 'right' as const,
    sub: 'Becoming a developer who teaches, builds impactful systems, and pushes UI/UX boundaries.',
  },
];

/* ── Component */
const TimelineScattered: React.FC = () => {
  return (
    /* blueprint: #s-tl — padding:0, position:relative, full viewport height */
    <div className={styles.slide}>

      {/* ── FEAT 1: Top-Left — crosshair icon */}
      <motion.div
        className={`${styles.feat} ${styles.featTl}`}
        custom={{ x: -30, y: -22 }}
        variants={featVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {/* feat-arr: tiny muted arrow — NOT text-xl */}
        <span className={styles.featArr}>→</span>

        {/* feat-ico: crosshair SVG */}
        <div className={styles.featIco}>
          <IconCrosshair />
        </div>

        {/* feat-num: HUGE display figure clamp(3rem,6vw,5.5rem) weight 200 */}
        <div className={styles.featNum}>1</div>

        {/* feat-title: clamp(1rem,2.2vw,1.55rem) weight 300 */}
        <div className={styles.featTitle}>
          I craft with<br />intention.
        </div>

        {/* feat-lead */}
        <div className={styles.featLead}>
          No learning curve.<br />Just a signal.
        </div>

        {/* feat-sub: DM Mono clamp(.58rem,1vw,.72rem) */}
        <div className={styles.featSub}>
          Frontend development with HTML, CSS, JS — building interfaces that feel as good as they look.
        </div>
      </motion.div>

      {/* ── FEAT 2: Top-Right — half-circle icon */}
      <motion.div
        className={`${styles.feat} ${styles.featTr}`}
        custom={{ x: 30, y: -22 }}
        variants={featVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
      >
        {/* right-aligned arrow */}
        <span className={`${styles.featArr} ${styles.featArrRight}`}>→</span>

        {/* icon right-aligned */}
        <div className={`${styles.featIco} ${styles.featIcoRight}`}>
          <IconHalfCircle />
        </div>

        <div className={styles.featNum}>2</div>

        <div className={styles.featTitle}>
          I think<br />long term.
        </div>

        <div className={styles.featLead}>
          Every piece stands<br />alone — or flows as one.
        </div>

        {/* sub text pushed to right via margin-left:auto */}
        <div className={`${styles.featSub} ${styles.featSubRight}`}>
          Building scalable systems and learning continuously to create products that redefine the future.
        </div>
      </motion.div>

      {/* ── FEAT 3: Bottom-Left — dot grid icon */}
      <motion.div
        className={`${styles.feat} ${styles.featBl}`}
        custom={{ x: -30, y: 22 }}
        variants={featVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <span className={styles.featArr}>→</span>

        <div className={styles.featIco}>
          <IconDotGrid />
        </div>

        <div className={styles.featNum}>3</div>

        <div className={styles.featTitle}>
          Performance<br />Oriented.
        </div>

        {/* blueprint inline override: font-size:.75rem; color:secondary */}
        <div className={`${styles.featLead} ${styles.featLeadMuted}`}>
          ~60FPS~
        </div>

        <div className={styles.featSub}>
          Fast as a cut. Light as breath. Low memory, zero layout shifts, native-friendly.
        </div>
      </motion.div>

      {/* ── FEAT 4: Bottom-Right — overlapping rings icon */}
      <motion.div
        className={`${styles.feat} ${styles.featBr}`}
        custom={{ x: 30, y: 22 }}
        variants={featVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.55 }}
      >
        <span className={`${styles.featArr} ${styles.featArrRight}`}>→</span>

        <div className={`${styles.featIco} ${styles.featIcoRight}`}>
          <IconRings />
        </div>

        <div className={styles.featNum}>4</div>

        <div className={styles.featTitle}>
          I reach<br />for more.
        </div>

        <div className={styles.featLead}>
          Craft only what<br />you need.
        </div>

        <div className={`${styles.featSub} ${styles.featSubRight}`}>
          Becoming a developer who teaches, builds impactful systems, and pushes UI/UX boundaries.
        </div>
      </motion.div>

      {/* ── CENTER LABEL — blueprint: bottom:5% NOT top-1/2 */}
      <motion.div
        className={styles.tlLabel}
        variants={labelVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        WebGL · Real-time render · Gyroscope
      </motion.div>

      {/* ── MOBILE STACK VIEW (md:hidden) */}
      <div className={styles.mobileStack}>
        {mobileItems.map((item, i) => (
          <motion.div
            key={i}
            className={
              item.align === 'right'
                ? `${styles.mobileItem} ${styles.mobileItemRight}`
                : styles.mobileItem
            }
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className={styles.mobileNum}>{item.num}</div>
            <div className={styles.mobileTitle}>
              {item.title.split('\n').map((line, j, arr) => (
                <React.Fragment key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div className={styles.mobileSub}>{item.sub}</div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default TimelineScattered;