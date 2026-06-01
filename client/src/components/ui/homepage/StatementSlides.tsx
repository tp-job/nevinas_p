import React from 'react';
import { motion } from 'framer-motion';

import chineseRoof from '@/assets/image/noubackground/chinese-roof.png';
import waterfallValley from '@/assets/image/noubackground/waterfall-valley.png';
import shimenawa from '@/assets/image/noubackground/shimenawa.png';

export const statements = [
  "I design.",
  "I develop.",
  "I think.",
  "And listen..."
];

export const StatementSlide: React.FC<{ index: number }> = ({ index }) => {
  const stmt = statements[index];
  if (!stmt) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-[10vw] overflow-hidden">
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
          className="font-light leading-[0.95] tracking-[-0.04em] text-white"
          style={{
            fontSize: 'clamp(4.5rem, 13vw, 12rem)',
            fontFamily: 'var(--fd, "Inter", sans-serif)'
          }}
        >
          {stmt === "And listen..." ? (
            <>And<br />listen<span className="text-[#5983FC]">...</span></>
          ) : (
            stmt
          )}
        </div>
      </motion.div>
    </div>
  );
};
