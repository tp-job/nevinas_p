import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  { q: "What technologies do you work with?", a: "I work with React, Next.js, TypeScript, TailwindCSS, Three.js, Flask, Python, and Node.js. I'm comfortable across the full stack but my passion is creating exceptional frontend experiences with performant, clean architecture." },
  { q: "Are you available for freelance projects?", a: "Yes — I'm open to freelance work, part-time collaborations, and full-time roles. I enjoy working on challenging projects that push the boundaries of web design and development. Let's build something remarkable together." },
  { q: "What is your design philosophy?", a: "I believe in intentional design — every pixel, interaction, and line of code should serve a purpose. Inspired by Japanese minimalism, I create interfaces where restraint and precision lead to experiences that feel effortless to use." },
  { q: "What is your development process?", a: "I start with understanding the problem deeply, then prototype rapidly, iterate with feedback, and deliver production-ready code. I prioritize performance, accessibility, and maintainability throughout every project lifecycle." },
  { q: "What is 異世界 (Isekai) in your portfolio context?", a: "Isekai (異世界) means \"another world\" in Japanese — it reflects my belief that great web experiences should transport users into a world entirely their own. My portfolio is built in that spirit: immersive, precise, and otherworldly." },
  { q: "How do you approach performance optimization?", a: "Performance is non-negotiable. I target 60FPS with careful use of requestAnimationFrame, CSS transforms over layout-triggering properties, lazy loading, and Three.js optimizations. This portfolio itself runs at 60FPS with multiple WebGL renderers." },
  { q: "How can we get in touch?", a: "Scroll to the Contact slide using the nav above, or reach out directly at hello@nevinas.dev — I respond within 24 hours and love discussing ambitious projects, creative collaborations, or just great ideas." }
];

const FaqNewsFooter: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(2);

  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] flex flex-col w-full overflow-hidden">
      
      {/* META BAR */}
      <div className="grid grid-cols-4 border-b border-black/10">
        {[1, 2, 3, 4].map((i) => (
          <div className="px-4 py-2 border-r border-[var(--color-border-subtle)] last:border-r-0 flex items-center gap-2 font-[var(--fm)] text-[0.5rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-matte-royal)]" />
            B0{i} ↑
          </div>
        ))}
      </div>

      {/* HERO ROW */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.7fr_1fr] border-b border-black/10 min-h-[105px]">
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10 flex items-center">
          <div className="font-[var(--fd)] text-4xl sm:text-5xl font-bold tracking-tight">FAQ</div>
        </div>
        <div className="p-6 border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)] flex items-center justify-center bg-[var(--color-surface-variant)]">
          <div className="relative w-12 h-12 rounded-full border-[3px] border-[var(--color-border-primary)] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[var(--color-matte-royal)]" />
            <div className="absolute -left-2 w-3.5 h-4.5 rounded bg-[var(--color-border-primary)]" />
            <div className="absolute -right-2 w-3.5 h-4.5 rounded bg-[var(--color-border-primary)]" />
          </div>
        </div>
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-center">
          <div className="font-[var(--fm)] text-sm font-semibold mb-1 flex items-center gap-1.5">
            <span style={{ color: 'var(--color-matte-royal)' }}>•</span> Most Common Questions
          </div>
          <div className="font-[var(--fm)] text-xs text-black/40 leading-relaxed max-w-sm">
            No worries, here you can find all<br/>the answers you need.
          </div>
        </div>
        <div className="p-6 flex items-center justify-center md:justify-end bg-white/35">
          <div className="font-[var(--fj)] text-2xl text-black/10 tracking-widest">問答</div>
        </div>
      </div>

      {/* ACCORDION */}
      <div className="border-b border-black/10">
        {faqData.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className={`border-t border-[var(--color-border-subtle)] overflow-hidden transition-colors duration-200 cursor-pointer ${isOpen ? 'bg-[var(--color-surface-variant)]' : 'hover:bg-[var(--color-surface-secondary)]'}`}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between p-4 md:p-6 gap-4">
                <span className="font-[var(--fm)] text-[0.7rem] sm:text-sm tracking-wide">{item.q}</span>
                <button 
                  style={{
                    backgroundColor: isOpen ? 'var(--color-matte-royal)' : 'transparent',
                    borderColor: isOpen ? 'var(--color-matte-royal)' : 'var(--color-border-primary)',
                    color: isOpen ? 'white' : 'var(--color-text-primary)'
                  }}
                  className={`w-6 h-6 rounded-full border-[1.5px] shrink-0 flex items-center justify-center text-lg transition-all duration-300 ${isOpen ? 'rotate-45' : 'hover:bg-[var(--color-surface-tertiary)]'}`}
                >
                  +
                </button>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 md:px-6 pb-4"
                  >
                    <div className="font-[var(--fm)] text-[0.65rem] sm:text-xs text-black/50 leading-[1.75] max-w-3xl">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* LATEST NEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.35fr_1fr_1fr] border-b border-black/10">
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col justify-between">
          <div className="font-[var(--fd)] text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-none">
            Latest<br/>News<sup className="text-[0.28em] font-normal text-black/30 tracking-[0.06em] ml-1">NEW</sup>
          </div>
          <button className="w-8 h-8 rounded-full border-[1.5px] border-[var(--color-border-primary)] flex items-center justify-center text-sm hover:bg-[var(--color-matte-royal)] hover:border-[var(--color-matte-royal)] hover:text-white transition-colors mt-4">
            →
          </button>
        </div>
        
        <div className="hidden lg:flex flex-col items-center justify-center gap-2 border-r border-black/10">
          <button className="w-6 h-6 rounded-full border border-[var(--color-border-primary)] flex items-center justify-center text-[0.65rem] text-[var(--color-text-muted)] hover:bg-[var(--color-text-primary)] hover:text-white transition-colors">‹</button>
          <button className="w-6 h-6 rounded-full border border-[var(--color-border-primary)] flex items-center justify-center text-[0.65rem] text-[var(--color-text-muted)] hover:bg-[var(--color-text-primary)] hover:text-white transition-colors">›</button>
        </div>

        {/* News Card 1 */}
        <div className="p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col gap-2 hover:bg-white/55 transition-colors cursor-pointer group">
          <div className="w-full h-16 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-matte-midnight)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(89,131,252,0.6),transparent_65%),radial-gradient(ellipse_at_20%_70%,rgba(150,78,194,0.4),transparent_60%)]" />
            <div className="absolute top-1 left-1.5 font-[var(--fm)] text-[0.45rem] tracking-[0.1em] uppercase text-white/50 bg-black/30 px-1.5 py-0.5 rounded-sm">PROJECT · LMS</div>
            <div className="absolute bottom-1 right-1.5 text-sm opacity-20 text-white group-hover:scale-125 transition-transform">◈</div>
          </div>
          <div className="font-[var(--fm)] text-[0.7rem] sm:text-xs leading-relaxed mt-1">Smart Learning Hub — Building a full LMS with React &amp; Flask</div>
          <div className="flex justify-between font-[var(--fm)] text-[0.55rem] text-black/35 tracking-wider mt-auto pt-2">
            <span>Weekly</span>
            <span>May 2026</span>
          </div>
        </div>

        {/* News Card 2 */}
        <div className="p-5 md:p-6 flex flex-col gap-2 hover:bg-white/55 transition-colors cursor-pointer group">
          <div className="w-full h-16 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-matte-midnight)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(255,123,191,0.35),transparent_60%),radial-gradient(ellipse_at_80%_30%,rgba(62,96,193,0.5),transparent_55%)]" />
            <div className="absolute top-1 left-1.5 font-[var(--fm)] text-[0.45rem] tracking-[0.1em] uppercase text-white/50 bg-black/30 px-1.5 py-0.5 rounded-sm">PROJECT · 3D</div>
            <div className="absolute bottom-1 right-1.5 text-sm opacity-20 text-white group-hover:scale-125 transition-transform">✦</div>
          </div>
          <div className="font-[var(--fm)] text-[0.7rem] sm:text-xs leading-relaxed mt-1">3D Interactive Web — Three.js gyroscope &amp; scroll-driven experiences</div>
          <div className="flex justify-between font-[var(--fm)] text-[0.55rem] text-black/35 tracking-wider mt-auto pt-2">
            <span>Weekly</span>
            <span>Apr 2026</span>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1.5fr_0.4fr_0.65fr] border-b border-black/10 min-h-[52px] items-stretch">
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-black/10 flex items-center">
          <div className="font-[var(--fd)] text-sm font-semibold tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-[var(--color-matte-midnight)] to-[var(--color-matte-royal)] rounded flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5">
                <rect x="1" y="1" width="6" height="6" fill="white"/>
                <rect x="9" y="9" width="6" height="6" fill="white"/>
                <rect x="9" y="1" width="6" height="6" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
            Nevinas<sup className="text-[0.45em] opacity-50 ml-px">©</sup>
          </div>
        </div>
        
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-black/10 flex items-center w-full">
          <div className="flex flex-col gap-1 w-full">
            <div className="font-[var(--fm)] text-[0.5rem] text-black/30 tracking-[0.14em] uppercase">Subscribe to be in touch*</div>
            <input type="email" placeholder="Your e-mail" className="w-full bg-transparent border-b border-[var(--color-border-primary)] py-1 font-[var(--fm)] text-sm focus:outline-none focus:border-[var(--color-matte-azure)] transition-colors placeholder:text-[var(--color-text-muted)]" />
          </div>
        </div>
        
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-black/10 flex items-center hidden md:flex">
          <div className="font-[var(--fm)] text-[0.5rem] text-black/30 tracking-[0.12em] uppercase leading-relaxed">
            *Only valuable<br/>resources &amp; updates
          </div>
        </div>
        
        <button style={{ backgroundColor: 'var(--color-matte-royal)' }} className="hover:opacity-90 transition-colors flex items-center justify-center text-white font-[var(--fm)] text-[0.65rem] font-bold tracking-[0.12em] uppercase p-4 md:p-0 w-full h-full">
          SUBSCRIBE
        </button>
      </div>

      {/* FOOTER LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-black/10">
        {[
          { title: "Connect", links: ["GitHub", "LinkedIn", "Twitter / X", "Medium"] },
          { title: "Quick Links", links: ["Home", "About", "Timeline", "Contact"], noExt: true },
          { title: "Legal", links: ["Privacy Policy", "Cookie Policy", "Terms of Service"], noExt: true },
          { title: "Download", links: ["Resume PDF", "Portfolio PDF"] }
        ].map((col, i) => (
          <div key={i} className="p-4 md:p-6 md:border-r border-black/5 last:border-r-0">
            <div className="font-[var(--fm)] text-[0.55rem] tracking-[0.22em] uppercase text-black/30 mb-3">{col.title}</div>
            <div className="flex flex-col gap-1">
              {col.links.map((link, j) => (
                <a key={j} href="#" className="flex justify-between items-center font-[var(--fm)] text-[0.65rem] text-[var(--color-text-secondary)] hover:text-[var(--color-matte-azure)] transition-colors py-0.5 group">
                  {link}
                  {!col.noExt && <span className="opacity-30 text-[0.5em] ml-1 group-hover:opacity-100 transition-opacity">↗</span>}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* COPYRIGHT */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-3 border-b border-black/5 font-[var(--fm)] text-[0.55rem] tracking-[0.12em] text-black/25 uppercase gap-2">
        <span>© 2026 · All rights reserved by Nevinas</span>
        <span className="text-black/20">異世界 出身 · Isekai</span>
      </div>

      {/* BIG WORD */}
      <div className="p-4 md:p-8 pt-6 relative flex items-end justify-center sm:justify-between overflow-hidden">
        {/* Corners */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-[var(--color-matte-royal)] hidden sm:block" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-[var(--color-matte-royal)] hidden sm:block" />
        <div className="absolute bottom-0 left-6 w-3 h-3 border-b-2 border-l-2 border-[var(--color-matte-royal)] hidden sm:block" />
        <div className="absolute bottom-0 right-6 w-3 h-3 border-b-2 border-r-2 border-[var(--color-matte-royal)] hidden sm:block" />
        
        <div 
          className="font-[var(--fd)] font-black tracking-[-0.06em] leading-[0.88] uppercase text-[clamp(4.5rem,14vw,13rem)]"
        >
          ネヴィ<span style={{ color: 'var(--color-matte-royal)' }}>ナス</span>
        </div>
      </div>

    </div>
  );
};

export default FaqNewsFooter;
