import React from 'react';

const GOLD   = '#c4963c';
const GOLDLT = '#ddb96a';
const WHITE  = 'rgba(245,240,230,0.55)';

const base: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'visible',
};

/* 02 — Web / Web の世界観 */
const IconWeb: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" style={base} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD}/>
        <stop offset="100%" stopColor={GOLDLT} stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    {/* Globe outline */}
    <circle cx="100" cy="100" r="70" stroke="url(#wg1)" strokeWidth="1"/>
    {/* Meridians */}
    <ellipse cx="100" cy="100" rx="32" ry="70" stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.5"/>
    <ellipse cx="100" cy="100" rx="56" ry="70" stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.3"/>
    {/* Latitude bands */}
    <path d="M 30,100 Q 100,80 170,100" stroke={WHITE} strokeWidth="0.6"/>
    <path d="M 38,72  Q 100,56 162,72"  stroke={WHITE} strokeWidth="0.4" strokeOpacity="0.5"/>
    <path d="M 38,128 Q 100,144 162,128" stroke={WHITE} strokeWidth="0.4" strokeOpacity="0.5"/>
    {/* Cursor dot */}
    <circle cx="126" cy="78" r="5" fill={GOLD}/>
    <circle cx="126" cy="78" r="10" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.5"/>
  </svg>
);
export default IconWeb;
