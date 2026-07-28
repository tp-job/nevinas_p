/**
 * Loading.tsx — Nocturnal Atelier DS v3.2
 * Aesthetic: Neo-Tokyo Operational
 *            Japan × Sci-Fi × Modern
 *            Ghost in the Shell · NERV HUD · Wabi-Sabi space
 *
 * Fonts (add to next/font in layout.tsx):
 *   Inter 300/400/600 — DS rule (Latin)
 *   Noto Sans JP 300/400 — Japanese text
 *
 * In project: replace inline LaserFlow with import from ./LaserFlow
 */

import { useState, useEffect, useId, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, Easing } from "framer-motion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/* ────────────────────────────────────────
   DS v3.2 TOKENS
──────────────────────────────────────── */
const C = {
  charcoal:       "#0A0F19",
  midnight:       "#1E233C",
  haze:           "#465078",
  hazeLight:      "#6B739A",
  cool:           "#878CB4",
  periwinkle:     "#C8CDEB",
  periwinklePale: "#E8EAF5",
  // sub-palette — effects only
  subFrench:      "#B8BED7",
  subCool:        "#AFAECC",
  subMount:       "#85758F",
  subEV1:         "#524E68",
  subEV2:         "#44405A",
};

/* DS Motion (Section 14 / 17) */
const EASE_SPRING: Easing = [0.22, 1, 0.36, 1];
const EASE_OUT:    Easing = [0.4,  0, 0.2,  1];

const V: Record<string, Variants> = {
  fadeUp: {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SPRING } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.50, ease: "easeOut" } },
  },
  slideDown: {
    hidden:  { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SPRING } },
  },
  stagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.20 } },
  },
};

/* Japanese phase labels */
const PHASES = [
  { en: "SYSTEM INIT",    jp: "システム初期化",    kanji: "起", min: 0   },
  { en: "LOADING ASSETS", jp: "アセット読込中",     kanji: "動", min: 18  },
  { en: "CALIBRATING",    jp: "キャリブレーション", kanji: "調", min: 52  },
  { en: "FINALIZING UI",  jp: "UI最終調整",         kanji: "整", min: 82  },
  { en: "COMPLETE",       jp: "完了",               kanji: "完", min: 100 },
];

/* ────────────────────────────────────────
   LaserFlow WebGL background
   Lazy-loaded so three.js is NOT part of the loading screen's initial
   bundle — the HUD shell paints instantly and the WebGL enhances in
   progressively once three.js has downloaded.
──────────────────────────────────────── */
const LaserFlow = lazy(() => import("@/components/effect/LaserFlow"));

/**
 * The WebGL beam is allowed exactly ONCE per page load.
 *
 * This component is the router's Suspense fallback, so it mounts and unmounts
 * on every lazy route transition. Each mount allocated a full-screen WebGL
 * context and each unmount tore it down; after a handful of navigations Chrome
 * counted enough page-caused context losses to blacklist the document, and
 * every subsequent context — including the homepage's LiquidEther backdrop —
 * failed with "Web page caused context loss and was blocked". That threw out of
 * the renderer constructor, hit the ErrorBoundary, and replaced the site with
 * the 500 page.
 *
 * The guard in three/webglGuard.ts now makes the failure non-fatal; this flag
 * stops us provoking it in the first place. Cold boot still gets the full
 * treatment — mid-session route spinners flash for a few hundred milliseconds
 * and never needed a shader anyway.
 */
let beamBudgetSpent = false;

/* ════════════════════════════════════════
   ATOMIC HUD COMPONENTS
════════════════════════════════════════ */

/* Corner targeting brackets — classic sci-fi HUD reticle */
function CornerBrackets({ size = 44, opacity = 0.30, visible = false }) {
  const id = useId();
  const path = `M2 ${size - 2} L2 2 L${size - 2} 2`;
  const corners = [
    { pos: { top: 22, left: 22 },    sx:  1, sy:  1 },
    { pos: { top: 22, right: 22 },   sx: -1, sy:  1 },
    { pos: { bottom: 22, left: 22 }, sx:  1, sy: -1 },
    { pos: { bottom: 22, right: 22 },sx: -1, sy: -1 },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? opacity : 0 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
          style={{ position: "absolute", ...c.pos, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
               style={{ display: "block", transform: `scale(${c.sx}, ${c.sy})` }}>
            <path d={path} stroke={C.periwinkle} strokeWidth="1" strokeLinecap="square" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* WaveformSVG — Mountbatten → EV1 (DS Section 15.4) */
function WaveformSVG({ active = true }) {
  const id = useId();
  const DELAYS = [0, 0.06, 0.11, 0.15, 0.20];
  return (
    <svg width={5*6} height={14} viewBox={`0 0 30 14`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-eq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.subMount} />
          <stop offset="100%" stopColor={C.subEV1}   />
        </linearGradient>
      </defs>
      {Array.from({length:5}).map((_,i)=>(
        <rect key={i} x={i*6} y="2" width="3" height="10" rx="1"
              fill={`url(#${id}-eq)`}
              style={active ? {animation:`na-eq .65s ease-in-out ${DELAYS[i]}s infinite alternate`} : undefined} />
      ))}
    </svg>
  );
}

/* Live Clock — JST/UTC */
function ClockDisplay() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString("ja-JP", { hour12: false, hour:"2-digit", minute:"2-digit", second:"2-digit" });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("ja-JP", { hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>;
}

/* Aurora band divider */
function AuroraBand() {
  const id = useId();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }} aria-hidden="true">
      <svg width="100%" height="1" style={{ flex: 1, display: "block" }}>
        <defs>
          <linearGradient id={`${id}-ab`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={C.periwinkle} stopOpacity="0.00" />
            <stop offset="18%"  stopColor={C.periwinkle} stopOpacity="0.40" />
            <stop offset="62%"  stopColor={C.subMount}   stopOpacity="0.22" />
            <stop offset="100%" stopColor={C.midnight}   stopOpacity="0.00" />
          </linearGradient>
        </defs>
        <rect width="100%" height="1" fill={`url(#${id}-ab)`} />
      </svg>
      {/* HUD tick mark at end */}
      <span style={{ fontSize: "8px", color: `rgba(200,205,235,0.25)`, letterSpacing: 0, lineHeight: 1 }}>
        ›
      </span>
    </div>
  );
}

/* Progress bar — DS aurora gradient, 1.5px */
function ProgressBar({ progress }) {
  return (
    <div role="progressbar" aria-valuenow={Math.round(progress)}
         aria-valuemin={0} aria-valuemax={100} aria-label="Loading progress"
         style={{ width:"100%", height:"1.5px",
                  background:"rgba(200,205,235,0.07)",
                  borderRadius:"1px", position:"relative", overflow:"hidden" }}>
      <motion.div
        style={{
          position:"absolute", top:0, left:0, height:"100%", borderRadius:"1px",
          background:`linear-gradient(90deg, ${C.charcoal} 0%, ${C.haze} 35%, ${C.cool} 65%, ${C.periwinkle} 100%)`,
        }}
        initial={{ width:"0%" }}
        animate={{ width:`${progress}%` }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />
    </div>
  );
}

/* Scan line — atmospheric sci-fi detail */
function ScanLine() {
  return (
    <div aria-hidden="true"
         style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", opacity:0.022 }}>
      <div style={{
        position:"absolute", left:0, right:0, height:"3px",
        background:`linear-gradient(to bottom, transparent, rgba(200,205,235,0.9), transparent)`,
        animation:"na-scan 14s linear infinite",
      }} />
    </div>
  );
}

/* ════════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════════ */
export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready,    setReady   ] = useState(false);
  const [done,     setDone    ] = useState(false);
  const timerRef = useRef(null);
  const tier = useDeviceCapability();

  /* Claim the one-per-page-load beam slot, if it's still available.

     A ref rather than useState: StrictMode double-invokes a state initializer,
     which would let the second call see the flag its own first call had just
     set and decide the budget was already gone. The ref makes the claim
     idempotent per instance. */
  const beamClaimRef = useRef<boolean | null>(null);
  if (beamClaimRef.current === null) {
    beamClaimRef.current = !beamBudgetSpent;
    beamBudgetSpent = true;
  }
  const beamAllowed = beamClaimRef.current;

  /* Inject keyframes */
  useEffect(() => {
    /* NOTE: this used to append a <link> to fonts.googleapis.com for
       Noto Sans JP. This component is the router's Suspense fallback, so that
       fired on EVERY cold visit — adding a third-party DNS + TLS + CSS
       round trip to the critical path purely to style a few kana on a screen
       that is visible for a second or two. The JP stack below now resolves to
       installed system fonts, which every target OS ships. */
    /* Keyframes */
    if (!document.getElementById("__na-kf")) {
      const s = document.createElement("style");
      s.id = "__na-kf";
      s.textContent = `
        @keyframes na-eq    { from{height:3px;} to{height:11px;} }
        @keyframes na-scan  { 0%{top:-4px;} 100%{top:100%;} }
        @keyframes na-blink { 0%,100%{opacity:1;} 50%{opacity:0.12;} }
        @keyframes na-pulse { 0%,100%{opacity:0.55;transform:scale(1);}
                              50%{opacity:1;transform:scale(1.4);} }
        @keyframes na-glitch{
          0%,94%,100%{transform:translateX(0);}
          95%{transform:translateX(-2px);}
          97%{transform:translateX(2px);}
        }
      `;
      document.head.appendChild(s);
    }

    const rt = setTimeout(() => setReady(true), 80);

    /* Progress simulation */
    let p = 0;
    const tick = () => {
      const sp = p>90?0.25 : p>68?1.2 : p>38?2.4 : 4.0;
      p = Math.min(p + Math.random()*sp + 0.18, 100);
      setProgress(p);
      if (p >= 100) { setDone(true); if(onComplete) setTimeout(onComplete,720); return; }
      timerRef.current = setTimeout(tick, p>90?480 : p>68?240 : p>38?155:110);
    };
    timerRef.current = setTimeout(tick, 580);
    return () => { clearTimeout(rt); if(timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const phase = PHASES.reduce((acc,ph) => progress>=ph.min ? ph : acc, PHASES[0]);
  const pct   = Math.min(Math.round(progress), 100);

  /* Font stacks — system JP faces, no webfont download (see the note above).
     Covers macOS/iOS (Hiragino), Windows (Yu Gothic UI / Meiryo) and
     Android (Noto Sans CJK JP). */
  const JP =
    '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", ' +
    'Meiryo, "Noto Sans CJK JP", sans-serif';
  const EN = '"Inter", system-ui, sans-serif';

  return (
    <div role="status" aria-label="Loading" aria-busy={!done}
         style={{ position:"fixed", inset:0, zIndex:9000,
                  background:C.charcoal, fontFamily:EN, overflow:"hidden" }}>

      {/* ── 1. LaserFlow WebGL ──────────────────────────────────────────────
           Skipped entirely on low-tier devices (budget phones, data-saver,
           reduced-motion). This component is the router's Suspense fallback, so
           it renders while the app's own chunks are still downloading — mounting
           a full-screen three.js fragment shader here made the LOADING screen
           the most expensive thing on the critical path, pulling ~500 kB of
           three.js and saturating a weak GPU exactly when the device is most
           contended. The vignette and nebula layers below carry the same look
           without a WebGL context. */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0 }}>
        {tier === "high" && beamAllowed && (
        <Suspense fallback={null}>
          <LaserFlow
            color={C.periwinkle}
            horizontalBeamOffset={0}
            verticalBeamOffset={-0.02}
            verticalSizing={3.8}
            horizontalSizing={0.28}
            fogIntensity={0.35}
            fogScale={0.20}
            wispDensity={0.50}
            wispIntensity={3.5}
            wispSpeed={7}
            flowSpeed={0.22}
            flowStrength={0.22}
            decay={1.06}
            falloffStart={1.14}
            fogFallSpeed={0.38}
            mouseTiltStrength={0.06}
            mouseSmoothTime={0.20}
            style={{ width:"100%", height:"100%" }}
          />
        </Suspense>
        )}
      </div>

      {/* ── 2. Depth / atmosphere ───────────────────────────────── */}
      {/* Deep vignette */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 75% 75% at 50% 50%, transparent 25%, rgba(5,8,15,0.78) 100%)",
      }} />
      {/* Sub-palette nebula */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 55% 75% at 68% 38%, rgba(184,190,215,0.05), transparent 62%),
          radial-gradient(ellipse 40% 55% at 28% 72%, rgba(82,78,104,0.08),   transparent 56%)
        `,
      }} />

      {/* ── 3. Scan line ────────────────────────────────────────── */}
      <ScanLine />

      {/* ── 4. Corner targeting brackets ────────────────────────── */}
      <CornerBrackets visible={ready} />

      {/* ── 5. Top HUD bar ──────────────────────────────────────── */}
      <motion.div
        initial="hidden" animate={ready ? "visible" : "hidden"} variants={V.slideDown}
        style={{
          position:"absolute", top:0, left:0, right:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", height:"40px",
          borderBottom:"1px solid rgba(200,205,235,0.06)",
        }}
        aria-hidden="true"
      >
        {/* Left — system ID */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {/* Tri-dot sigil */}
          <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
            {[1,0.5,0.25].map((op,i) => (
              <div key={i} style={{ width:"3px", height:"3px", borderRadius:"50%",
                                    background:`rgba(200,205,235,${op})` }} />
            ))}
          </div>
          <span style={{ fontFamily:EN, fontSize:"0.58rem", fontWeight:600,
                         letterSpacing:"0.22em", textTransform:"uppercase",
                         color:`rgba(135,140,180,0.45)` }}>
            NA:SYS&nbsp;&nbsp;//&nbsp;&nbsp;起動シーケンス
          </span>
        </div>
        {/* Right — live clock + timezone */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px",
                      fontFamily:EN, fontSize:"0.58rem", fontWeight:400,
                      letterSpacing:"0.12em", color:`rgba(135,140,180,0.38)` }}>
          <ClockDisplay />
          <span style={{ opacity:0.5 }}>//</span>
          <span>JST</span>
        </div>
      </motion.div>

      {/* ── 6. Main content ─────────────────────────────────────── */}
      <div style={{ position:"absolute", inset:0,
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center" }}>

        {/* Large atmospheric kanji 夜 (night) — 夜 = Nocturnal */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%, -60%)",
          fontSize:"clamp(240px,35vw,340px)",
          fontFamily:JP, fontWeight:300,
          color:C.periwinklePale,
          opacity:0.025,
          lineHeight:1, userSelect:"none", pointerEvents:"none",
          letterSpacing:"-0.05em",
          animation:"na-glitch 8s ease-in-out infinite",
        }}>
          夜
        </div>

        <motion.div
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          variants={V.stagger}
          style={{
            position:"relative", zIndex:1,
            width:"clamp(300px, 46vw, 520px)",
          }}
        >
          {/* ── Status row ─────────────────────────────────────── */}
          <motion.div variants={V.fadeIn}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                     marginBottom:"2.8rem" }}>
            {/* Left: pulse dot + JP status */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span aria-hidden="true" style={{
                width:"5px", height:"5px", borderRadius:"50%", flexShrink:0,
                background: done ? C.periwinkle : C.subMount,
                animation: done ? "none" : "na-pulse 1.6s ease-in-out infinite",
              }} />
              <AnimatePresence mode="wait">
                <motion.span key={phase.jp}
                  initial={{opacity:0, x:-6}} animate={{opacity:1, x:0}} exit={{opacity:0, x:6}}
                  transition={{duration:0.3, ease:EASE_SPRING}}
                  style={{ fontFamily:JP, fontSize:"0.72rem", fontWeight:400,
                           color:`rgba(135,140,180,0.55)`, letterSpacing:"0.04em" }}>
                  {phase.jp}
                </motion.span>
              </AnimatePresence>
              {/* EN echo */}
              <span style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                             letterSpacing:"0.16em", textTransform:"uppercase",
                             color:`rgba(135,140,180,0.28)` }}>
                {phase.en}
              </span>
            </div>
            {/* Right: waveform */}
            <WaveformSVG active={!done} />
          </motion.div>

          {/* ── Headline block ─────────────────────────────────── */}
          <motion.div variants={V.fadeUp} style={{ marginBottom:"0.3rem" }}>
            {/* JP heading — Noto Sans JP, small, hazeLight */}
            <p style={{ margin:0, fontFamily:JP, fontSize:"1.05rem",
                        fontWeight:300, letterSpacing:"0.12em",
                        color:C.hazeLight, lineHeight:1.2 }}>
              ローディング
            </p>
          </motion.div>

          <motion.div variants={V.fadeUp} style={{ marginBottom:"0.5rem" }}>
            {/* EN heading — Inter 300, very large */}
            <h1 style={{ margin:0, fontFamily:EN,
                         fontSize:"clamp(3.2rem, 7vw, 5rem)",
                         fontWeight:300, letterSpacing:"-0.035em",
                         lineHeight:1.0, color:C.periwinklePale,
                         textShadow:"0 0 90px rgba(10,15,25,0.5)" }}>
              Loading
            </h1>
          </motion.div>

          {/* Sub-text — JP + EN */}
          <motion.div variants={V.fadeUp} style={{ marginBottom:"2.8rem" }}>
            <p style={{ margin:0, fontFamily:JP, fontSize:"0.72rem",
                        fontWeight:300, letterSpacing:"0.06em",
                        color:`rgba(135,140,180,0.50)`, lineHeight:1.8 }}>
              起動シーケンスを実行しています
              <span style={{ fontFamily:EN, fontSize:"0.68rem", fontWeight:300,
                             letterSpacing:"0.02em", marginLeft:"1em",
                             color:`rgba(135,140,180,0.30)` }}>
                — please wait.
              </span>
            </p>
          </motion.div>

          {/* ── Aurora band ─────────────────────────────────────── */}
          <motion.div variants={V.fadeIn} style={{ marginBottom:"1.6rem" }}>
            <AuroraBand />
          </motion.div>

          {/* ── Progress section ────────────────────────────────── */}
          <motion.div variants={V.fadeUp}>
            {/* Phase row */}
            <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"baseline", marginBottom:"10px" }}>
              {/* Phase kanji accent */}
              <div style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
                <AnimatePresence mode="wait">
                  <motion.span key={phase.kanji}
                    initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
                    transition={{duration:0.25, ease:EASE_SPRING}}
                    style={{ fontFamily:JP, fontSize:"0.9rem", fontWeight:300,
                             color:`rgba(200,205,235,0.25)`, letterSpacing:"0.08em" }}>
                    {phase.kanji}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span key={phase.jp + "2"}
                    initial={{opacity:0, x:-4}} animate={{opacity:1, x:0}} exit={{opacity:0, x:4}}
                    transition={{duration:0.28, ease:EASE_SPRING}}
                    style={{ fontFamily:EN, fontSize:"0.60rem", fontWeight:400,
                             letterSpacing:"0.18em", textTransform:"uppercase",
                             color:`rgba(135,140,180,0.40)` }}>
                    {phase.en}
                  </motion.span>
                </AnimatePresence>
              </div>
              {/* Percentage */}
              <span style={{ fontFamily:EN, fontSize:"0.88rem", fontWeight:300,
                             color: pct>=100 ? C.periwinklePale : `rgba(200,205,235,0.72)`,
                             fontVariantNumeric:"tabular-nums", letterSpacing:"0.02em",
                             transition:"color 0.4s ease" }}>
                {pct}
                <span style={{ fontSize:"0.60rem", fontWeight:300,
                               color:`rgba(200,205,235,0.40)`, marginLeft:"1px" }}>%</span>
              </span>
            </div>

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            {/* Tick marks */}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"7px" }}>
              {[0,25,50,75,100].map(m => (
                <span key={m} style={{
                  fontFamily:EN, fontSize:"0.55rem", fontWeight:400,
                  fontVariantNumeric:"tabular-nums",
                  color: progress>=m ? "rgba(200,205,235,0.22)" : "rgba(200,205,235,0.07)",
                  transition:"color 0.45s ease",
                }}>{m}</span>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ─────────────────────────────────────────── */}
          <motion.div variants={V.fadeIn}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                     marginTop:"2.8rem",
                     paddingTop:"1.2rem",
                     borderTop:"1px solid rgba(200,205,235,0.06)" }}>
            <span style={{ fontFamily:JP, fontSize:"0.65rem", fontWeight:300,
                           letterSpacing:"0.08em",
                           color:`rgba(135,140,180,0.32)` }}>
              ノクターナル アトリエ
            </span>
            <span style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                           letterSpacing:"0.14em",
                           color:`rgba(135,140,180,0.24)` }}>
              DS&thinsp;v3.2
            </span>
          </motion.div>

        </motion.div>

        {/* ── Complete prompt ─────────────────────────────────── */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}}
              transition={{duration:0.55, ease:EASE_SPRING}}
              style={{ position:"absolute",
                       bottom:"clamp(32px,5.5vh,56px)",
                       display:"flex", flexDirection:"column",
                       alignItems:"center", gap:"4px" }}
            >
              <p style={{ margin:0, fontFamily:JP, fontSize:"0.70rem", fontWeight:300,
                          letterSpacing:"0.08em",
                          color:`rgba(135,140,180,0.40)`,
                          animation:"na-blink 2s ease-in-out infinite" }}>
                キーを押してください
              </p>
              <p style={{ margin:0, fontFamily:EN, fontSize:"0.58rem", fontWeight:400,
                          letterSpacing:"0.22em", textTransform:"uppercase",
                          color:`rgba(135,140,180,0.25)`,
                          animation:"na-blink 2s ease-in-out infinite 0.15s" }}>
                Press any key to continue
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* /content */}

      {/* ── 7. Bottom HUD strip ─────────────────────────────────── */}
      <motion.div
        initial="hidden" animate={ready ? "visible" : "hidden"}
        variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.6,delay:1.0,ease:"easeOut"}} }}
        style={{
          position:"absolute", bottom:0, left:0, right:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"24px", height:"38px",
          borderTop:"1px solid rgba(200,205,235,0.05)",
        }}
        aria-hidden="true"
      >
        {["React 19", "Next.js 15", "Three.js r128"].map((label, i) => (
          <span key={i} style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                                  letterSpacing:"0.14em", textTransform:"uppercase",
                                  color:`rgba(135,140,180,0.22)` }}>
            {label}
          </span>
        ))}
      </motion.div>

    </div>
  );
}