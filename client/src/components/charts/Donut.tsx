import type { FC } from "react";

/**
 * The Languages donut, without recharts.
 *
 * A donut is a single circle with a dashed stroke: each segment is one
 * `stroke-dasharray` arc rotated to start where the previous one ended. That is
 * a handful of lines of SVG, and it is the last thing keeping recharts on the
 * Dashboard route.
 *
 * The gap between segments is drawn as a real gap in the dash pattern rather
 * than a stroke of the background colour, so it stays correct on any surface —
 * the card behind it is translucent in both themes.
 */

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

export interface DonutProps {
  segments: DonutSegment[];
  /** Overall square size in px. */
  size?: number;
  /** Inner and outer radius, in px, matching the previous recharts config. */
  innerRadius?: number;
  outerRadius?: number;
  /** Gap between segments, in degrees. */
  padAngle?: number;
  ariaLabel: string;
}

const Donut: FC<DonutProps> = ({
  segments,
  size = 160,
  innerRadius = 50,
  outerRadius = 75,
  padAngle = 3,
  ariaLabel,
}) => {
  const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0);
  if (total <= 0) return null;

  // Stroke the midline of the ring; the stroke's own width gives it thickness.
  const radius = (innerRadius + outerRadius) / 2;
  const strokeWidth = outerRadius - innerRadius;
  const circumference = 2 * Math.PI * radius;
  const gap = (padAngle / 360) * circumference;

  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((s) => {
          const fraction = (Number(s.value) || 0) / total;
          const arc = fraction * circumference;
          // Never let the gap eat a segment smaller than it.
          const drawn = Math.max(arc - gap, 0.5);
          const dash = `${drawn} ${circumference - drawn}`;
          const thisOffset = offset;
          offset += arc;

          return (
            <circle
              key={s.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
              strokeDashoffset={-thisOffset}
            >
              <title>{`${s.name} — ${Math.round(fraction * 100)}%`}</title>
            </circle>
          );
        })}
      </g>
    </svg>
  );
};

export default Donut;
