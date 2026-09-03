import type { FC } from "react";
import { useChartPalette } from "@/hooks/useChartPalette";

/**
 * A Lighthouse score as a ring.
 *
 * The colour used to arrive as a prop, from a hardcoded hex on each entry in
 * `data/performance.ts` — four fixed category hues (#0f9d58, #5983FC, #964EC2,
 * #f4b400), off-palette, and a second label for categories the text beside them
 * already names.
 *
 * It is derived from the score now, on Lighthouse's own banding: >=90 passes,
 * 50-89 needs work, below 50 fails. That makes the colour say something the
 * number alone does not read at a glance, and it comes from semantic tokens, so
 * a palette change reaches it.
 */
interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
}
const ScoreRing: FC<ScoreRingProps> = ({ score, label, size = 120 }) => {
  const palette = useChartPalette();
  // Lighthouse's own thresholds, not invented ones.
  const color =
    score >= 90
      ? palette.positive
      : score >= 50
        ? palette.warning
        : palette.accent;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = (score / 100) * circumference;
  const center = size / 2;
  return (
    <div className="flex flex-col items-center gap-2">
      {" "}
      <div className="relative" style={{ width: size, height: size }}>
        {" "}
        <svg width={size} height={size} className="-rotate-90">
          {" "}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-light-border dark:stroke-dark-surface"
          />{" "}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />{" "}
        </svg>{" "}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {" "}
          <span className="text-2xl font-medium text-light-text dark:text-dark-text">
            {score}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <span className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>{" "}
    </div>
  );
};
export default ScoreRing;
