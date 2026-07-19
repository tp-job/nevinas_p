import React from 'react';
import { motion } from 'framer-motion';

export const statements: { en: string; jp: string }[] = [
  { en: 'I design.',      jp: 'デザインする' },
  { en: 'I develop.',     jp: '開発する' },
  { en: 'I think.',       jp: '考える' },
  { en: 'And listen...', jp: 'そして、聴く' },
];

export const StatementSlide: React.FC<{ index: number }> = ({ index }) => {
  const stmt = statements[index];
  if (!stmt) return null;

  const isLast = index === 3;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden">
      {/* LiquidEther mesh is now a single shared backdrop mounted in HomePage. */}

      <div className="absolute inset-0 z-1 pointer-events-none backdrop-blur-[1px] bg-gradient-to-b from-light-bg/25 via-transparent to-light-bg/45 dark:from-dark-bg/30 dark:via-transparent dark:to-dark-bg/55" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Eyebrow index ── */}
        <span className="text-xs font-medium tracking-[0.35em] uppercase text-haze-deep/60 dark:text-cool/50">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* ── Main statement ── */}
        <h2
          className="font-light leading-[0.92] tracking-[-0.04em] text-light-text dark:text-dark-text"
          style={{ fontSize: 'clamp(4.5rem, 13vw, 12rem)' }}
        >
          {isLast ? (
            <>
              And<br />
              listen<span className="text-haze dark:text-periwinkle">...</span>
            </>
          ) : (
            stmt.en
          )}
        </h2>

        {/* ── Japanese subtitle ── */}
        <p className="font-zen text-lg sm:text-xl font-light tracking-[0.12em] text-haze-deep dark:text-cool">
          {stmt.jp}
        </p>

        {/* ── Minimal divider ── */}
        <div className="w-8 h-px bg-haze/40 dark:bg-cool/30 mt-1" />
      </motion.div>
    </div>
  );
};
