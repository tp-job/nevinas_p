import type { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import KpiBadge from "./KpiBadge";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { StaggerItem } from "@/components/ui/StaggerList";
import { TH, cardBg, cardCls, gridColor, tickColor } from "./constants";
import type { GitHubStats } from "@/utils/api";

interface ContributionActivitySectionProps {
  stats: GitHubStats | null;
  monthlyActivity: GitHubStats["monthlyActivity"];
}

/** Contribution Activity — featured line graph with KPI badges. */
const ContributionActivitySection: FC<ContributionActivitySectionProps> = ({
  stats,
  monthlyActivity,
}) => (
  <StaggerItem className={`p-8 lg:col-span-8 ${cardCls}`}>
    <div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: `linear-gradient(90deg, transparent, ${TH.azure}80, ${TH.orchid}80, transparent)`,
      }}
    />

    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
      <div>
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          Contribution Activity
        </h3>
        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
          Commits, PRs & Issues from GitHub Events
        </p>
      </div>
      <div className="flex items-center gap-5 text-xs">
        {[
          { label: "Commits", color: TH.green },
          { label: "PRs", color: TH.azure },
          { label: "Issues", color: TH.orchid },
        ].map((l) => (
          <span
            key={l.label}
            className="flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: l.color,
                boxShadow: `0 0 6px ${l.color}60`,
              }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-8">
      <KpiBadge
        icon="ri-git-commit-line"
        value={stats?.totalCommits || 0}
        label="Commits"
        color={TH.green}
      />
      <KpiBadge
        icon="ri-git-pull-request-line"
        value={stats?.totalPRs || 0}
        label="Pull Requests"
        color={TH.azure}
      />
      <KpiBadge
        icon="ri-error-warning-line"
        value={stats?.totalIssues || 0}
        label="Issues"
        color={TH.orchid}
      />
    </div>

    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyActivity}>
          <defs>
            {[
              { id: "gC", c: TH.green },
              { id: "gP", c: TH.azure },
              { id: "gI", c: TH.orchid },
            ].map((g) => (
              <linearGradient
                key={g.id}
                id={g.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={g.c} stopOpacity={0.4} />
                <stop offset="100%" stopColor={g.c} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
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
            width={35}
          />
          <RTooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="commits"
            stroke={TH.green}
            fill="url(#gC)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: TH.green,
              strokeWidth: 2,
              fill: cardBg,
            }}
          />
          <Area
            type="monotone"
            dataKey="prs"
            stroke={TH.azure}
            fill="url(#gP)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: TH.azure,
              strokeWidth: 2,
              fill: cardBg,
            }}
          />
          <Area
            type="monotone"
            dataKey="issues"
            stroke={TH.orchid}
            fill="url(#gI)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: TH.orchid,
              strokeWidth: 2,
              fill: cardBg,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </StaggerItem>
);

export default ContributionActivitySection;
