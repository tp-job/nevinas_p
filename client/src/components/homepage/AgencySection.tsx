import React from 'react';
import styles from '@/styles/module/AgencySection.module.css';
import { Assets } from '@/data/homeData';

const heroArt = Assets.heroArt;

/**
 * AgencySection — corrected to match interactive-v2.html #s-agency
 *
 * Key fixes:
 * - Removed max-w-[1400px] flex wrapper that broke the 5-row CSS grid
 * - Added proper nebula hero panel (heroImg + kanjiOverlay)
 * - Replaced static gradient with animated conic moodRing
 * - Fixed desc items to use monospace font (via CSS module)
 * - Fixed awards to flat-border style (no rounded card)
 * - Fixed ag-fun-tag gradient text
 * - Removed Tailwind classes that conflicted with CSS module grid
 */

const awards = [
  {
    title: 'Best Frontend Experience\nof the Year',
    year: '2026',
    src: 'AWWWARDS',
    logo: 'W.',
    logoStyle: undefined as React.CSSProperties | undefined,
  },
  {
    title: "'Developer of the Year'\nNominee",
    year: '2025',
    src: 'CSS DESIGN AWARDS',
    logo: '◈',
    logoStyle: undefined as React.CSSProperties | undefined,
  },
  {
    title: "'Studio of the Year'\nNominee",
    year: '2025',
    src: 'THE WEBBY AWARDS',
    logo: '彡',
    // blueprint: font-family var(--fj), font-weight 200
    logoStyle: { fontFamily: 'var(--fj, "Noto Serif JP", serif)', fontWeight: 200 } as React.CSSProperties,
  },
];

const AgencySection: React.FC = () => {
  return (
    /* Root element IS the 5-row grid — no wrapper divs */
    <div className={styles.agencySlide}>

      {/* ── ROW 1: Arrow (28%) + Nebula hero (72%) */}
      <div className={styles.top}>

        {/* Arrow column */}
        <div className={styles.arrow}>
          <svg viewBox="0 0 200 200" fill="none" className="stroke-light-text dark:stroke-dark-text">
            <path
              d="M20 20 L180 20 L180 180"
              stroke="currentColor"
              strokeWidth="26"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <path
              d="M20 20 L180 180"
              stroke="currentColor"
              strokeWidth="26"
              strokeLinecap="square"
            />
          </svg>
          <div className={styles.arrowKanji}>道楽者</div>
        </div>

        {/* Nebula hero panel */}
        <div className={styles.heroImg}>
          {/* Background layer image for premium brand identity */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none"
            style={{
              backgroundImage: `url(${heroArt})`,
              opacity: 0.35,
              mixBlendMode: 'color-dodge',
            }}
          />
          {/* Floating kanji overlay — parent has position:relative via heroImg */}
          <div className={styles.kanjiOverlay}>
            <span className={styles.kj} style={{ top: '22%', left: '12%', animationDelay: '0s' }}>異</span>
            <span className={styles.kj} style={{ top: '30%', left: '50%', animationDelay: '.9s' }}>世</span>
            <span className={styles.kj} style={{ top: '55%', left: '28%', animationDelay: '1.8s' }}>界</span>
            <span className={styles.kj} style={{ top: '20%', left: '78%', animationDelay: '2.7s' }}>者</span>
            <span className={`${styles.kj} ${styles.kjSmall}`} style={{ top: '62%', left: '68%', animationDelay: '3.6s' }}>夢</span>
          </div>
          <div className={styles.badge}>HUMAN-FIRST ✦</div>
        </div>
      </div>

      {/* ── ROW 2: Desc 3-col */}
      <div className={styles.desc}>
        <div className={styles.descItem}>
          Frontend-Led Engineering Portfolio<br />
          — Operating from{' '}
          <span className={styles.descAccent}>異世界</span> (Isekai).
        </div>
        <div className={styles.descItem}>
          Place where well-crafted web<br />
          experiences are born.
        </div>
        <div className={styles.descItem}>
          Building end-to-end web systems<br />
          where code meets culture.
        </div>
      </div>

      {/* ── ROW 3: Year */}
      <div className={styles.year}>©2024–2026</div>

      {/* ── ROW 4: Statement + Mood Ring */}
      <div className={styles.statement}>
        <div className={styles.statementLeft}>
          <div className={styles.statementTxt}>
            A{' '}
            {/* gradient orchid→flamingo italic "fun" */}
            <span className={styles.funTag}>
              fun<sup className={styles.supNum}>(5+)</sup>
            </span>{' '}
            frontend developer committed to{' '}
            {/* eye icon inline */}
            <span className={styles.icoInline}>
              <svg
                width="0.72em"
                height="0.72em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            exceptional design and the highest{' '}
            {/* spinning gear icon */}
            <span className={styles.icoInline}>
              <svg
                className={styles.spinGear}
                width="0.65em"
                height="0.65em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
              </svg>
            </span>
            development standards.
            <span className={styles.downArr}>↓</span>
          </div>

          <button className={styles.cta} type="button">
            Get in touch <span className={styles.ctaArr}>→</span>
          </button>
        </div>

        {/* Mood ring — animated conic gradient */}
        <div className={styles.statementRight}>
          <div className={styles.moodRing} />
          <div className={styles.moodLabel}>異世界 / ISEKAI</div>
        </div>
      </div>

      {/* ── ROW 5: Awards — flat border style, no rounded cards */}
      <div className={styles.awards}>
        {awards.map((award, i) => (
          <div key={i} className={styles.award}>
            {/* top: title + year */}
            <div>
              <div className={styles.awardTitle}>
                {award.title.split('\n').map((line, j, arr) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.awardYear}>{award.year}</div>
            </div>
            {/* bottom: source label */}
            <div className={styles.awardSrc}>{award.src}</div>
            {/* absolute logo glyph */}
            <div className={styles.awardLogo} style={award.logoStyle}>
              {award.logo}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AgencySection;