import React from 'react';
import { motion } from 'framer-motion';
import styles from './AgencySection.module.css';

const AgencySection: React.FC = () => {
  return (
    <div className={styles.agencySlide}>
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        
        {/* ROW 1: Arrow + Nebula */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch h-[400px] sm:h-[500px]">
          <motion.div 
            className="flex flex-col justify-between items-center w-full md:w-[120px] shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <svg viewBox="0 0 200 200" fill="none" className="w-16 h-16 md:w-full md:h-auto opacity-80">
              <path d="M20 20 L180 20 L180 180" stroke="currentColor" strokeWidth="26" strokeLinecap="square" strokeLinejoin="miter"/>
              <path d="M20 20 L180 180" stroke="currentColor" strokeWidth="26" strokeLinecap="square"/>
            </svg>
            <div className={styles.arrowKanji}>
              道楽者
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 pointer-events-none z-10">
              <span className="absolute font-[var(--fj)] text-white/20 text-3xl sm:text-5xl" style={{top:'22%', left:'12%', animation: 'kjFloat 6s ease-in-out infinite'}}>異</span>
              <span className="absolute font-[var(--fj)] text-white/20 text-3xl sm:text-5xl" style={{top:'30%', left:'50%', animation: 'kjDrift 7s ease-in-out infinite 0.9s'}}>世</span>
              <span className="absolute font-[var(--fj)] text-white/20 text-3xl sm:text-5xl" style={{top:'55%', left:'28%', animation: 'kjFloat 8s ease-in-out infinite 1.8s'}}>界</span>
              <span className="absolute font-[var(--fj)] text-white/20 text-3xl sm:text-5xl" style={{top:'20%', left:'78%', animation: 'kjDrift 6.5s ease-in-out infinite 2.7s'}}>者</span>
              <span className="absolute font-[var(--fj)] text-white/20 text-xl sm:text-3xl" style={{top:'62%', left:'68%', animation: 'kjFloat 7.5s ease-in-out infinite 3.6s'}}>夢</span>
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 font-[var(--fm)] text-[0.55rem] tracking-[0.2em] text-white/50 border border-white/20 px-3 py-1 rounded-full z-20 backdrop-blur-sm">
              HUMAN-FIRST ✦
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Desc 3-col */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-black/10 pt-10">
          <motion.div className="text-[0.95rem] leading-relaxed font-medium" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
            Frontend-Led Engineering Portfolio<br/>
            — Operating from <span className="font-[var(--fj)] text-[#5983FC]">異世界</span> (Isekai).
          </motion.div>
          <motion.div className="text-[0.95rem] leading-relaxed font-medium" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}}>
            Place where well-crafted web<br/>
            experiences are born.
          </motion.div>
          <motion.div className="text-[0.95rem] leading-relaxed font-medium" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}}>
            Building end-to-end web systems<br/>
            where code meets culture.
          </motion.div>
        </div>

        {/* ROW 3: Year */}
        <div className={styles.year}>
          ©2024–2026
        </div>

        {/* ROW 4: Statement + Mood Ring */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
          <motion.div 
            className="flex-1 max-w-4xl text-[clamp(1.65rem,3.8vw,3.55rem)] font-light tracking-[-0.03em] leading-[1.1]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            A <span className="px-2">fun<sup className="text-[0.32em] text-black/40 align-super ml-1 font-normal not-italic tracking-normal">(5+)</sup></span> frontend developer committed to 
            <span className="inline-flex items-center gap-1 mx-2 align-middle">
              <svg width="0.72em" height="0.72em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            exceptional design and the highest
            <span className="inline-flex items-center gap-1 mx-2 align-middle">
              <svg className="animate-[spinGear_5s_linear_infinite]" width="0.65em" height="0.65em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
            </span>
            development standards.
            <span className="inline-block text-[0.45em] ml-2 opacity-45 animate-[arrowBob_2.2s_ease-in-out_infinite] align-middle">↓</span>
            
            <div className="mt-8">
              <button className="text-[0.65rem] font-[var(--fm)] tracking-[0.2em] uppercase border border-black/20 rounded-full px-6 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-2 group">
                Get in touch <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-48 sm:w-64 shrink-0 flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3E60C1] to-[#5983FC]" />
            <div className="text-[0.6rem] tracking-[0.2em] text-black/40">異世界 / ISEKAI</div>
          </motion.div>
        </div>

        {/* ROW 5: Awards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-black/10 pt-10">
          {[
            { title: "Best Frontend Experience\nof the Year", year: "2026", src: "AWWWARDS", logo: "W." },
            { title: "'Developer of the Year'\nNominee", year: "2025", src: "CSS DESIGN AWARDS", logo: "◈" },
            { title: "'Studio of the Year'\nNominee", year: "2025", src: "THE WEBBY AWARDS", logo: "彡", logoFont: 'var(--fj)' }
          ].map((award, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col justify-between p-6 border border-black/5 bg-white/40 hover:bg-white/80 transition-colors rounded-xl min-h-[160px] cursor-pointer"
              initial={{opacity:0, y:20}} 
              whileInView={{opacity:1, y:0}} 
              viewport={{once:true}} 
              transition={{delay: i * 0.1}}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-[0.85rem] font-medium leading-snug whitespace-pre-line group-hover:text-[#5983FC] transition-colors">{award.title}</div>
                <div className="text-[0.55rem] font-[var(--fm)] text-black/30 border border-black/10 px-2 py-0.5 rounded-full">{award.year}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-[0.5rem] font-[var(--fm)] tracking-[0.15em] text-black/40 uppercase">{award.src}</div>
                <div className="text-xl font-light text-black/20 group-hover:text-black/60 transition-colors" style={{fontFamily: award.logoFont || 'inherit'}}>{award.logo}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AgencySection;
