import type { FC } from "react";
import { DataServices } from "@/data/HomeData";

import webIcon from "@/assets/image/noubackground/web-icon.png";
import codeIcon from "@/assets/image/noubackground/code-icon.png";

const Services: FC = () => {
  return (
    <div id="services" className="w-full px-[8%] py-20 scroll-mt-20 flex flex-col items-center">
      <div className="mb-16 flex flex-col items-center text-center">
        {/* Eyebrow — label style */}
        <p className="text-xs font-medium tracking-widest uppercase mb-2 text-text-secondary">
          Specializations
        </p>

        {/* Main title — headline-lg style (normal weight) */}
        <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-text-primary mb-1">
          My Services
        </h2>

        {/* Subtitle — jp-caption style (zen font, light weight) */}
        <h3 className="font-zen text-xl font-light tracking-wide text-text-secondary">
          Professional Expertise
        </h3>
        
        <div className="w-12 h-1 bg-gradient-to-r from-haze to-cool rounded-full mt-6 opacity-60" />
      </div>

      {/* Bento Grid Container */}
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
        
        {/* Large Card (Index 0) */}
        <div className="glass-premium md:col-span-1 md:row-span-2 p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
          {/* Background web icon */}
          <div 
            className="absolute right-[-15px] bottom-[-15px] w-28 h-28 opacity-[0.08] pointer-events-none select-none z-0 bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: `url(${webIcon})` }}
          />

          <div className="relative z-10">
            {/* Icon Gem style icon box */}
            <div className="inline-flex p-3 rounded-xl mb-6 bg-gradient-to-br from-haze to-haze-deep shadow-[0_6px_18px_rgba(70,80,120,0.28)] group-hover:scale-110 transition-transform duration-500">
              <svg className="w-6 h-6 text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-normal text-text-primary mb-4">{DataServices[0].title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary mb-6">
              {DataServices[0].detail}
            </p>
            <ul className="space-y-2 text-xs text-text-secondary opacity-70">
              <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-periwinkle/50 mr-2"></span> Responsive Design</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-periwinkle/50 mr-2"></span> Performance Optimization</li>
            </ul>
          </div>
          
          <a href="#" className="relative z-10 inline-flex items-center text-xs font-medium text-haze-deep hover:opacity-80 transition-all mt-8 uppercase tracking-widest">
            VIEW DETAILS 
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Medium Card (Index 1) */}
        <div className="glass-premium md:col-span-2 p-8 flex flex-col justify-center group transition-all duration-300 relative overflow-hidden">
          {/* Background code icon */}
          <div 
            className="absolute right-[-10px] bottom-[-20px] w-28 h-28 opacity-[0.07] pointer-events-none select-none z-0 bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: `url(${codeIcon})` }}
          />

          <div className="relative z-10 flex items-start gap-6">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-haze to-haze-deep shadow-[0_6px_18px_rgba(70,80,120,0.28)] shrink-0 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-6 h-6 text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-normal text-text-primary mb-2">{DataServices[1].title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {DataServices[1].detail}
              </p>
            </div>
          </div>
        </div>

        {/* Small Card 1 (Index 2) */}
        <div className="glass-premium p-6 group transition-all duration-300">
          <div className="inline-flex p-2.5 rounded-lg mb-4 bg-gradient-to-br from-haze to-haze-deep shadow-[0_6px_18px_rgba(70,80,120,0.28)] group-hover:scale-110 transition-transform duration-500">
            <svg className="w-5 h-5 text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
          </div>
          <h3 className="text-lg font-normal text-text-primary mb-2">{DataServices[2].title}</h3>
          <p className="text-xs leading-normal text-text-secondary">
            {DataServices[2].detail}
          </p>
        </div>

        {/* Small Card 2 (Index 3) */}
        <div className="glass-premium p-6 group transition-all duration-300">
          <div className="inline-flex p-2.5 rounded-lg mb-4 bg-gradient-to-br from-haze to-haze-deep shadow-[0_6px_18px_rgba(70,80,120,0.28)] group-hover:scale-110 transition-transform duration-500">
            <svg className="w-5 h-5 text-dark-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-normal text-text-primary mb-2">{DataServices[3].title}</h3>
          <p className="text-xs leading-normal text-text-secondary">
            {DataServices[3].detail}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Services;


