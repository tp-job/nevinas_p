import { PORTFOLIO_SCROLL } from "@/lib/portfolioScroll";

type Props = {
  slideCount: number;
  activeIndex: number;
  progressPercent: number;
  current: number;
  isLight: boolean;
  showScrollLabel: boolean;
  showHint: boolean;
  fps: number;
};

export default function PortfolioHUD({
  slideCount,
  activeIndex,
  progressPercent,
  current,
  isLight,
  showScrollLabel,
  showHint,
  fps,
}: Props) {
  const pctColor = isLight ? "rgba(20,18,16,.45)" : "rgba(156,163,175,.45)";
  const scColor = isLight ? "rgba(20,18,16,.35)" : "rgba(156,163,175,.35)";
  const dbgColor = isLight ? "rgba(20,18,16,.3)" : "rgba(156,163,175,.35)";
  const dbgDot = isLight ? "rgba(20,18,16,.25)" : "rgba(89,131,252,.35)";

  return (
    <>
      <div id="pbar" style={{ width: `${progressPercent}%` }} />
      <div id="pct" style={{ color: pctColor }}>
        {progressPercent}%
      </div>
      <div id="dbg">
        <div className="dv" style={{ color: dbgColor }}>
          FPS: {fps}
        </div>
        <div className="dd" style={{ background: dbgDot }} />
        <div className="dv" style={{ color: dbgColor }}>
          TOP: {Math.round(current * PORTFOLIO_SCROLL.VIRT_H)} PX
        </div>
      </div>
      <div id="scroll-txt" className={showScrollLabel ? "show" : ""}>
        SCROLL SMOOTHLY
      </div>
      <div id="dots">
        {Array.from({ length: slideCount }, (_, i) => (
          <div
            key={i}
            className={`dot${i === activeIndex ? " on" : ""}${isLight ? " light-dot" : ""}`}
          />
        ))}
      </div>
      <div id="sc" style={{ color: scColor }}>
        {activeIndex + 1} / {slideCount}
      </div>
      <div id="hint" style={{ opacity: showHint ? 1 : 0 }}>
        <div className="hl" />
        <span>Scroll to play</span>
      </div>
    </>
  );
}
