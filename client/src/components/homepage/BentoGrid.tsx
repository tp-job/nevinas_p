import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useSlideScroll } from './SlideWrapper';

import aiSolution from '@/assets/image/noubackground/ai-solution.png';
import glassAbstract from '@/assets/image/noubackground/glass-abstract.png';

const BentoGrid: React.FC = () => {
  const slideProgress = useSlideScroll();

  // Staggered scroll animation values for all 11 cards
  const c1_opacity = useTransform(slideProgress || new MotionValue(0), [0.26, 0.36, 0.64, 0.74], [0, 1, 1, 0]);
  const c1_y = useTransform(slideProgress || new MotionValue(0), [0.26, 0.36, 0.64, 0.74], [30, 0, 0, -30]);

  const c2_opacity = useTransform(slideProgress || new MotionValue(0), [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const c2_y = useTransform(slideProgress || new MotionValue(0), [0.28, 0.38, 0.62, 0.72], [30, 0, 0, -30]);

  const c3_opacity = useTransform(slideProgress || new MotionValue(0), [0.30, 0.40, 0.60, 0.70], [0, 1, 1, 0]);
  const c3_scale = useTransform(slideProgress || new MotionValue(0), [0.30, 0.40, 0.60, 0.70], [0.94, 1, 1, 0.94]);
  const c3_y = useTransform(slideProgress || new MotionValue(0), [0.30, 0.40, 0.60, 0.70], [30, 0, 0, -30]);

  const c4_opacity = useTransform(slideProgress || new MotionValue(0), [0.32, 0.42, 0.58, 0.68], [0, 1, 1, 0]);
  const c4_y = useTransform(slideProgress || new MotionValue(0), [0.32, 0.42, 0.58, 0.68], [30, 0, 0, -30]);

  const c5_opacity = useTransform(slideProgress || new MotionValue(0), [0.34, 0.44, 0.56, 0.66], [0, 1, 1, 0]);
  const c5_y = useTransform(slideProgress || new MotionValue(0), [0.34, 0.44, 0.56, 0.66], [30, 0, 0, -30]);

  const c6_opacity = useTransform(slideProgress || new MotionValue(0), [0.36, 0.46, 0.54, 0.64], [0, 1, 1, 0]);
  const c6_y = useTransform(slideProgress || new MotionValue(0), [0.36, 0.46, 0.54, 0.64], [30, 0, 0, -30]);

  const c7_opacity = useTransform(slideProgress || new MotionValue(0), [0.38, 0.48, 0.52, 0.62], [0, 1, 1, 0]);
  const c7_y = useTransform(slideProgress || new MotionValue(0), [0.38, 0.48, 0.52, 0.62], [30, 0, 0, -30]);

  const c8_opacity = useTransform(slideProgress || new MotionValue(0), [0.40, 0.50, 0.50, 0.60], [0, 1, 1, 0]);
  const c8_scale = useTransform(slideProgress || new MotionValue(0), [0.40, 0.50, 0.50, 0.60], [0.96, 1, 1, 0.96]);

  const c9_opacity = useTransform(slideProgress || new MotionValue(0), [0.29, 0.39, 0.61, 0.71], [0, 1, 1, 0]);
  const c9_y = useTransform(slideProgress || new MotionValue(0), [0.29, 0.39, 0.61, 0.71], [30, 0, 0, -30]);

  const c10_opacity = useTransform(slideProgress || new MotionValue(0), [0.31, 0.41, 0.59, 0.69], [0, 1, 1, 0]);
  const c10_y = useTransform(slideProgress || new MotionValue(0), [0.31, 0.41, 0.59, 0.69], [30, 0, 0, -30]);

  const c11_opacity = useTransform(slideProgress || new MotionValue(0), [0.33, 0.43, 0.57, 0.67], [0, 1, 1, 0]);
  const c11_y = useTransform(slideProgress || new MotionValue(0), [0.33, 0.43, 0.57, 0.67], [30, 0, 0, -30]);

  if (!slideProgress) {
    return (
      <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text w-full py-16 px-5 sm:px-10 flex justify-center items-center overflow-hidden">
        <div className="max-w-[1400px] w-full mx-auto bento">
          {/* 1: scroll smoothly card */}
          <motion.div className="bc pb-9" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
            <div className="text-[0.45rem] tracking-[0.2em] mb-4 text-[var(--color-text-secondary)] font-bold uppercase">SCROLL SMOOTHLY</div>
            <div className="w-7 h-7 bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)] shadow-sm flex items-center justify-center rounded-md mb-3">
              <svg viewBox="0 0 14 14" fill="none" className="w-[13px] h-[13px]">
                <rect x="1" y="1" width="5" height="5" fill="var(--color-text-primary)"/>
                <rect x="7.5" y="7.5" width="5" height="5" fill="var(--color-text-primary)"/>
                <rect x="7.5" y="1" width="5" height="5" fill="var(--color-text-muted)"/>
              </svg>
            </div>
            <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Performance</div>
            <div className="text-xl font-medium tracking-tight text-[var(--color-text-primary)]">Supervision</div>
          </motion.div>

          {/* 2: Japanese card */}
          <motion.div className="bc" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.1}}>
            <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Identity</div>
            <div className="text-xl font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">About Nevinas</div>
            <div className="font-[var(--fj)] text-lg mb-1 text-[var(--color-text-primary)]">ネヴィナス</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">異世界 — Isekai</div>
          </motion.div>

          {/* 3: center card (dark gradient) */}
          <motion.div className="bc relative overflow-hidden flex flex-col justify-end p-6" initial={{opacity:0, scale:0.95}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay: 0.2}}>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-velvet-indigo)] to-[var(--color-velvet-night)] z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-sub-french-10),transparent_50%)] z-0" />
            <div 
              className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none select-none bg-cover bg-center"
              style={{ backgroundImage: `url(${glassAbstract})` }}
            />
            <div className="relative z-10 text-white">
              <div className="text-[0.5rem] text-white/50 uppercase tracking-widest mb-2 border border-white/20 inline-block px-2 py-0.5 rounded-full">Control your Progress Data</div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-3">Full-Stack<br/>Developer</div>
              <div className="text-sm text-white/70 leading-relaxed mb-4">Scroll-driven experiences. Break it apart, apply to any element across the page.</div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-white/40">(</span>
                <span className="text-[0.55rem] uppercase tracking-widest text-white/60">Scroll → Explore</span>
                <span className="text-white/40">)</span>
              </div>
            </div>
          </motion.div>

          {/* 4: Use Scroll card */}
          <motion.div className="bc" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.1}}>
            <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Navigation</div>
            <div className="text-xl font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">Use Scroll.<br/>Control all.</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-2">Wheel up / down drives every transition.</div>
          </motion.div>

          {/* 5: Safe kerning card */}
          <motion.div className="bc" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.2}}>
            <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Typography</div>
            <div className="text-[0.92rem] font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">Safe natural kerning when splitting</div>
            <div className="text-[2.2rem] font-light text-[var(--color-matte-royal)] tracking-[-0.03em] leading-none mt-2">Tu</div>
          </motion.div>

          {/* 6: Ultra Optimized */}
          <motion.div className="bc dark relative overflow-hidden" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
            <div 
              className="absolute right-[-10%] bottom-[-10%] w-[100px] h-[100px] opacity-[0.15] pointer-events-none select-none z-0 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${aiSolution})` }}
            />
            <div className="relative z-10">
              <div className="text-[0.5rem] text-white/40 uppercase tracking-widest mb-1">Performance</div>
              <div className="text-xl font-medium tracking-tight mb-2 text-white">Ultra<br/>Optimized</div>
              <div className="mt-2 text-white/30">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* 7: StringTune preview card */}
          <motion.div className="bc navy" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.1}}>
            <div className="text-[0.5rem] text-white/40 uppercase tracking-widest mb-1">Projects</div>
            <div className="text-xl font-medium tracking-tight mb-3">Smart Learning Hub</div>
            <div className="mt-2 p-2 bg-[var(--color-matte-azure)]/10 rounded-md border border-[var(--color-matte-azure)]/20">
              <div className="text-[0.5rem] text-white/40 uppercase tracking-[0.12em]">LMS SYSTEM</div>
              <div className="text-[0.85rem] text-white/70 font-light mt-1">Project Alpha</div>
            </div>
          </motion.div>

          {/* 8: Marquee "FOR DEVELOPERS & DESIGNERS" */}
          <motion.div className="bc overflow-hidden py-4 flex items-center" initial={{opacity:0, scale:0.95}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay: 0.2}}>
            <div className="whitespace-nowrap text-sm font-bold tracking-[0.2em] text-[var(--color-text-secondary)] w-[200%] animate-[mq_10s_linear_infinite] flex">
              <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
              <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
              <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
            </div>
          </motion.div>

          {/* 9: Cursor tracking */}
          <motion.div className="bc" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
            <div className="text-xl mb-2 text-[var(--color-text-primary)]">▶</div>
            <div className="text-[0.55rem] font-bold tracking-widest text-[var(--color-text-primary)] border border-[var(--color-border-secondary)] inline-block px-2 py-0.5 bg-[var(--color-surface-secondary)] shadow-sm rounded-sm">CURSOR CONTENT</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-2">Cursor Tracking of any kind</div>
          </motion.div>

          {/* 10: Progress Easing */}
          <motion.div className="bc" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.1}}>
            <svg className="w-full h-12 mb-2" viewBox="0 0 120 80">
              <line x1="10" y1="70" x2="110" y2="10" stroke="var(--color-border-primary)" strokeWidth="0.5" strokeDasharray="3,3"/>
              <path d="M10 70 C 30 70, 85 10, 110 10" stroke="var(--color-matte-azure)" strokeWidth="1.5" fill="none"/>
              <line x1="10" y1="10" x2="10" y2="70" stroke="var(--color-border-primary)" strokeWidth="0.5"/>
              <line x1="10" y1="70" x2="110" y2="70" stroke="var(--color-border-primary)" strokeWidth="0.5"/>
            </svg>
            <div className="text-xs text-[var(--color-text-secondary)] text-center">Progress Easing</div>
          </motion.div>

          {/* 11: Position Sticky */}
          <motion.div className="bc flex flex-col justify-center items-center text-center" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.2}}>
            <div className="text-base font-medium tracking-tight text-[var(--color-text-primary)]">Position Sticky?</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">Of course</div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text w-full py-16 px-5 sm:px-10 flex justify-center items-center overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto bento">
        {/* 1: scroll smoothly card */}
        <motion.div style={{ opacity: c1_opacity, y: c1_y }} className="bc pb-9">
          <div className="text-[0.45rem] tracking-[0.2em] mb-4 text-[var(--color-text-secondary)] font-bold uppercase">SCROLL SMOOTHLY</div>
          <div className="w-7 h-7 bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)] shadow-sm flex items-center justify-center rounded-md mb-3">
            <svg viewBox="0 0 14 14" fill="none" className="w-[13px] h-[13px]">
              <rect x="1" y="1" width="5" height="5" fill="var(--color-text-primary)"/>
              <rect x="7.5" y="7.5" width="5" height="5" fill="var(--color-text-primary)"/>
              <rect x="7.5" y="1" width="5" height="5" fill="var(--color-text-muted)"/>
            </svg>
          </div>
          <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Performance</div>
          <div className="text-xl font-medium tracking-tight text-[var(--color-text-primary)]">Supervision</div>
        </motion.div>

        {/* 2: Japanese card */}
        <motion.div style={{ opacity: c2_opacity, y: c2_y }} className="bc">
          <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Identity</div>
          <div className="text-xl font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">About Nevinas</div>
          <div className="font-[var(--fj)] text-lg mb-1 text-[var(--color-text-primary)]">ネヴィナス</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">異世界 — Isekai</div>
        </motion.div>

        {/* 3: center card (dark gradient) */}
        <motion.div style={{ opacity: c3_opacity, scale: c3_scale, y: c3_y }} className="bc relative overflow-hidden flex flex-col justify-end p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-velvet-indigo)] to-[var(--color-velvet-night)] z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-sub-french-10),transparent_50%)] z-0" />
          <div 
            className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none select-none bg-cover bg-center"
            style={{ backgroundImage: `url(${glassAbstract})` }}
          />
          <div className="relative z-10 text-white">
            <div className="text-[0.5rem] text-white/50 uppercase tracking-widest mb-2 border border-white/20 inline-block px-2 py-0.5 rounded-full">Control your Progress Data</div>
            <div className="text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-3">Full-Stack<br/>Developer</div>
            <div className="text-sm text-white/70 leading-relaxed mb-4">Scroll-driven experiences. Break it apart, apply to any element across the page.</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-white/40">(</span>
              <span className="text-[0.55rem] uppercase tracking-widest text-white/60">Scroll → Explore</span>
              <span className="text-white/40">)</span>
            </div>
          </div>
        </motion.div>

        {/* 4: Use Scroll card */}
        <motion.div style={{ opacity: c4_opacity, y: c4_y }} className="bc">
          <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Navigation</div>
          <div className="text-xl font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">Use Scroll.<br/>Control all.</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-2">Wheel up / down drives every transition.</div>
        </motion.div>

        {/* 5: Safe kerning card */}
        <motion.div style={{ opacity: c5_opacity, y: c5_y }} className="bc">
          <div className="text-[0.5rem] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Typography</div>
          <div className="text-[0.92rem] font-medium tracking-tight mb-2 text-[var(--color-text-primary)]">Safe natural kerning when splitting</div>
          <div className="text-[2.2rem] font-light text-[var(--color-matte-royal)] tracking-[-0.03em] leading-none mt-2">Tu</div>
        </motion.div>

        {/* 6: Ultra Optimized */}
        <motion.div style={{ opacity: c6_opacity, y: c6_y }} className="bc dark relative overflow-hidden">
          <div 
            className="absolute right-[-10%] bottom-[-10%] w-[100px] h-[100px] opacity-[0.15] pointer-events-none select-none z-0 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${aiSolution})` }}
          />
          <div className="relative z-10">
            <div className="text-[0.5rem] text-white/40 uppercase tracking-widest mb-1">Performance</div>
            <div className="text-xl font-medium tracking-tight mb-2 text-white">Ultra<br/>Optimized</div>
            <div className="mt-2 text-white/30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* 7: StringTune preview card */}
        <motion.div style={{ opacity: c7_opacity, y: c7_y }} className="bc navy">
          <div className="text-[0.5rem] text-white/40 uppercase tracking-widest mb-1">Projects</div>
          <div className="text-xl font-medium tracking-tight mb-3">Smart Learning Hub</div>
          <div className="mt-2 p-2 bg-[var(--color-matte-azure)]/10 rounded-md border border-[var(--color-matte-azure)]/20">
            <div className="text-[0.5rem] text-white/40 uppercase tracking-[0.12em]">LMS SYSTEM</div>
            <div className="text-[0.85rem] text-white/70 font-light mt-1">Project Alpha</div>
          </div>
        </motion.div>

        {/* 8: Marquee "FOR DEVELOPERS & DESIGNERS" */}
        <motion.div style={{ opacity: c8_opacity, scale: c8_scale }} className="bc overflow-hidden py-4 flex items-center">
          <div className="whitespace-nowrap text-sm font-bold tracking-[0.2em] text-[var(--color-text-secondary)] w-[200%] animate-[mq_10s_linear_infinite] flex">
            <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
            <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
            <span>FOR &nbsp;&nbsp;&nbsp; DEVELOPERS &nbsp;&nbsp;&nbsp; &amp; &nbsp;&nbsp;&nbsp; DESIGNERS &nbsp;&nbsp;&nbsp; · &nbsp;&nbsp;&nbsp; </span>
          </div>
        </motion.div>

        {/* 9: Cursor tracking */}
        <motion.div style={{ opacity: c9_opacity, y: c9_y }} className="bc">
          <div className="text-xl mb-2 text-[var(--color-text-primary)]">▶</div>
          <div className="text-[0.55rem] font-bold tracking-widest text-[var(--color-text-primary)] border border-[var(--color-border-secondary)] inline-block px-2 py-0.5 bg-[var(--color-surface-secondary)] shadow-sm rounded-sm">CURSOR CONTENT</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-2">Cursor Tracking of any kind</div>
        </motion.div>

        {/* 10: Progress Easing */}
        <motion.div style={{ opacity: c10_opacity, y: c10_y }} className="bc">
          <svg className="w-full h-12 mb-2" viewBox="0 0 120 80">
            <line x1="10" y1="70" x2="110" y2="10" stroke="var(--color-border-primary)" strokeWidth="0.5" strokeDasharray="3,3"/>
            <path d="M10 70 C 30 70, 85 10, 110 10" stroke="var(--color-matte-azure)" strokeWidth="1.5" fill="none"/>
            <line x1="10" y1="10" x2="10" y2="70" stroke="var(--color-border-primary)" strokeWidth="0.5"/>
            <line x1="10" y1="70" x2="110" y2="70" stroke="var(--color-border-primary)" strokeWidth="0.5"/>
          </svg>
          <div className="text-xs text-[var(--color-text-secondary)] text-center">Progress Easing</div>
        </motion.div>

        {/* 11: Position Sticky */}
        <motion.div style={{ opacity: c11_opacity, y: c11_y }} className="bc flex flex-col justify-center items-center text-center">
          <div className="text-base font-medium tracking-tight text-[var(--color-text-primary)]">Position Sticky?</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Of course</div>
        </motion.div>
      </div>
    </div>
  );
};

export default BentoGrid;
