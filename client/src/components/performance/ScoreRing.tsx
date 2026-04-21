import type { FC } from "react";
interface ScoreRingProps {
  score: number;
  label: string;
  color: string;
  size?: number;
}
const ScoreRing: FC<ScoreRingProps> = ({ score, label, color, size = 120 }) => {
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
          <span className="text-2xl font-extrabold text-light-text dark:text-dark-text">
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
