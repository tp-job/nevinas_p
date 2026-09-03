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
import SectionHead from "./SectionHead";
import { StaggerItem } from "@/components/ui/StaggerList";
import { cardCls, gridColor, tickColor } from "./constants";
import { useChartPalette } from "@/hooks/useChartPalette";

interface WeeklyActivitySectionProps {
  dayActivity: number[];
}

/**
 * Weekly — activity by day of week.
 *
 * The peak day was drawn in `TH.yellow` (#f4b400) with a matching amber pill
 * and an amber gradient bar across the top of the card. Three amber accents on
 * a blue-purple palette, on the smallest panel on the page — it pulled the eye
 * to the least important chart. The peak is now marked the same way Work
 * Rhythm marks night: periwinkle against haze, one step of emphasis inside the
 * palette rather than a colour imported from outside it.
 *
 * "Peak performance on Tue" also became "Most active day" — this measures event
 * counts, and calling a count "performance" claims something it does not
 * measure.
 */
const WeeklyActivitySection: FC<WeeklyActivitySectionProps> = ({
  dayActivity,
}) => {
  const c = useChartPalette();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const peakDayIdx = dayActivity.indexOf(Math.max(...dayActivity, 1));
  const total = dayActivity.reduce((a, b) => a + b, 0);
  const weeklyData = dayNames.map((day, i) => ({
    day,
    events: dayActivity[i],
    isPeak: i === peakDayIdx,
  }));

  return (
    <StaggerItem className={`lg:col-span-4 ${cardCls}`}>
      <SectionHead
        title="Weekly"
        subtitle="Activity by day of week"
        meta={
          <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
            {total} events
          </span>
        }
      />

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barCategoryGap="24%">
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
              width={28}
              allowDecimals={false}
            />
            <RTooltip
              content={<ChartTooltip />}
              cursor={{ fill: gridColor, opacity: 0.4 }}
            />
            <Bar dataKey="events" name="Events" radius={[2, 2, 0, 0]}>
              {weeklyData.map((entry, i) => (
                <Cell key={i} fill={entry.isPeak ? c.primary : c.muted} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
        Most active day{" "}
        {/* A <span>, not <strong>: Tailwind preflight leaves <strong> at the
            browser default `bolder` (700), above the DS ceiling of 600. */}
        <span className="font-medium text-light-text dark:text-dark-text">
          {dayNames[peakDayIdx]}
        </span>
      </p>
    </StaggerItem>
  );
};

export default WeeklyActivitySection;
