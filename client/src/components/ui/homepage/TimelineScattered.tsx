import React from 'react';
import { motion } from 'framer-motion';

import joystick from '@/assets/image/noubackground/joystick.png';
import integrationStatus from '@/assets/image/noubackground/integration-status-icons.png';

const TimelineScattered: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] bg-[var(--homepage-bg-light)] overflow-hidden flex items-center justify-center py-20 px-4 md:px-10 lg:px-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {/* Top Left */}
        <motion.div 
          className="absolute top-[10%] left-[8%] max-w-[280px] pointer-events-auto z-10"
          initial={{ opacity: 0, x: -30, y: -30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="text-xl mb-4 text-[var(--homepage-text-secondary)]">→</div>
          <div className="w-8 h-8 rounded-full border border-[var(--homepage-border-heavy)] flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-[var(--homepage-text-primary)] rounded-full" />
          </div>
          <div className="text-[0.65rem] tracking-widest text-[var(--homepage-color-matte-royal,#878CB4)] mb-1 font-bold">1</div>
          <h3 className="text-2xl sm:text-3xl font-light leading-tight mb-2 tracking-tight text-[var(--homepage-text-primary)]" style={{ fontFamily: 'var(--font-inter, "Inter", sans-serif)' }}>I craft with<br/>intention.</h3>
          <p className="text-sm font-medium mb-3 text-[var(--homepage-text-primary)]">No learning curve.<br/>Just a signal.</p>
          <p className="text-sm text-[var(--homepage-text-secondary)]">Frontend development with HTML, CSS, JS — building interfaces that feel as good as they look.</p>
        </motion.div>

        {/* Top Right */}
        <motion.div 
          className="absolute top-[15%] right-[8%] max-w-[280px] text-right flex flex-col items-end pointer-events-auto z-10"
          initial={{ opacity: 0, x: 30, y: -30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Accent icon overlay */}
          <div 
            className="absolute left-[-20%] top-[40%] w-[120px] h-[120px] opacity-[0.06] pointer-events-none select-none z-0 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${integrationStatus})` }}
          />

          <div className="relative z-10 flex flex-col items-end">
            <div className="text-xl mb-4 text-[var(--homepage-text-secondary)]">→</div>
            <div className="w-8 h-8 rounded-full border border-[var(--homepage-border-heavy)] flex items-center justify-center mb-4 overflow-hidden relative">
              <div className="absolute top-1/2 left-0 right-0 bottom-0 bg-[var(--homepage-text-primary)]" />
              <div className="w-1.5 h-1.5 bg-[var(--homepage-bg-light)] rounded-full z-10" />
            </div>
            <div className="text-[0.65rem] tracking-widest text-[var(--homepage-color-matte-royal,#878CB4)] mb-1 font-bold">2</div>
            <h3 className="text-2xl sm:text-3xl font-light leading-tight mb-2 tracking-tight text-[var(--homepage-text-primary)]" style={{ fontFamily: 'var(--font-inter, "Inter", sans-serif)' }}>I think<br/>long term.</h3>
            <p className="text-sm font-medium mb-3 text-[var(--homepage-text-primary)]">Every piece stands<br/>alone — or flows as one.</p>
            <p className="text-sm text-[var(--homepage-text-secondary)]">Building scalable systems and learning continuously to create products that redefine the future.</p>
          </div>
        </motion.div>

        {/* Bottom Left */}
        <motion.div 
          className="absolute bottom-[10%] left-[12%] max-w-[280px] pointer-events-auto z-10"
          initial={{ opacity: 0, x: -30, y: 30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Accent joystick overlay */}
          <div 
            className="absolute right-[-20%] top-[30%] w-[120px] h-[120px] opacity-[0.05] pointer-events-none select-none z-0 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${joystick})` }}
          />

          <div className="relative z-10">
            <div className="text-xl mb-4 text-[var(--homepage-text-secondary)]">→</div>
            <div className="grid grid-cols-3 gap-1 w-9 h-9 mb-4">
              <div className="bg-[var(--homepage-color-matte-royal,#878CB4)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-color-matte-royal,#878CB4)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-text-primary)] rounded-sm" />
              <div className="bg-[var(--homepage-color-matte-royal,#878CB4)] rounded-sm" />
            </div>
            <div className="text-[0.65rem] tracking-widest text-[var(--homepage-color-matte-royal,#878CB4)] mb-1 font-bold">3</div>
            <h3 className="text-2xl sm:text-3xl font-light leading-tight mb-2 tracking-tight text-[var(--homepage-text-primary)]" style={{ fontFamily: 'var(--font-inter, "Inter", sans-serif)' }}>Performance<br/>Oriented.</h3>
            <p className="text-sm font-medium mb-3 text-[var(--homepage-text-secondary)]">~60FPS~</p>
            <p className="text-sm text-[var(--homepage-text-secondary)] opacity-80">Fast as a cut. Light as breath. Low memory, zero layout shifts, native-friendly.</p>
          </div>
        </motion.div>

        {/* Bottom Right */}
        <motion.div 
          className="absolute bottom-[15%] right-[12%] max-w-[280px] text-right flex flex-col items-end pointer-events-auto z-10"
          initial={{ opacity: 0, x: 30, y: 30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-xl mb-4 text-[var(--homepage-text-secondary)]">→</div>
          <div className="relative w-10 h-10 mb-4">
            <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-[var(--homepage-text-primary)]" />
            <div className="absolute top-0 right-0 w-6 h-6 rounded-full border-2 border-[var(--homepage-color-matte-royal,#878CB4)]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full border-2 border-[var(--homepage-color-matte-royal,#878CB4)]" />
          </div>
          <div className="text-[0.65rem] tracking-widest text-[var(--homepage-color-matte-royal,#878CB4)] mb-1 font-bold">4</div>
          <h3 className="text-2xl sm:text-3xl font-light leading-tight mb-2 tracking-tight text-[var(--homepage-text-primary)]" style={{ fontFamily: 'var(--font-inter, "Inter", sans-serif)' }}>I reach<br/>for more.</h3>
          <p className="text-sm font-medium mb-3 text-[var(--homepage-text-primary)]">Craft only what<br/>you need.</p>
          <p className="text-sm text-[var(--homepage-text-secondary)]">Becoming a developer who teaches, builds impactful systems, and pushes UI/UX boundaries.</p>
        </motion.div>
      </div>

      {/* Mobile Stack View */}
      <div className="md:hidden flex flex-col gap-12 w-full max-w-md">
        {/* Same content as above but stacked vertically for mobile */}
        {[
          { title: "I craft with\nintention.", num: "1", align: "left" },
          { title: "I think\nlong term.", num: "2", align: "right" },
          { title: "Performance\nOriented.", num: "3", align: "left" },
          { title: "I reach\nfor more.", num: "4", align: "right" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            className={`w-full ${item.align === 'right' ? 'text-right flex flex-col items-end' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[0.65rem] tracking-widest text-[#5983FC] mb-1 font-bold">{item.num}</div>
            <h3 className="text-2xl sm:text-3xl font-light leading-tight mb-2 tracking-tight whitespace-pre-line" style={{ fontFamily: 'var(--fd, "Inter", sans-serif)' }}>
              {item.title}
            </h3>
            <p className="text-sm opacity-60">Building scalable systems and learning continuously to create products that redefine the future.</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="text-[0.65rem] tracking-widest uppercase text-gray-500 font-medium">WebGL · Real-time render · Gyroscope</div>
      </motion.div>
    </div>
  );
};

export default TimelineScattered;
