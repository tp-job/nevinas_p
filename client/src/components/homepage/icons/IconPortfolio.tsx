import React from 'react';

const GOLD   = '#c4963c';
const GOLDLT = '#ddb96a';
const WHITE  = 'rgba(245,240,230,0.55)';

const base: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'visible',
};

/* 05 — Portfolio / 作品と記録 */
const IconPortfolio: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" style={base} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD}/>
        <stop offset="100%" stopColor={GOLDLT} stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    {/* Folder */}
    <path d="M 40,80 L 40,152 Q 40,160 48,160 L 152,160 Q 160,160 160,152 L 160,88 Q 160,80 152,80 L 104,80 L 96,68 L 48,68 Q 40,68 40,76 Z"
      stroke="url(#pg1)" strokeWidth="1.4"/>
    {/* Lines — document content */}
    <line x1="60" y1="108" x2="140" y2="108" stroke={WHITE} strokeWidth="0.8"/>
    <line x1="60" y1="120" x2="130" y2="120" stroke={WHITE} strokeWidth="0.8"/>
    <line x1="60" y1="132" x2="118" y2="132" stroke={WHITE} strokeWidth="0.8"/>
    {/* Corner fold */}
    <path d="M 138,80 L 138,100 L 158,100" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.5"/>
    {/* Star accent */}
    <circle cx="100" cy="86" r="3" fill={GOLD}/>
  </svg>
);
export default IconPortfolio;
