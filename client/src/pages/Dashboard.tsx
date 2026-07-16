import React, { type FC } from "react";
import StatsCard from "@/components/card/StatsCard";
import RepoCard from "@/components/card/RepoCard";
import ContributionHeatmap from "@/components/dashboard/ContributionHeatmap";
import KpiBadge from "@/components/dashboard/KpiBadge";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/date";
import { techStackData } from "@/data/techData";
import { toolsData, toolSections } from "@/data/toolsData";
import Loading from "@/components/common/loading/Loading";
import Error from "@/components/common/server-error/Error";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import { StaggerList, StaggerItem } from "@/components/ui/StaggerList";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const SKILL_ICONS: Record<string, { icon: string; color: string }> = {
  react: { icon: "ri-reactjs-line", color: "#61dafb" },
  reactjs: { icon: "ri-reactjs-line", color: "#61dafb" },
  tailwindcss: { icon: "ri-tailwind-css-fill", color: "#06b6d4" },
  tailwind: { icon: "ri-tailwind-css-fill", color: "#06b6d4" },
  nodejs: { icon: "ri-nodejs-line", color: "#339933" },
  javascript: { icon: "ri-javascript-line", color: "#f7df1e" },
  typescript: { icon: "ri-code-s-slash-line", color: "#3178c6" },
  python: { icon: "ri-code-line", color: "#3572A5" },
  html: { icon: "ri-html5-line", color: "#e34c26" },
  css: { icon: "ri-css3-line", color: "#563d7c" },
  mongodb: { icon: "ri-database-2-line", color: "#47A248" },
  express: { icon: "ri-server-line", color: "#000000" },
  fullstack: { icon: "ri-stack-line", color: "#5983FC" },
  portfolio: { icon: "ri-user-line", color: "#964EC2" },
};

const TH = {
  royal: "#3E60C1",
  azure: "#5983FC",
  indigo: "#50409A",
  orchid: "#964EC2",
  flamingo: "#FF7BBF",
  blue: "#4285f4",
  purple: "#608dee",
  green: "#0f9d58",
  yellow: "#f4b400",
  pink: "#e863fa",
};

/* ==================== DASHBOARD ==================== */
const Dashboard: FC = () => {
  const { data, loading, error } = useFetch(
    () => Promise.all([githubApi.getStats(), githubApi.getRepos()]),
    [],
    "Failed to fetch GitHub data",
  );
  const [stats, allRepos] = data ?? [null, []];

  /* --- Derived Data --- */
  const monthlyActivity = stats?.monthlyActivity || [];
  const commitActivity = Object.entries(stats?.commitsByMonth || {}).map(
    ([month, commits]) => ({ month, commits }),
  );
  const dayActivity = stats?.dayOfWeekActivity || [0, 0, 0, 0, 0, 0, 0];
  const hourActivity = stats?.hourActivity || new Array(24).fill(0);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const peakDayIdx = dayActivity.indexOf(Math.max(...dayActivity, 1));
  const weeklyData = dayNames.map((day, i) => ({
    day,
    events: dayActivity[i],
    isPeak: i === peakDayIdx,
  }));

  // Language data
  const langDist = stats?.languageDistribution || {};
  const totalLangRepos =
    Object.values(langDist).reduce((a, b) => a + b, 0) || 1;
  const langData = Object.entries(langDist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / totalLangRepos) * 100),
      color: getLangColor(name),
    }));

  // Skills from all repos topics (aggregated)
  const skillMap = new Map<string, number>();
  allRepos.forEach((r) => {
    (r.topics || []).forEach((t) => {
      const key = t.toLowerCase();
      skillMap.set(key, (skillMap.get(key) || 0) + 1);
    });
  });
  const skillData = Array.from(skillMap.entries())
    .filter(([key]) => SKILL_ICONS[key])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Repos for cards
  const repositories = (stats?.topRepos || []).map((r) => ({
    name: r.name,
    description: r.description || "No description available",
    language: r.language || "Unknown",
    languageColor: getLangColor(r.language),
    stars: r.stargazers_count,
    forks: r.forks_count,
    updatedAt: formatRelativeTime(r.updated_at),
    url: r.html_url,
  }));

  // Project status
  const projectStatus = [
    {
      label: "Active",
      count: stats?.projectStatus.active || 0,
      color: TH.green,
      icon: "ri-checkbox-circle-fill",
    },
    {
      label: "Inactive",
      count: stats?.projectStatus.inactive || 0,
      color: TH.azure,
      icon: "ri-time-line",
    },
    {
      label: "Archived",
      count: stats?.projectStatus.archived || 0,
      color: TH.yellow,
      icon: "ri-archive-line",
    },
  ];
  const totalProjects = projectStatus.reduce((a, b) => a + b.count, 0);

  const repoActivity = stats
    ? Math.round(
      (stats.projectStatus.active / Math.max(stats.repoCount, 1)) * 100,
    )
    : 0;
  const commitFrequency = stats
    ? Math.min(Math.round((stats.totalCommits / 100) * 100), 100)
    : 0;

  // Tech stack categories count
  const techCategories = new Map<string, number>();
  techStackData.forEach((t) =>
    techCategories.set(t.category, (techCategories.get(t.category) || 0) + 1),
  );

  // Chart styling
  const gridColor = "var(--color-border-primary)";
  const tickColor = "var(--color-text-secondary)";
  const cardBg = "var(--color-surface-primary)";
  const cardCls =
    "bg-light-surface dark:bg-dark-bg backdrop-blur-xl border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]";

  /* ---- Loading ---- */
  if (loading) {
    return (
      <>
        <div className="w-full mb-4">
          <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
            Developer Analytics
          </h4>
          <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
            Dashboard
          </h2>
          <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
            概要
          </h3>
        </div>
        <Loading />
      </>
    );
  }

  /* ---- Error ---- */
  if (error) {
    return (
      <>
        <div className="w-full mb-4">
          <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
            Developer Analytics
          </h4>
          <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
            Dashboard
          </h2>
          <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">
            概要
          </h3>
        </div>
        <Error error={error} />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="w-full mb-10">
        <ScrollReveal>
          <div className="flex flex-col">
            <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">
              Developer Analytics
            </h4>
            <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">
              Dashboard
            </h2>
            <p className="font-zen text-[0.72rem] font-light tracking-[0.04em] text-light-text-secondary dark:text-dark-text-secondary mt-1">
              概要 · 開発分析
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* ========== 1. STATS CARDS (BENTO) ========== */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-10">
        <StaggerItem className="md:col-span-6 xl:col-span-3">
          <StatsCard
            title="TOTAL COMMITS"
            value={stats?.totalCommits || 0}
            subtitle={`${stats?.repoCount || 0} repos`}
            description="Recent push events"
            data={commitActivity}
            dataKey="commits"
            color={TH.azure}
            percentage={commitFrequency}
          />
        </StaggerItem>
        <StaggerItem className="md:col-span-6 xl:col-span-3">
          <StatsCard
            title="REPOSITORIES"
            value={stats?.repoCount || 0}
            subtitle={`${stats?.totalStars || 0} stars`}
            description="Public repositories"
            data={commitActivity}
            dataKey="commits"
            color={TH.royal}
            percentage={repoActivity}
          />
        </StaggerItem>
        <StaggerItem className="md:col-span-6 xl:col-span-3">
          <StatsCard
            title="FOLLOWERS"
            value={stats?.profile.followers || 0}
            subtitle={`Following ${stats?.profile.following || 0}`}
            description="GitHub followers"
            data={commitActivity}
            dataKey="commits"
            color={TH.orchid}
            percentage={50}
          />
        </StaggerItem>
        <StaggerItem className="md:col-span-6 xl:col-span-3">
          <StatsCard
            title="TOTAL STARS"
            value={stats?.totalStars || 0}
            subtitle={`${stats?.totalForks || 0} forks`}
            description="Across all repos"
            data={commitActivity}
            dataKey="commits"
            color={TH.flamingo}
            percentage={Math.min(
              ((stats?.totalStars || 0) / Math.max(stats?.repoCount || 1, 1)) *
              50,
              100,
            )}
          />
        </StaggerItem>
      </StaggerList>

      {/* ========== BENTO GRID (ULTRA-MINIMALIST SAAS) ========== */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* 1. Contribution Activity (Featured Line Graph) */}
        {monthlyActivity.length > 0 && (
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
        )}

        {/* 2. Weekly Activity (Minimalist Bar Chart) */}
        <StaggerItem className={`p-8 lg:col-span-4 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
              Weekly
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-global-yellow/10 text-global-yellow">
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
                        entry.isPeak
                          ? TH.yellow
                          : "var(--color-surface-tertiary)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border/50">
            <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
              Peak performance on <strong className="text-global-yellow">{dayNames[peakDayIdx]}</strong>
            </p>
          </div>
        </StaggerItem>

        {/* 3. Detected Skills */}
        <StaggerItem className={`p-8 lg:col-span-4 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)`,
            }}
          />
          <div className="mb-6">
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
              Skills Matrix
            </h3>
            <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
              Technology distribution
            </p>
          </div>
          {skillData.length > 0 ? (
            <div className="space-y-4">
              {skillData.map(([skill, count]) => {
                const meta = SKILL_ICONS[skill];
                const pct = Math.round((count / allRepos.length) * 100);
                return (
                  <div key={skill} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${meta.color}15` }}
                        >
                          <i
                            className={`${meta.icon} text-sm`}
                            style={{ color: meta.color }}
                          ></i>
                        </div>
                        <span className="text-sm font-semibold text-light-text dark:text-dark-text capitalize">
                          {skill}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: meta.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${meta.color}60, ${meta.color})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-light-text-secondary dark:text-dark-text-secondary text-sm">
              No skills data available
            </div>
          )}
        </StaggerItem>

        {/* 4. Language Distribution */}
        <StaggerItem className={`p-8 lg:col-span-8 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                Languages
              </h3>
              <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
                Project composition by language
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">
              {langData.length} active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="shrink-0 relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={langData}
                  dataKey="count"
                  nameKey="name"
                  cx={80}
                  cy={80}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {langData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RTooltip content={<ChartTooltip />} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-light-text dark:text-dark-text">
                  {stats?.repoCount || 0}
                </span>
                <span className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                  Repos
                </span>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {langData.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-xs font-medium text-light-text dark:text-dark-text">
                        {lang.name}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: lang.color }}
                    >
                      {lang.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${lang.pct}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* 5. Heatmap (Square Activity Heatmap Module) */}
        <StaggerItem className={`p-8 lg:col-span-5 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)`,
            }}
          />
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">
            Activity Pulse
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Interaction intensity by time
          </p>
          <div className="flex items-center justify-center">
            <ContributionHeatmap
              dayActivity={dayActivity}
              hourActivity={hourActivity}
            />
          </div>
        </StaggerItem>

        {/* 6. Tech Stack */}
        <StaggerItem className={`p-8 lg:col-span-7 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.royal}80, ${TH.azure}80, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
                Architecture Stack
              </h3>
              <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
                Primary frameworks & libraries
              </p>
            </div>
            <a
              href="/about/tech-stack"
              className="text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors"
            >
              All Stack <i className="ri-arrow-right-s-line"></i>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techStackData.slice(0, 6).map((tech) => (
              <a
                key={tech.id}
                href={tech.link}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3.5 p-4 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tech.color} shadow-sm group-hover:shadow-md transition-all`}
                >
                  <i className={`${tech.icon} text-lg text-white`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors truncate">
                      {tech.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary line-clamp-1">
                    {tech.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </StaggerItem>

        {/* 7. Tooling */}
        <StaggerItem className={`p-8 lg:col-span-12 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
                Workflow Tooling
              </h3>
              <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">
                Professional development utilities
              </p>
            </div>
            <a
              href="/about/tools"
              className="flex items-center gap-1.5 text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors"
            >
              Explore Tools <i className="ri-arrow-right-s-line"></i>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {toolsData.map((tool) => (
              <a
                key={tool.id}
                href={tool.link}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color} shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-500`}
                >
                  <i className={`${tool.icon} text-2xl text-white`}></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary mt-1 uppercase tracking-tighter opacity-70">
                    {tool.category}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {toolSections.slice(0, 8).map((section) => {
              const toolCount = section.tools.length;
              return (
                <div
                  key={section.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-light-surface-2/50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border/20"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-global-blue/10 shrink-0">
                    <i className={`${section.icon} text-lg text-global-blue`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-light-text dark:text-dark-text truncate">
                      {section.title}
                    </p>
                    <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">
                      {toolCount} resources
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </StaggerItem>

        {/* 8. Project Status */}
        <StaggerItem className={`p-8 lg:col-span-12 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.royal}60, ${TH.flamingo}60, transparent)`,
            }}
          />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-8">
            Project Integrity Status
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-44 h-44 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {
                  projectStatus.reduce(
                    (acc, item, i) => {
                      const pct =
                        totalProjects > 0
                          ? (item.count / totalProjects) * 100
                          : 0;
                      const circ = 2 * Math.PI * 48;
                      const dash = (pct / 100) * circ;
                      acc.elements.push(
                        <circle
                          key={i}
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={`${dash} ${circ - dash}`}
                          strokeDashoffset={-acc.offset}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />,
                      );
                      acc.offset += dash;
                      return acc;
                    },
                    { elements: [] as React.JSX.Element[], offset: 0 },
                  ).elements
                }
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-light-text dark:text-dark-text">
                  {totalProjects}
                </span>
                <span className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary uppercase font-bold tracking-widest">
                  Total
                </span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {projectStatus.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border/30 hover:border-global-blue/30 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <i
                      className={`${item.icon} text-xl`}
                      style={{ color: item.color }}
                    ></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold text-light-text dark:text-dark-text">
                        {item.count}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {totalProjects > 0
                          ? Math.round((item.count / totalProjects) * 100)
                          : 0}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-tighter">
                      {item.label} Repos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* 9. Popular Repositories */}
        <StaggerItem className="lg:col-span-12 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">
                Popular Repositories
              </h3>
              <p className="text-sm mt-1 text-light-text-secondary dark:text-dark-text-secondary">
                Curated selection of high-impact projects
              </p>
            </div>
            <a
              href="/work/repository"
              className="flex items-center gap-2 text-sm font-semibold text-global-blue hover:text-matte-azure transition-colors"
            >
              Portfolio <i className="ri-arrow-right-line"></i>
            </a>
          </div>

          {repositories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repositories.map((repo, i) => (
                <RepoCard key={i} {...repo} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl p-12 bg-light-surface-2 dark:bg-dark-surface text-center border-2 border-dashed border-light-border dark:border-dark-border/20">
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                No repository data available for display
              </p>
            </div>
          )}
        </StaggerItem>
      </StaggerList>
    </>
  );
};

export default Dashboard;
