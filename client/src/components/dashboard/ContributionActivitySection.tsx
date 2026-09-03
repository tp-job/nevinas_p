import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import KpiBadge from "./KpiBadge";
import SectionHead from "@/components/common/SectionHead";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { StaggerItem } from "@/components/ui/StaggerList";
import { cardCls, gridColor, tickColor } from "./constants";
import { useChartPalette } from "@/hooks/useChartPalette";
import type { GitHubStats } from "@/utils/api";

interface ContributionActivitySectionProps {
  stats: GitHubStats | null;
  monthlyActivity: GitHubStats["monthlyActivity"];
}

/**
 * Contribution Activity.
 *
 * TWO THINGS CHANGED BEYOND COLOUR
 *
 * 1. AREA CHART -> BARS. With only two months in the payload (Aug, Sep) and two
 *    of the three series flat at zero, the stacked areas rendered as a solid
 *    filled slab across the full width — the single least readable element on
 *    the page. `type="monotone"` also drew a smooth curve between two discrete
 *    monthly buckets, implying a continuous trend that the data cannot
 *    support. Months are discrete counts, so they are bars.
 * 2. THE LEGEND DOTS LOST THEIR GLOW. They carried `boxShadow: 0 0 6px` in
 *    off-palette green, blue and magenta — three accent colours competing with
 *    a chart that only needed to distinguish three series.
 *
 * Colours now come from useChartPalette, which resolves them from index.css.
 * The `TH` map this used to import held ten hardcoded values, none of them in
 * the Nocturnal Atelier palette.
 */
const ContributionActivitySection: FC<ContributionActivitySectionProps> = ({
  stats,
  monthlyActivity,
}) => {
  const c = useChartPalette();

  const series = [
    { key: "commits", label: "Commits", color: c.tertiary },
    { key: "prs", label: "PRs", color: c.primary },
    { key: "issues", label: "Issues", color: c.accent },
  ];

  return (
    <StaggerItem className={`lg:col-span-8 ${cardCls}`}>
      <SectionHead
        title="Contribution Activity"
        subtitle="Commits, PRs and issues from GitHub events"
        meta={
          <span className="flex flex-wrap items-center gap-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {series.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </span>
            ))}
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2">
        <KpiBadge
          icon="ri-git-commit-line"
          value={stats?.totalCommits ?? 0}
          label="Commits"
          color={c.tertiary}
        />
        <KpiBadge
          icon="ri-git-pull-request-line"
          value={stats?.totalPRs ?? 0}
          label="Pull Requests"
          color={c.primary}
        />
        <KpiBadge
          icon="ri-error-warning-line"
          value={stats?.totalIssues ?? 0}
          label="Issues"
          color={c.accent}
        />
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyActivity} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
              width={32}
              allowDecimals={false}
            />
            <RTooltip
              content={<ChartTooltip />}
              cursor={{ fill: gridColor, opacity: 0.4 }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={s.color}
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </StaggerItem>
  );
};

export default ContributionActivitySection;
