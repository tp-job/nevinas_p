import type { FC } from "react";
export interface ChartTooltipPayloadEntry {
  name: string;
  value: number | string;
  color?: string;
}
interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadEntry[];
  label?: string;
}
const ChartTooltip: FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl bg-light-surface/95 dark:bg-dark-bg/95 border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
      {" "}
      {label != null && (
        <p className="text-xs font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary">
          {label}
        </p>
      )}{" "}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          {" "}
          {entry.color != null && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
          )}{" "}
          <span className="opacity-70">{entry.name}:</span>{" "}
          <span className="font-medium">{entry.value}</span>{" "}
        </div>
      ))}{" "}
    </div>
  );
};
export default ChartTooltip;
