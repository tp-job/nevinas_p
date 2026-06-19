import React from 'react';
import styles from '@/styles/module/Nodemap.module.css';

/* ─────────────────────────────────────────────
   Types
 ───────────────────────────────────────────── */
interface SocialProofItem {
  type: 'stat' | 'quote' | 'cta';
  logo?: string;
  metric?: string;
  label?: string;
  quote?: string;
  attribution?: string;
  icon?: React.ReactNode;
}

/* ─────────────────────────────────────────────
   Sub-components
 ───────────────────────────────────────────── */
const HubIcon: React.FC = () => (
  <div className={styles.icon3dWrap} style={{ width: 60, height: 60 }}>
    <svg
      className={styles.icon3d}
      width="60" height="60" viewBox="0 0 60 60" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hub-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-text-secondary)" />
          <stop offset="100%" stopColor="var(--color-text-primary)" />
        </linearGradient>
        <linearGradient id="hub-fr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-border-primary)" />
          <stop offset="100%" stopColor="var(--color-bg-primary)" />
        </linearGradient>
      </defs>
      <rect x="20" y="2"  width="20" height="20" rx="5" fill="url(#hub-top)" />
      <rect x="20" y="38" width="20" height="20" rx="5" fill="url(#hub-top)" />
      <rect x="2"  y="20" width="20" height="20" rx="5" fill="url(#hub-top)" />
      <rect x="38" y="20" width="20" height="20" rx="5" fill="url(#hub-top)" />
      <rect x="20" y="20" width="20" height="20" rx="5" fill="url(#hub-fr)"  opacity=".5" />
      <rect x="20" y="19" width="20" height="3"  rx="1" fill="var(--color-border-subtle)" />
    </svg>
  </div>
);

const MiniHubIcon: React.FC = () => (
  <div className={styles.icon3dWrap} style={{ width: 18, height: 18 }}>
    <svg className={`${styles.icon3d} ${styles.icon3dSm}`} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="6"  y="0"  width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".6" />
      <rect x="6"  y="12" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".6" />
      <rect x="0"  y="6"  width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".6" />
      <rect x="12" y="6"  width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".6" />
      <rect x="6"  y="6"  width="6" height="6" rx="1.5" fill="var(--color-text-primary)" />
    </svg>
  </div>
);

const BarIcon: React.FC = () => (
  <div className={styles.icon3dWrap} style={{ width: 24, height: 24 }}>
    <svg className={`${styles.icon3d} ${styles.icon3dSm}`} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="bar-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-velvet-indigo)" />
          <stop offset="100%" stopColor="var(--color-matte-azure)" />
        </linearGradient>
      </defs>
      <rect x="0"  y="14" width="4" height="10" rx="1.5" fill="url(#bar-g)" />
      <rect x="5"  y="10" width="4" height="14" rx="1.5" fill="url(#bar-g)" />
      <rect x="10" y="6"  width="4" height="18" rx="1.5" fill="url(#bar-g)" />
      <rect x="15" y="10" width="4" height="14" rx="1.5" fill="url(#bar-g)" />
      <rect x="20" y="7"  width="4" height="17" rx="1.5" fill="url(#bar-g)" />
    </svg>
  </div>
);

const EyeIcon: React.FC = () => (
  <div className={styles.icon3dWrap} style={{ width: 24, height: 24 }}>
    <svg className={`${styles.icon3d} ${styles.icon3dSm}`} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="eye-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-matte-royal)" />
          <stop offset="100%" stopColor="var(--color-velvet-night)" />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="12" rx="11" ry="7"  fill="url(#eye-g)" />
      <ellipse cx="12" cy="14" rx="11" ry="4"  fill="var(--color-border-subtle)" />
      <circle  cx="12" cy="12" r="4"            fill="var(--color-text-primary)" opacity=".7" />
      <circle  cx="10" cy="10" r="1.5"          fill="var(--color-bg-primary)" opacity=".8" />
    </svg>
  </div>
);

const SignUpIcon: React.FC = () => (
  <div className={styles.icon3dWrap} style={{ width: 14, height: 14 }}>
    <svg className={`${styles.icon3d} ${styles.icon3dSm}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="0" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".7" />
      <rect x="4" y="8" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".7" />
      <rect x="0" y="4" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".7" />
      <rect x="8" y="4" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" opacity=".7" />
      <rect x="4" y="4" width="6" height="6" rx="1.5" fill="var(--color-text-primary)" />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────
   Pill Node
 ───────────────────────────────────────────── */
interface PillNodeProps {
  label: string;
  style?: React.CSSProperties;
}
const PillNode: React.FC<PillNodeProps> = ({ label, style }) => (
  <div style={style}>
    <span
      className={`${styles.pillGlass} inline-flex items-center h-7 px-3.5 rounded-full text-xs font-medium text-light-text dark:text-dark-text whitespace-nowrap`}
    >
      {label}
    </span>
  </div>
);

interface DotNodeProps { style?: React.CSSProperties; faded?: boolean; }
const DotNode: React.FC<DotNodeProps> = ({ style, faded }) => (
  <div style={style}>
    <span
      className={`inline-block w-[9px] h-[9px] rounded-full bg-light-text dark:bg-dark-text ${faded ? 'opacity-40' : 'opacity-100'}`}
    />
  </div>
);

/* ─────────────────────────────────────────────
   Main component
 ───────────────────────────────────────────── */
const NodeMap: React.FC = () => {
  return (
    <section
      id="nodemap"
      className={styles.nodemapBg}
      style={{
        position: 'relative',
        overflow: 'hidden',
        // Self-contained viewport cap: this section's combined content (node
        // canvas + CTA + social-proof grid + Sim-1 + Debug editorial) is much
        // taller than one screen. Capping height here and scrolling internally
        // (below) means the lower sections are reachable regardless of how the
        // parent slide wrapper treats this slide.
        height: '100svh',
        maxHeight: '100svh',
      }}
    >

      {/* Floating orb — stays fixed as ambient backdrop while content scrolls beneath it */}
      <div
        className={`${styles.orbFloat} absolute w-[400px] h-[400px] rounded-full top-1/2 left-1/2 pointer-events-none bg-[radial-gradient(circle,theme(--color-cool-pale/.15),transparent_70%)]`}
      />

      {/* Scrollable content — everything below scrolls inside the capped section */}
      <div
        className="h-full overflow-y-auto overscroll-contain"
        style={{
          position: 'relative',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-border-primary, rgba(255,255,255,0.3)) transparent',
        }}
      >

      <div style={{ padding: '7rem 4rem 5rem', position: 'relative' }}>

        {/* ── NODE MAP CANVAS ── */}
        <div style={{ position: 'relative', width: '100%', height: 300, maxWidth: 900, margin: '0 auto' }}>

          {/* SVG connectors */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            viewBox="0 0 900 300"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="40"  y1="92"  x2="860" y2="92"  className="stroke-light-border dark:stroke-dark-border" stroke="currentColor" strokeWidth="1" />
            <line x1="40"  y1="210" x2="860" y2="210" className="stroke-light-border dark:stroke-dark-border" stroke="currentColor" strokeWidth="1" />
            <path className={`${styles.lineDraw} stroke-matte-azure`}                    d="M450,118 C400,92 290,92 190,92"   stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className={`${styles.lineDraw} ${styles.lineD1} stroke-matte-azure`} d="M450,118 C510,92 630,92 695,92"   stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className={`${styles.lineDraw} ${styles.lineD2} stroke-matte-azure`} d="M450,182 C390,210 260,210 138,210" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className={`${styles.lineDraw} ${styles.lineD2} stroke-matte-azure`} d="M450,182 C400,210 270,210 198,210" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".5" />
            <path className={`${styles.lineDraw} ${styles.lineD3} stroke-matte-azure`} d="M450,182 C515,210 645,210 716,210" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className={`${styles.lineDraw} ${styles.lineD3} stroke-matte-azure`} d="M450,182 C530,210 700,210 790,210" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".5" />
            <circle cx="138" cy="210" r="4" className="fill-light-text dark:fill-dark-text" />
            <circle cx="695" cy="92"  r="4" className="fill-light-text dark:fill-dark-text" />
            <circle cx="790" cy="210" r="4" className="fill-light-text dark:fill-dark-text" />
            <circle cx="36"  cy="92"  r="4" className="fill-light-text dark:fill-dark-text" />
            <circle cx="843" cy="92"  r="4" className="fill-light-text dark:fill-dark-text" />
          </svg>

          {/* Top row nodes */}
          <DotNode style={{ position: 'absolute', top: 79, left: 22 }} />
          <PillNode label="Customer" style={{ position: 'absolute', top: 78, left: 155 }} />
          <DotNode  faded style={{ position: 'absolute', top: 79, left: 265 }} />
          <PillNode label="Code"     style={{ position: 'absolute', top: 78, left: 654 }} />
          <DotNode style={{ position: 'absolute', top: 79, right: 28 }} />

          {/* Bottom row nodes */}
          <PillNode label="Bug"    style={{ position: 'absolute', bottom: 72, left: 98 }} />
          <PillNode label="Issues" style={{ position: 'absolute', bottom: 72, left: 168 }} />
          <DotNode  faded style={{ position: 'absolute', bottom: 72, left: 276 }} />
          <DotNode  faded style={{ position: 'absolute', bottom: 72, left: 634 }} />
          <PillNode label="Ticket" style={{ position: 'absolute', bottom: 72, left: 686 }} />
          <PillNode label="Commit" style={{ position: 'absolute', bottom: 72, left: 760 }} />
          <PillNode label="PR"     style={{ position: 'absolute', bottom: 72, right: 18 }} />

          {/* Dot texts */}
          <div style={{ position: 'absolute', top: '50%', left: 18, transform: 'translateY(-50%)' }}>
            <div className={styles.dotText} data-text="FIX. LEARN.">FIX. LEARN.</div>
          </div>
          <div style={{ position: 'absolute', top: '50%', right: 18, transform: 'translateY(-50%)' }}>
            <div className={styles.dotText} data-text="PREVENT.">PREVENT.</div>
          </div>

          {/* HUB (neumorphic) */}
          <div
            className={styles.hubIdle}
            style={{ position: 'absolute', top: '50%', left: '50%' }}
          >
            <div
              className={styles.neu}
              style={{
                width: 128, height: 128,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 28,
              }}
            >
              <HubIcon />
            </div>
          </div>
        </div>

        {/* ── CTA BELOW MAP ── */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p className="text-[15px] font-normal leading-[1.8] text-haze dark:text-cool max-w-[360px] mx-auto mb-7">
            KYBR brings AI to a new era of hardware engineering beyond the production floor.
          </p>
          <a
            href="#"
            className={`${styles.shimmerHover} inline-flex items-center gap-2.5 text-[13px] font-medium py-3.5 px-8 rounded-full text-dark-text-primary no-underline shadow-md relative overflow-hidden`}
            style={{
              background: 'var(--color-button-primary-bg)',
            }}
          >
            <MiniHubIcon />
            Request a Demo
          </a>
        </div>
      </div>

      {/* ── SOCIAL PROOF BAR ── */}
      <div style={{ padding: '0 2.5rem 5rem' }}>
        <div
          className={styles.glass}
          style={{
            borderRadius: '1.5rem', padding: '2.5rem',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem',
          }}
        >
          {/* Stat 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <BarIcon />
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-light-text dark:text-dark-text">
                KEYDATA™
              </span>
            </div>
            <p className="text-[28px] font-light tracking-[-0.02em] text-light-text dark:text-dark-text mb-1">↑ 3.2×</p>
            <p className="text-xs font-medium text-haze dark:text-cool">Faster ticket resolution time</p>
          </div>

          {/* Quote */}
          <div>
            <p className="text-xl font-bold tracking-[-0.02em] text-light-text dark:text-dark-text mb-2.5">zuora</p>
            <p className="text-[13px] font-normal leading-[1.7] text-haze dark:text-cool">
              "We can now predict, with much higher confidence, how code changes might impact customers{' '}
              <em>before</em> deployment." — <em>Mu Yang, SVP</em>
            </p>
          </div>

          {/* Stat 2 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <EyeIcon />
              <span className="text-[13px] font-bold tracking-[0.04em] text-light-text dark:text-dark-text">cayuse</span>
            </div>
            <p className="text-[28px] font-light tracking-[-0.02em] text-light-text dark:text-dark-text mb-1">↓ 87%</p>
            <p className="text-xs font-medium text-haze dark:text-cool">Defects found before release</p>
          </div>

          {/* CTA card */}
          <div className={styles.neuInset} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p className="text-[13px] font-normal leading-[1.7] text-haze dark:text-cool">
              Connect your codebase. Our models fix, understand, and simulate across large codebases in any language.
            </p>
            <a
              href="#"
              className={`${styles.neuBtn} ${styles.shimmerHover} inline-flex items-center gap-2 text-xs font-semibold py-2.5 px-5 text-light-text dark:text-dark-text no-underline w-fit relative overflow-hidden`}
            >
              <SignUpIcon />
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* ── SIM-1 ── */}
      <div className="relative py-24 px-16 grid grid-cols-2 gap-12 items-center border-t border-midnight/10 dark:border-periwinkle/10">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-haze dark:text-cool mb-6">
            Introducing
          </p>
          <h2 className="text-[clamp(26px,4vw,50px)] font-light leading-[1.1] tracking-[-0.025em] text-light-text dark:text-dark-text">
            Sim-1<br />
            <span className="text-haze dark:text-cool">Our smartest models capable of</span><br />
            <em className="italic font-normal">simulating how code runs</em>
          </h2>
          <p className="text-[15px] font-normal leading-[1.8] text-haze dark:text-cool max-w-[300px] mt-8 mb-8">
            A new category of models built to understand and predict how large codebases behave in complex scenarios.
          </p>
          <a
            href="#"
            className={`${styles.neuBtn} ${styles.shimmerHover} inline-flex items-center gap-2.5 text-[13px] font-medium py-3.5 px-7 text-light-text dark:text-dark-text no-underline relative overflow-hidden`}
          >
            Read More
          </a>
        </div>
      </div>

      {/* ── DEBUG EDITORIAL ── */}
      <div className="py-20 px-16 pb-24 grid grid-cols-2 gap-16 items-end border-t border-midnight/10 dark:border-periwinkle/10">
        <h2 className="text-[clamp(30px,4.5vw,58px)] font-light leading-[1.08] tracking-[-0.03em] text-light-text dark:text-dark-text">
          Debug any problem down to<br />
          <span className="text-periwinkle-mid dark:text-haze-light">a line of code, and make sure</span><br />
          it never happens again
        </h2>
        <div className="border-l-2 border-light-border dark:border-dark-border pl-6">
          <p className="text-[15px] font-normal leading-[1.8] text-haze dark:text-cool mb-6">
            The first-of-its-kind agentic system that can understand and predict state in large distributed codebases.
          </p>
          <a
            href="#"
            className={`${styles.shimmerHover} inline-flex items-center gap-2 text-[13px] font-medium py-3.5 px-7 rounded-full text-dark-text-primary no-underline shadow-md relative overflow-hidden`}
            style={{
              background: 'var(--color-button-primary-bg)',
            }}
          >
            Get Started ↗
          </a>
        </div>
      </div>

      </div>

    </section>
  );
};

export default NodeMap;