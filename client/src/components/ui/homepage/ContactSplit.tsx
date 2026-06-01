import React from 'react';
import { motion } from 'framer-motion';

const ContactSplit: React.FC = () => {
  return (
    <div id="contact-split" className="w-full bg-[#13141e] text-white flex flex-col md:flex-row min-h-screen">
      
      {/* LEFT: Heading + Form */}
      <div className="w-full md:w-[60%] p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="font-[var(--fd)] text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4">
            Nocturnal<br/>Contact<span className="text-[#5983fc]">.</span>
          </div>
          <div className="font-[var(--fj)] text-lg text-white/40 tracking-widest">
            お問い合わせ
          </div>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 max-w-xl"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Form Fields */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-white/10 pb-2 relative group">
            <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-white/30 w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-[#5983fc] transition-colors">Name</div>
            <input type="text" placeholder="Your autograph, please" className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-white/20" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-white/10 pb-2 relative group">
            <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-white/30 w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-[#5983fc] transition-colors">Email</div>
            <div className="flex items-center w-full">
              <span className="text-xl sm:text-2xl font-light text-white/20 mr-1">@</span>
              <input type="email" placeholder="your@email.com" className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-white/20" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 border-b border-white/10 pb-2 relative group">
            <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-white/30 w-24 shrink-0 mt-3 group-focus-within:text-[#5983fc] transition-colors">Project</div>
            <textarea placeholder="Your project idea..." rows={2} className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-white/20 resize-none pt-1" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 border-b border-white/10 pb-2 relative group">
            <div className="font-[var(--fm)] text-xs tracking-widest uppercase text-white/30 w-24 shrink-0 mt-2 sm:mt-0 group-focus-within:text-[#5983fc] transition-colors">Deadline</div>
            <input type="text" placeholder="Your deadline" className="bg-transparent border-none outline-none text-xl sm:text-2xl font-light w-full placeholder:text-white/20" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">
            <div className="font-[var(--fm)] text-[0.65rem] leading-relaxed text-white/30">
              Following fields need to be filled in:<br/>
              <span className="text-white/60">Name, Email, Project idea, Deadline.</span>
            </div>
            <button className="bg-white hover:bg-[#5983fc] text-black hover:text-white px-8 py-4 rounded-full font-[var(--fm)] text-xs font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap">
              Submit Now →
            </button>
          </div>
        </motion.form>
      </div>

      {/* RIGHT: Alternatives + Ambient */}
      <div className="w-full md:w-[40%] bg-black/20 p-8 sm:p-12 lg:p-20 relative overflow-hidden flex flex-col">
        {/* Ambient Nebula */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen" 
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 80% 20%, rgba(89,131,252,0.22), transparent 65%),
              radial-gradient(ellipse 50% 70% at 20% 80%, rgba(150,78,194,0.15), transparent 60%),
              radial-gradient(ellipse 40% 40% at 60% 60%, rgba(255,123,191,0.08), transparent 55%)
            `
          }}
        />

        <div className="font-[var(--fm)] text-[0.65rem] tracking-[0.28em] uppercase text-white/20 mb-12 relative z-10 shrink-0">
          — Connect with Nevinas
        </div>

        {/* Alternatives List */}
        <motion.div 
          className="flex flex-col justify-end flex-1 relative z-10"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="font-[var(--fm)] text-[0.65rem] tracking-[0.22em] uppercase text-white/20 mb-4 pt-4 border-t border-white/5">
            Alternatives
          </div>
          
          {[
            { name: "hello@nevinas.dev", action: "COPY", icon: "svg-copy" },
            { name: "GitHub", action: "VISIT ↗" },
            { name: "LinkedIn", action: "VISIT ↗" },
            { name: "Resume PDF", action: "DOWNLOAD ↓" },
            { name: "Twitter / X", action: "FOLLOW ↗" }
          ].map((alt, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 cursor-pointer group transition-all duration-200 hover:pl-2">
              <div className="font-[var(--fd)] text-xl sm:text-2xl font-light tracking-tight text-white/60 group-hover:text-white transition-colors">
                {alt.name}
              </div>
              <div className="font-[var(--fm)] text-[0.65rem] tracking-[0.14em] uppercase text-white/20 group-hover:text-[#5983fc] transition-colors flex items-center gap-2">
                {alt.action}
                {alt.icon === 'svg-copy' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Ambient Kanji */}
        <div className="absolute -bottom-8 -right-4 font-[var(--fj)] text-[clamp(8rem,18vw,16rem)] font-light leading-none text-white/[0.025] tracking-[-0.05em] select-none pointer-events-none mix-blend-overlay">
          連絡
        </div>
      </div>
      
    </div>
  );
};

export default ContactSplit;
