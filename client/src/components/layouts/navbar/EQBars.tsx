import type { FC } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design System §15.4 — EQ Bars
// Quick Ref: "Music pill bg: #0A0F19 / bars #C8CDEB"
// Gradient: Periwinkle #C8CDEB → Cool Gray #878CB4 (vertical)
// @keyframes eq: from{height:3px} to{height:11px} (DS globals.css)
// ─────────────────────────────────────────────────────────────────────────────
const EQBars: FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const delays = [0, 0.05, 0.1, 0.12, 0.18];
  return (
    <div className="flex items-end gap-[2.5px] h-[14px]" aria-hidden="true">
      {delays.map((d, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full"
          style={{
            background: "linear-gradient(180deg, var(--color-periwinkle) 0%, var(--color-cool) 100%)",
            height: isPlaying ? undefined : "3px",
            animation: isPlaying
              ? `eq .7s ease-in-out ${d}s infinite alternate`
              : "none",
          }}
        />
      ))}
    </div>
  );
};

export default EQBars;
