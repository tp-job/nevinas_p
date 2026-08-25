import { type FC } from "react";
import StatsCard from "@/components/card/StatsCard";
import ContributionHeatmap from "@/components/dashboard/ContributionHeatmap";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContributionActivitySection from "@/components/dashboard/ContributionActivitySection";
import WeeklyActivitySection from "@/components/dashboard/WeeklyActivitySection";
import SkillsMatrixSection from "@/components/dashboard/SkillsMatrixSection";
import LanguagesSection from "@/components/dashboard/LanguagesSection";
import ArchitectureStackSection from "@/components/dashboard/ArchitectureStackSection";
import ToolingSection from "@/components/dashboard/ToolingSection";
import ProjectStatusSection from "@/components/dashboard/ProjectStatusSection";
import PopularReposSection from "@/components/dashboard/PopularReposSection";
import { SKILL_ICONS, TH, cardCls } from "@/components/dashboard/constants";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/date";
import AsyncBoundary from "@/components/common/AsyncBoundary";

import { StaggerList, StaggerItem } from "@/components/ui/StaggerList";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ==================== DASHBOARD ==================== */
const Dashboard: FC = () => {
  // `fatal` because this IS the page — Dashboard renders nothing but the error
  // state without it, so a 5xx here earns the full-page screen. Every other
  // page's fetch stays transient and reports inline.
  const { data, loading, error } = useFetch(
    (o) => Promise.all([githubApi.getStats(o), githubApi.getRepos(o)]),
    [],
    { errorMessage: "Failed to fetch GitHub data", severity: "fatal" },
  );
  const [stats, allRepos] = data ?? [null, []];

  /* --- Derived Data --- */
  const monthlyActivity = stats?.monthlyActivity || [];
  const commitActivity = Object.entries(stats?.commitsByMonth || {}).map(
    ([month, commits]) => ({ month, commits }),
  );
  const dayActivity = stats?.dayOfWeekActivity || [0, 0, 0, 0, 0, 0, 0];
  const hourActivity = stats?.hourActivity || new Array(24).fill(0);

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

  const repoActivity = stats
    ? Math.round(
      (stats.projectStatus.active / Math.max(stats.repoCount, 1)) * 100,
    )
    : 0;
  const commitFrequency = stats
    ? Math.min(Math.round((stats.totalCommits / 100) * 100), 100)
    : 0;

  /* ---- Loading / error share the page chrome ---- */
  if (loading || error) {
    return (
      <>
        <DashboardHeader />
        <AsyncBoundary loading={loading} error={error}>
          {null}
        </AsyncBoundary>
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
          <ContributionActivitySection
            stats={stats}
            monthlyActivity={monthlyActivity}
          />
        )}

        {/* 2. Weekly Activity (Minimalist Bar Chart) */}
        <WeeklyActivitySection dayActivity={dayActivity} />

        {/* 3. Detected Skills */}
        <SkillsMatrixSection skillData={skillData} repoTotal={allRepos.length} />

        {/* 4. Language Distribution */}
        <LanguagesSection langData={langData} repoCount={stats?.repoCount || 0} />

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
        <ArchitectureStackSection />

        {/* 7. Tooling */}
        <ToolingSection />

        {/* 8. Project Status */}
        <ProjectStatusSection status={stats?.projectStatus} />

        {/* 9. Popular Repositories */}
        <PopularReposSection repositories={repositories} />
      </StaggerList>
    </>
  );
};

export default Dashboard;
