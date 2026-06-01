import React, { useState } from 'react';
import styles from './CodeWithClarity.module.css';

const columns = [
  {
    num: '(1)',
    text: (
      <>
        Uses <span className="cl-acc">native scroll</span>, refined by a precision smoothing formula that keeps every frame deliberate.
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
      {/* ── TOP HALF ── */}
      <div className={styles.topInner}>
        <div className={styles.topRow}>
          {/* Description Block */}
          <div style={{ maxWidth: 280 }}>
            <div
              className="text-[0.58rem] tracking-[0.28em] uppercase flex items-center gap-[0.7rem] mb-6"
              style={{
                fontFamily: 'var(--fm)',
                color: 'var(--color-light-text-secondary, #64748b)',
              }}
            >
              <span
                className="block w-4 h-px opacity-50"
                style={{ background: 'currentColor' }}
              />
              PHILOSOPHY
              <span
                className="block w-4 h-px opacity-50"
                style={{ background: 'currentColor' }}
              />
            </div>
            <div
              className="text-[0.78rem] leading-[1.9] font-light"
              style={{
                fontFamily: 'var(--fm)',
                color: 'var(--color-light-text-secondary, #64748b)',
              }}
            >
              Built to tune your experience, not fight your DOM.
              <br />
              <br />
              <span style={{ fontFamily: 'var(--fj)' }}>ネヴィナス</span> —
              Isekai 2026
            </div>
          </div>

          {/* Big Word */}
          <div />
        </div>

        {/* Giant Word fills remaining space */}
        <div className={styles.word}>
          Code<span className="hidden sm:inline">&nbsp;</span>
          <br className="sm:hidden" />
          With
          <span className="hidden sm:inline">&nbsp;</span>
          <br className="sm:hidden" />
          Clarity
        </div>
      </div>

      {/* ── BOTTOM HALF: 4 columns ── */}
      <div className={styles.cols}>
        {columns.map((col, idx) => {
          const isActive =
            hoveredCol === null ? idx === 0 : hoveredCol === idx;
          return (
            <div
              key={idx}
              className={styles.col}
              onMouseEnter={() => setHoveredCol(idx)}
              onMouseLeave={() => setHoveredCol(null)}
            >
              <div
                className={styles.num}
                style={{
                  color: isActive
                    ? 'var(--color-matte-azure, #5983FC)'
                    : undefined,
                }}
              >
                {col.num}
              </div>
              <div
                className={styles.colTxt}
                style={{
                  color: isActive
                    ? 'var(--color-light-text-primary, #0f172a)'
                    : undefined,
                }}
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
