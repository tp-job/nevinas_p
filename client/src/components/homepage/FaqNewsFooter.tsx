import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Assets } from '@/data/homeData';

interface FooterLink {
  label: string;
  href: string;
  ext: boolean;
  download?: string;
}

const FOOTER_LINK_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', href: 'https://github.com/tp-job', ext: true },
      { label: 'Instagram', href: 'https://www.instagram.com/tp_job_th/?hl=en', ext: true },
      { label: 'Twitter / X', href: 'https://x.com/nevinas_ka', ext: true },
      { label: 'Email', href: 'mailto:nevinasv@gmail.com', ext: true },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '#top', ext: false },
      { label: 'About', href: '#about', ext: false },
      { label: 'Timeline', href: '#timeline', ext: false },
      { label: 'Contact', href: '#contact', ext: false },
    ],
  },
  {
    title: 'Download',
    links: [{ label: 'Resume PDF', href: Assets.resume, ext: true, download: 'resume-nevinas-ka.pdf' }],
  },
];

const faqData = [
  { q: "What technologies do you work with?", a: "I work with React, Next.js, TypeScript, TailwindCSS, Three.js, Flask, Python, and Node.js. I'm comfortable across the full stack but my passion is creating exceptional frontend experiences with performant, clean architecture." },
  { q: "Are you available for freelance projects?", a: "Yes — I'm open to freelance work, part-time collaborations, and full-time roles. I enjoy working on challenging projects that push the boundaries of web design and development. Let's build something remarkable together." },
  { q: "What is your design philosophy?", a: "I believe in intentional design — every pixel, interaction, and line of code should serve a purpose. Inspired by Japanese minimalism, I create interfaces where restraint and precision lead to experiences that feel effortless to use." },
  { q: "What is your development process?", a: "I start with understanding the problem deeply, then prototype rapidly, iterate with feedback, and deliver production-ready code. I prioritize performance, accessibility, and maintainability throughout every project lifecycle." },
  { q: "What is 異世界 (Isekai) in your portfolio context?", a: "Isekai (異世界) means \"another world\" in Japanese — it reflects my belief that great web experiences should transport users into a world entirely their own. My portfolio is built in that spirit: immersive, precise, and otherworldly." },
  { q: "How do you approach performance optimization?", a: "Performance is non-negotiable. I target 60FPS with careful use of requestAnimationFrame, CSS transforms over layout-triggering properties, lazy loading, and Three.js optimizations. This portfolio itself runs at a steady 60FPS on a single shared WebGL renderer." },
  { q: "How can we get in touch?", a: "Scroll to the Contact slide using the nav above, or reach out directly at nevinasv@gmail.com — I respond within 24 hours and love discussing ambitious projects, creative collaborations, or just great ideas." }
];

const FaqNewsFooter: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(2);

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col w-full overflow-hidden min-h-svh">
      
      {/* META BAR */}
      <div className="grid grid-cols-4 border-b border-midnight/10 dark:border-periwinkle/10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-4 py-2 border-r border-midnight/10 dark:border-periwinkle/10 last:border-r-0 flex items-center gap-2 font-[var(--fm)] text-[0.5rem] tracking-[0.2em] uppercase text-light-text-secondary dark:text-dark-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-matte-royal" />
            B0{i} ↑
          </div>
        ))}
      </div>

      {/* HERO ROW */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.7fr_1fr] border-b border-midnight/10 dark:border-periwinkle/10 min-h-[105px]">
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-midnight/10 dark:border-periwinkle/10 flex items-center">
          <div className="font-[var(--fd)] text-4xl sm:text-5xl font-bold tracking-tight">FAQ</div>
        </div>
        <div className="p-6 border-b md:border-b-0 md:border-r border-light-border dark:border-dark-border flex items-center justify-center bg-light-surface dark:bg-dark-surface">
          <div className="relative w-12 h-12 rounded-full border-[3px] border-light-border dark:border-dark-border flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-matte-royal" />
            <div className="absolute -left-2 w-3.5 h-4.5 rounded bg-light-border dark:bg-dark-border" />
            <div className="absolute -right-2 w-3.5 h-4.5 rounded bg-light-border dark:bg-dark-border" />
          </div>
        </div>
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-midnight/10 dark:border-periwinkle/10 flex flex-col justify-center">
          <div className="font-[var(--fm)] text-sm font-semibold mb-1 flex items-center gap-1.5">
            <span className="text-matte-royal">•</span> Most Common Questions
          </div>
          <div className="font-[var(--fm)] text-xs text-light-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-sm">
            No worries, here you can find all<br/>the answers you need.
          </div>
        </div>
        <div className="p-6 flex items-center justify-center md:justify-end bg-light-surface dark:bg-dark-surface">
          <div className="font-[var(--fj)] text-2xl text-light-text-muted/40 dark:text-dark-text-muted/40 tracking-widest">問答</div>
        </div>
      </div>

      {/* ACCORDION */}
      <div className="border-b border-midnight/10 dark:border-periwinkle/10">
        {faqData.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              className={`border-t border-midnight/10 dark:border-periwinkle/10 overflow-hidden transition-colors duration-200 cursor-pointer ${isOpen ? 'bg-light-surface dark:bg-dark-surface' : 'hover:bg-light-surface-2 dark:hover:bg-dark-surface-2'} focus-visible:outline-2 focus-visible:outline-[rgba(200,205,235,0.70)] focus-visible:outline-offset-[-2px]`}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenIdx(isOpen ? null : idx);
                }
              }}
            >
              <div className="flex items-center justify-between p-4 md:p-6 gap-4">
                <span className="font-[var(--fm)] text-[0.7rem] sm:text-sm tracking-wide">{item.q}</span>
                <span 
                  className={`w-6 h-6 rounded-full border-[1.5px] shrink-0 flex items-center justify-center text-lg transition-all duration-300 ${isOpen ? 'rotate-45 bg-matte-royal border-matte-royal text-dark-text-primary' : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-cool-pale dark:hover:bg-midnight'}`}
                >
                  +
                </span>
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
                    <div className="font-[var(--fm)] text-[0.65rem] sm:text-xs text-light-text-secondary dark:text-dark-text-secondary leading-[1.75] max-w-3xl">
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
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.35fr_1fr_1fr] border-b border-midnight/10 dark:border-periwinkle/10">
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-midnight/10 dark:border-periwinkle/10 flex flex-col justify-between">
          <div className="font-[var(--fd)] text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-none">
            Latest<br/>News<sup className="text-[0.28em] font-normal text-light-text-muted dark:text-dark-text-muted tracking-[0.06em] ml-1">NEW</sup>
          </div>
          <button className="w-8 h-8 rounded-full border-[1.5px] border-light-border dark:border-dark-border flex items-center justify-center text-sm hover:bg-matte-royal hover:border-matte-royal hover:text-dark-text-primary transition-colors mt-4">
            →
          </button>
        </div>
        
        <div className="hidden lg:flex flex-col items-center justify-center gap-2 border-r border-midnight/10 dark:border-periwinkle/10">
          <button className="w-6 h-6 rounded-full border border-light-border dark:border-dark-border flex items-center justify-center text-[0.65rem] text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-text dark:hover:bg-dark-text hover:text-dark-text-primary dark:hover:text-midnight transition-colors">‹</button>
          <button className="w-6 h-6 rounded-full border border-light-border dark:border-dark-border flex items-center justify-center text-[0.65rem] text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-text dark:hover:bg-dark-text hover:text-dark-text-primary dark:hover:text-midnight transition-colors">›</button>
        </div>

        {/* News Card 1 */}
        <div className="p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-midnight/10 dark:border-periwinkle/10 flex flex-col gap-2 hover:bg-light-surface-2 transition-colors cursor-pointer group">
          <div className="w-full h-16 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-br from-light-bg to-matte-midnight dark:from-dark-bg dark:to-midnight-deep">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,theme(--color-matte-azure/.6),transparent_65%),radial-gradient(ellipse_at_20%_70%,theme(--color-velvet-orchid/.4),transparent_60%)]" />
            <div className="absolute top-1 left-1.5 font-[var(--fm)] text-[0.45rem] tracking-[0.1em] uppercase text-dark-text-primary/50 bg-charcoal/30 px-1.5 py-0.5 rounded-sm">PROJECT · LMS</div>
            <div className="absolute bottom-1 right-1.5 text-sm opacity-20 text-dark-text-primary group-hover:scale-125 transition-transform">◈</div>
          </div>
          <div className="font-[var(--fm)] text-[0.7rem] sm:text-xs leading-relaxed mt-1">Smart Learning Hub — Building a full LMS with React &amp; Flask</div>
          <div className="flex justify-between font-[var(--fm)] text-[0.55rem] text-light-text-muted dark:text-dark-text-muted tracking-wider mt-auto pt-2">
            <span>Weekly</span>
            <span>May 2026</span>
          </div>
        </div>

        {/* News Card 2 */}
        <div className="p-5 md:p-6 flex flex-col gap-2 hover:bg-light-surface-2 transition-colors cursor-pointer group">
          <div className="w-full h-16 rounded-md overflow-hidden relative shrink-0 bg-gradient-to-br from-light-bg to-matte-midnight dark:from-dark-bg dark:to-midnight-deep">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,theme(--color-velvet-flamingo/.35),transparent_60%),radial-gradient(ellipse_at_80%_30%,theme(--color-matte-royal/.5),transparent_55%)]" />
            <div className="absolute top-1 left-1.5 font-[var(--fm)] text-[0.45rem] tracking-[0.1em] uppercase text-dark-text-primary/50 bg-charcoal/30 px-1.5 py-0.5 rounded-sm">PROJECT · 3D</div>
            <div className="absolute bottom-1 right-1.5 text-sm opacity-20 text-dark-text-primary group-hover:scale-125 transition-transform">✦</div>
          </div>
          <div className="font-[var(--fm)] text-[0.7rem] sm:text-xs leading-relaxed mt-1">3D Interactive Web — Three.js gyroscope &amp; scroll-driven experiences</div>
          <div className="flex justify-between font-[var(--fm)] text-[0.55rem] text-light-text-muted dark:text-dark-text-muted tracking-wider mt-auto pt-2">
            <span>Weekly</span>
            <span>Apr 2026</span>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1.5fr_0.4fr_0.65fr] border-b border-midnight/10 dark:border-periwinkle/10 min-h-[52px] items-stretch">
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-midnight/10 dark:border-periwinkle/10 flex items-center">
          <div className="font-[var(--fd)] text-sm font-semibold tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-matte-midnight to-matte-royal rounded flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 text-dark-text-primary">
                <rect x="1" y="1" width="6" height="6" fill="currentColor"/>
                <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
                <rect x="9" y="1" width="6" height="6" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            Nevinas<sup className="text-[0.45em] opacity-50 ml-px">©</sup>
          </div>
        </div>
        
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-midnight/10 dark:border-periwinkle/10 flex items-center w-full">
          <div className="flex flex-col gap-1 w-full">
            <div className="font-[var(--fm)] text-[0.5rem] text-light-text-muted dark:text-dark-text-muted tracking-[0.14em] uppercase">Subscribe to be in touch*</div>
            <input type="email" placeholder="Your e-mail" className="w-full bg-transparent border-b border-light-border dark:border-dark-border py-1 font-[var(--fm)] text-sm text-light-text dark:text-dark-text focus:outline-none focus:border-periwinkle-mid dark:focus:border-periwinkle transition-colors placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted" />
          </div>
        </div>
        
        <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-midnight/10 dark:border-periwinkle/10 items-center hidden md:flex">
          <div className="font-[var(--fm)] text-[0.5rem] text-light-text-muted dark:text-dark-text-muted tracking-[0.12em] uppercase leading-relaxed">
            *Only valuable<br/>resources &amp; updates
          </div>
        </div>
        
        <button className="hover:opacity-90 transition-colors flex items-center justify-center bg-matte-royal text-dark-text-primary font-[var(--fm)] text-[0.65rem] font-bold tracking-[0.12em] uppercase p-4 md:p-0 w-full h-full">
          SUBSCRIBE
        </button>
      </div>

      {/* FOOTER LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-3 border-b border-midnight/10 dark:border-periwinkle/10">
        {FOOTER_LINK_COLUMNS.map((col, i) => (
          <div key={i} className="p-4 md:p-6 md:border-r border-midnight/5 dark:border-periwinkle/5 last:border-r-0">
            <div className="font-[var(--fm)] text-[0.55rem] tracking-[0.22em] uppercase text-light-text-muted dark:text-dark-text-muted mb-3">{col.title}</div>
            <div className="flex flex-col gap-1">
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.download ? { download: link.download } : {})}
                  {...(link.ext && !link.download ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={
                    link.href.startsWith('#')
                      ? (e) => {
                          e.preventDefault();
                          document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      : undefined
                  }
                  className="flex justify-between items-center font-[var(--fm)] text-[0.65rem] text-light-text-secondary dark:text-dark-text-secondary hover:text-matte-azure transition-colors py-0.5 group"
                >
                  {link.label}
                  {link.ext && <span className="opacity-30 text-[0.5em] ml-1 group-hover:opacity-100 transition-opacity">↗</span>}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* COPYRIGHT */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-3 border-b border-midnight/5 dark:border-periwinkle/5 font-[var(--fm)] text-[0.55rem] tracking-[0.12em] text-light-text-muted dark:text-dark-text-muted uppercase gap-2">
        <span>© 2026 · All rights reserved by Nevinas</span>
        <span className="text-light-text-tertiary dark:text-dark-text-tertiary">異世界 出身 · Isekai</span>
      </div>

      {/* BIG WORD */}
      <div className="p-4 md:p-8 pt-6 relative flex items-end justify-center sm:justify-between overflow-hidden">
        {/* Corners */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-matte-royal hidden sm:block" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-matte-royal hidden sm:block" />
        <div className="absolute bottom-0 left-6 w-3 h-3 border-b-2 border-l-2 border-matte-royal hidden sm:block" />
        <div className="absolute bottom-0 right-6 w-3 h-3 border-b-2 border-r-2 border-matte-royal hidden sm:block" />
        
        <div 
          className="font-[var(--fd)] font-black tracking-[-0.06em] leading-[0.88] uppercase text-light-text dark:text-dark-text text-[clamp(4.5rem,14vw,13rem)]"
        >
          ネヴィ<span className="text-matte-royal">ナス</span>
        </div>
      </div>

    </div>
  );
};

export default FaqNewsFooter;
