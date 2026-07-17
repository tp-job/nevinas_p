import type { FC } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design System §15.5 — Mood Ring dot (sub-palette conic)
// Uses: Periwinkle(main) · French Gray · Mountbatten · EV1 · EV2 · back
// Animation: moodSpin 8s linear infinite (defined in DS globals.css)
// ─────────────────────────────────────────────────────────────────────────────
const MoodDot: FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    aria-hidden="true"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: [
        "conic-gradient(from 0deg,",
        "rgba(200,205,235,0.90),",   // Periwinkle (main)
        "rgba(184,190,215,0.85),",   // French Gray (sub)
        "rgba(133,117,143,0.90),",   // Mountbatten ★ (sub warm bridge)
        "rgba(82,78,104,0.85),",     // English Violet 1 (sub)
        "rgba(70,80,120,0.90),",     // Haze (main)
        "rgba(200,205,235,0.90))",   // back to Periwinkle
      ].join(" "),
      boxShadow:
        "0 0 10px rgba(200,205,235,0.22), 0 0 5px rgba(133,117,143,0.18)",
      animation: "moodSpin 8s linear infinite",
    }}
  />
);

export default MoodDot;
