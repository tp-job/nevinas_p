import React, { useState } from 'react';
import styles from '@/styles/module/CodeWithClarity.module.css';

/**
 * CodeWithClarity — corrected to match interactive-v2.html #s-clarity
 *
 * Key fixes:
 * - Giant word changed from "Code With Clarity" → "Native" (blueprint: .cl-word = "Native")
 * - Top row restructured: LEFT = "Code/With/Clarity" headline, RIGHT = tagline description
 * - Removed "PHILOSOPHY" preheader (not in blueprint)
 * - Font size updated: clamp(5rem, 18vw, 17rem) — up from 8.5vw 11rem max
 * - Background: #ebe9e5 (not #f0eeeb)
 */

const columns = [
  {
    num: '(1)',
    text: (
      <>
        Uses <span className={styles.acc}>native scroll</span>, refined by a precision
        smoothing formula that keeps every frame deliberate.
      </>
    ),
  },
  {
    num: '(2)',
    text: 'Designed with a lightweight, modular architecture that lets you import only what you need.',
  },
  {
    num: '(3)',
    text: 'Configure behavior directly in your markup — no extra JavaScript required. Until you really need it.',
  },
  {
    num: '(4)',
    text: 'Built for core web animation, yet open to any prop or pattern your setup requires.',
  },
];

const CodeWithClarity: React.FC = () => {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <div className={styles.codeWithClarity}>

      {/* ── TOP HALF */}
      <div className={styles.topInner}>
        <div className={styles.topRow}>

          {/* LEFT — "Code / With / Clarity" section headline (auto width) */}
          <div className={styles.headline}>
            Code<br />
            With<br />
            Clarity
          </div>

          {/* RIGHT — tagline description (1fr) — no PHILOSOPHY label */}
          <div className={styles.taglineWrap}>
            <div className={styles.tagline}>
              Built to tune your experience,<br />
              not fight your DOM.
              <br /><br />
              <span style={{ fontFamily: 'var(--fj, "Noto Serif JP", serif)' }}>ネヴィナス</span>{' '}
              — Isekai 2026
            </div>
          </div>

        </div>

        {/* Giant word fills remaining height — blueprint: "Native" */}
        <div className={styles.word}>Native</div>
      </div>

      {/* ── BOTTOM HALF: 4 columns */}
      <div className={styles.cols}>
        {columns.map((col, idx) => {
          const isActive = hoveredCol === null ? idx === 0 : hoveredCol === idx;
          return (
            <div
              key={idx}
              className={styles.col}
              onMouseEnter={() => setHoveredCol(idx)}
              onMouseLeave={() => setHoveredCol(null)}
            >
              <div
                className={`${styles.num}${isActive ? ' text-matte-azure' : ''}`}
              >
                {col.num}
              </div>
              <div
                className={`${styles.colTxt}${isActive ? ' text-light-text dark:text-dark-text' : ''}`}
              >
                {col.text}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CodeWithClarity;