import React from 'react';

const GOLD   = '#c4963c';
const GOLDLT = '#ddb96a';
const WHITE  = 'rgba(245,240,230,0.55)';

const base: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'visible',
};

/* 04 — Interactive / 遊びと没入感 */
const IconInteractive: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" style={base} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ig1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={GOLD}/>
        <stop offset="100%" stopColor={GOLDLT} stopOpacity="0.4"/>
      </linearGradient>
    </defs>
    {/* Controller body */}
    <rect x="36" y="72" width="128" height="76" rx="38" stroke="url(#ig1)" strokeWidth="1.5"/>
    {/* D-pad */}
    <rect x="60" y="98" width="8"  height="24" rx="2" fill={GOLD} fillOpacity="0.6"/>
    <rect x="52" y="106" width="24" height="8" rx="2" fill={GOLD} fillOpacity="0.6"/>
    {/* Buttons */}
    <circle cx="132" cy="100" r="6" stroke={GOLDLT} strokeWidth="1.2"/>
    <circle cx="148" cy="110" r="6" stroke={GOLDLT} strokeWidth="1.2"/>
    <circle cx="132" cy="120" r="6" stroke={GOLDLT} strokeWidth="1.2"/>
    <circle cx="116" cy="110" r="6" stroke={GOLDLT} strokeWidth="1.2"/>
    {/* Center */}
    <circle cx="100" cy="110" r="4" fill={GOLD} fillOpacity="0.4"/>
    {/* Grip shadow hint */}
    <path d="M 64,148 Q 36,160 36,110" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.2"/>
    <path d="M 136,148 Q 164,160 164,110" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.2"/>
  </svg>
);
export default IconInteractive;
