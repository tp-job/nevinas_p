import React from 'react';
import { motion } from 'framer-motion';

import { Assets } from '@/data/homeData';

const chineseRoof = Assets.chineseRoof;
const waterfallValley = Assets.waterfallValley;
const shimenawa = Assets.shimenawa;

export const statements = [
  "I design.",
  "I develop.",
  "I think.",
  "And listen..."
];

/**
 * One gradient per statement, sourced from `--gradient-statement-*` custom
 * properties in index.css. Each property already swaps its light/dark value
 * via the existing `.dark` token-override block, so no `dark:` variant is
 * needed here.
 *
 * IMPORTANT: keep these as full literal strings, not a template literal
 * built from `index`. Tailwind's JIT scanner only picks up arbitrary-value
 * classes it can find verbatim in source — `bg-[image:var(--gradient-${x})]`
 * would silently produce no CSS.
 */
const STATEMENT_GRADIENT_CLASSES: Record<number, string> = {
  0: 'bg-[image:var(--gradient-statement-design)]',
  1: 'bg-[image:var(--gradient-statement-develop)]',
  2: 'bg-[image:var(--gradient-statement-think)]',
  3: 'bg-[image:var(--gradient-statement-listen)]',
};

export const StatementSlide: React.FC<{ index: number }> = ({ index }) => {
  const stmt = statements[index];
  if (!stmt) return null;

  const gradientClass = STATEMENT_GRADIENT_CLASSES[index] ?? STATEMENT_GRADIENT_CLASSES[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-[10vw] overflow-hidden bg-light-bg dark:bg-dark-bg">
      {/* Background Illusts */}
      {index === 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 z-0 pointer-events-none select-none mix-blend-lighten bg-left bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${chineseRoof})` }}
        />
      )}
      {index === 1 && (
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none mix-blend-lighten bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${waterfallValley})` }}
        />
      )}
      {index === 3 && (
        <div
          className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full max-w-[280px] h-[100px] z-0 pointer-events-none select-none bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${shimenawa})` }}
        />
      )}

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`${gradientClass} statement-gradient bg-clip-text text-transparent font-light leading-[0.95] tracking-[-0.04em]`}
          style={{
            fontSize: 'clamp(4.5rem, 13vw, 12rem)',
            fontFamily: 'var(--fd, "Inter", sans-serif)'
          }}
        >
          {stmt === "And listen..." ? (
            <>And<br />listen<span className="statement-accent">...</span></>
          ) : (
            stmt
          )}
        </div>
      </motion.div>
    </div>
  );
};