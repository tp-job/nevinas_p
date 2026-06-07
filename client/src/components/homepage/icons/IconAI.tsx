import React from 'react';

const GOLD   = '#c4963c';
const GOLDLT = '#ddb96a';
const WHITE  = 'rgba(245,240,230,0.55)';

const base: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'visible',
};

/* 03 — AI / AI の知恵 */
const IconAI: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" style={base} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ag1" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={GOLD}   stopOpacity="0.15"/>
        <stop offset="100%" stopColor={GOLD}   stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#ag1)"/>
    {/* Neural nodes */}
    {[
      [100,100],[60,60],[140,60],[60,140],[140,140],
      [100,44],[100,156],[44,100],[156,100],
    ].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r={i===0?7:4} fill={i===0?GOLD:GOLDLT} fillOpacity={i===0?1:0.7}/>
    ))}
    {/* Connections */}
    {[
      [100,100,60,60],[100,100,140,60],[100,100,60,140],[100,100,140,140],
      [100,100,100,44],[100,100,100,156],[100,100,44,100],[100,100,156,100],
      [60,60,100,44],[140,60,100,44],[60,60,44,100],[60,140,44,100],
      [140,60,156,100],[140,140,156,100],[60,140,100,156],[140,140,100,156],
    ].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.35"/>
    ))}
    {/* Outer ring */}
    <circle cx="100" cy="100" r="72" stroke={GOLD} strokeWidth="0.5"
      strokeDasharray="3 8" strokeOpacity="0.4"/>
  </svg>
);
export default IconAI;
