import { type FC } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContributionActivitySection from "@/components/dashboard/ContributionActivitySection";
import WeeklyActivitySection from "@/components/dashboard/WeeklyActivitySection";
import LanguagesSection from "@/components/dashboard/LanguagesSection";
import ProjectStatusSection from "@/components/dashboard/ProjectStatusSection";
import WorkRhythm from "@/components/dashboard/WorkRhythm";
import ActivityCalendar from "@/components/dashboard/ActivityCalendar";
import StatStrip from "@/components/dashboard/StatStrip";
import { githubApi } from "@/utils/api";
import { useFetch } from "@/hooks/useFetch";
import { getLangColor } from "@/utils/constants";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import { StaggerList } from "@/components/ui/StaggerList";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import PageHeader from "@/components/common/PageHeader";
import { useRepos } from "@/context/RepoContext";

/**
 * DASHBOARD
 *
 * Rearranged around one question: what does this page know that no other page
 * on the site knows?
 *
 * It previously answered "not much" at considerable length — thirteen
 * equal-weight cards across 3641px (4.0 screens), of which three duplicated
 * other pages outright: Workflow Tooling reproduced /work/tooling, Architecture
 * Stack reproduced the Docs "Architecture Overview" section, and Popular
 * Repositories reproduced /work/repository. A dashboard that restates the rest
 * of the site is a table of contents wearing charts.
 *
 * What it uniquely holds is the shape of the work over time. So it now leads
 * with Work Rhythm — the 24-hour distribution showing 60% of this project being
 * built between 20:00 and 06:00 — then the activity and composition it alone
 * can show, and links out for anything another page already owns properly.
 *
 * Two sections were deleted rather than moved:
 *
 * - "Activity Pulse" (ContributionHeatmap) fabricated its data. The API holds
 *   no day-by-hour matrix, only two independent marginals, and the component
 *   invented every cell as `((dayVal + hourVal) / 2) * 4` while rendering as a
 *   GitHub-style contribution grid — a form that reads as per-cell
 *   measurement. WorkRhythm shows the same hourActivity honestly.
 * - "Skills Matrix" ranked technologies from repo topics, which
 *   /work/tech-stack already presents from better inputs.
 */
const Dashboard: FC = () => {
  const { repos: allRepos, loading: reposLoading } = useRepos();

  // `fatal` because this IS the page — Dashboard renders nothing but the error
  // state without stats, so a 5xx here earns the full-page screen. The shared
  // repo fetch deliberately stays transient (see context/RepoContext): a fatal
  // shared fetch would blank every /work page, not just this one.
  const {
    data: stats,
    loading: statsLoading,
    error,
  } = useFetch(githubApi.getStats, [], {
    errorMessage: "Failed to fetch GitHub data",
    severity: "fatal",
  });

  // Events power the activity calendar. Transient and non-blocking on purpose:
  // the calendar is one section, so a failure here should cost that section,
  // not the page. It also must not gate `loading` — doing so would hold the
  // whole dashboard behind a secondary request.
  const { data: eventData } = useFetch(githubApi.getEvents, [], {
    errorMessage: "Failed to fetch GitHub events",
    notifyOnError: false,
  });
  const events = eventData ?? [];

  const loading = statsLoading || reposLoading;

  /* --- Derived data --- */
  const monthlyActivity = stats?.monthlyActivity || [];
  const dayActivity = stats?.dayOfWeekActivity || [0, 0, 0, 0, 0, 0, 0];
  const hourActivity = stats?.hourActivity || new Array(24).fill(0);

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

  /* --- The opening figures ---
     Only quantities that are actually non-zero. totalCommits, totalStars and
     totalIssues all read 0 from the Events API, and three zeros at 48px was the
     worst thing about the old hero row. They are stated in the footnote
     instead — visible, just not shouted. */
  const heroStats = [
    { label: "Repositories", value: stats?.repoCount ?? 0 },
    { label: "Pull Requests", value: stats?.totalPRs ?? 0 },
    { label: "Languages", value: Object.keys(langDist).length },
    {
      label: "Active",
      value: stats?.projectStatus.active ?? 0,
      note: `of ${stats?.repoCount ?? 0}`,
    },
  ];

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
      <div className="w-full mb-8">
        <ScrollReveal>
          <PageHeader
            eyebrow="Developer Analytics"
            title="Dashboard"
            jp="概要 · 開発分析"
            className="mb-0"
          />
        </ScrollReveal>
      </div>

      <StatStrip
        stats={heroStats}
        footnote={`Counted from ${allRepos.length} public repositories and the GitHub events feed. Stars and forks read ${stats?.totalStars ?? 0} and ${stats?.totalForks ?? 0}. Commits read ${stats?.totalCommits ?? 0} because GitHub's public events feed omits the commit list inside each push — the pushes themselves are counted in the calendar below.`}
      />

      {/* The lead. See WorkRhythm for why this is the centrepiece rather than a
          decorative flourish. */}
      <WorkRhythm hourActivity={hourActivity} />

      {/* Per-day counts, bucketed from individual event timestamps. This is the
          time-series axis neither Work Rhythm (hour of day) nor Weekly (day of
          week) shows, so it adds a dimension rather than restating one. */}
      <ActivityCalendar events={events} />

      {/* What this page uniquely holds: activity over time, and composition. */}
      <StaggerList className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {monthlyActivity.length > 0 && (
          <ContributionActivitySection
            stats={stats}
            monthlyActivity={monthlyActivity}
          />
        )}
        <WeeklyActivitySection dayActivity={dayActivity} />
        <LanguagesSection
          langData={langData}
          repoCount={stats?.repoCount || 0}
        />
        <ProjectStatusSection status={stats?.projectStatus} />
      </StaggerList>

      {/* Three sections used to sit here as full copies of pages that already
          exist. A link is the honest form of a duplicate: four lines instead of
          four hundred, and it cannot drift out of sync with what it points at. */}
      <section>
        <div className="mb-4 border-b border-light-border pb-2 dark:border-dark-border">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-light-text dark:text-dark-text">
            Elsewhere on this site
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-3">
          {[
            {
              to: "/work/repository",
              title: "Repositories",
              desc: `All ${stats?.repoCount ?? 0}, filterable by language`,
            },
            {
              to: "/work/tech-stack",
              title: "Tech Stack",
              desc: "Languages and tools in use",
            },
            {
              to: "/work/tooling",
              title: "Tooling",
              desc: "The working environment",
            },
          ].map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group flex items-baseline justify-between gap-3 border-b border-light-border/60 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte-azure dark:border-dark-border/60"
              >
                <span className="min-w-0">
                  <span className="block text-sm text-light-text transition-colors group-hover:text-matte-azure dark:text-dark-text">
                    {l.title}
                  </span>
                  <span className="block text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {l.desc}
                  </span>
                </span>
                <i
                  aria-hidden="true"
                  className="ri-arrow-right-line shrink-0 text-light-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-matte-azure dark:text-dark-text-muted"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Dashboard;
