import type { FC } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { StaggerItem } from "@/components/ui/StaggerList";
import { TH, cardCls, gridColor, tickColor } from "./constants";

interface WeeklyActivitySectionProps {
  dayActivity: number[];
}

/** Weekly — minimalist bar chart of activity by day of week. */
const WeeklyActivitySection: FC<WeeklyActivitySectionProps> = ({
  dayActivity,
}) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const peakDayIdx = dayActivity.indexOf(Math.max(...dayActivity, 1));
  const weeklyData = dayNames.map((day, i) => ({
    day,
    events: dayActivity[i],
    isPeak: i === peakDayIdx,
  }));

  return (
    <StaggerItem className={`p-8 lg:col-span-4 ${cardCls}`}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)`,
        }}
      />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-light-text dark:text-dark-text">
          Weekly
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-global-yellow/10 text-global-yellow">
          {dayActivity.reduce((a, b) => a + b, 0)} total
        </span>
      </div>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
        Activity by day of week
      </p>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
              width={30}
            />
            <RTooltip content={<ChartTooltip />} />
            <Bar dataKey="events" name="Events" radius={[4, 4, 0, 0]}>
              {weeklyData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.isPeak ? TH.yellow : "var(--color-surface-tertiary)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border/50">
        <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
          Peak performance on{" "}
          <strong className="text-global-yellow">{dayNames[peakDayIdx]}</strong>
        </p>
      </div>
    </StaggerItem>
  );
};

export default WeeklyActivitySection;
