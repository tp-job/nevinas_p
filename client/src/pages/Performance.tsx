import { useMemo, type FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  lighthouseScores,
  coreWebVitals,
  bundleAnalysis,
  apiResponseTimes,
  codeQuality,
  performanceHistory,
} from "@/data/performance";
import ScoreRing from "@/components/performance/ScoreRing";
import StatusBadge from "@/components/performance/StatusBadge";
import ChartTooltip from "@/components/charts/ChartTooltip";
import PageHeader from "@/components/common/PageHeader";
import SectionHead from "@/components/common/SectionHead";
import { useRepos } from "@/context/RepoContext";
import { useChartPalette } from "@/hooks/useChartPalette";

/**
 * Chart colours come from the one shared palette hook.
 *
 * This page used to hold its own six-entry hex map — #0f9d58, #5983FC,
 * #964EC2, #f4b400, #FF7BBF, #3E60C1 — none of which are Nocturnal Atelier
 * values; they were Google-brand greens and yellows that a palette change
 * could never reach. It was replaced with a local `useCssTokens` read, which
 * fixed the values but left this page as one of three files each resolving its
 * own chart palette. Three local fixes is how a fourth copy gets written, so
 * the resolution now lives in hooks/useChartPalette and every chart on the
 * site shares it.
 */

/* ==================== Performance Page ==================== */
const Performance: FC = () => {
  const c = useChartPalette();
  // Local aliases keep this page's existing chart call sites readable; the
  // values all come from the shared hook.
  const TH = useMemo(
    () => ({
      green: c.positive,
      yellow: c.warning,
      azure: c.secondary,
      orchid: c.muted,
      flamingo: c.accent,
      royal: c.tertiary,
    }),
    [c],
  );

  const gridColor = "var(--color-border-primary)";
  const tickColor = "var(--color-text-secondary)";
  // No card class. Every section on this page used to be a bordered, rounded,
  // filled panel with a 2px gradient strip across its top — the language the
  // Dashboard was rebuilt away from. Sections are separated by their
  // SectionHead rule and by whitespace now, so the two pages read as one site.
  const sectionCls = "mb-12";

  // Repo sizes are optional — section is hidden if the fetch fails.
  const { repos: allRepos, loading: loadingGH } = useRepos();
  const repos = useMemo(
    () => allRepos.slice().sort((a, b) => b.size - a.size),
    [allRepos],
  );

  const totalSize = repos.reduce((sum, r) => sum + r.size, 0);
  const formatSize = (kb: number) =>
    kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

  return (
    <div className="w-full">
      {/* Header */}
      <PageHeader
        eyebrow="Developer Analytics"
        title="Performance"
        jp="パフォーマンス"
      />

      {/* ========== GitHub Repo Sizes ========== */}
      {!loadingGH && repos.length > 0 && (
        <div className={sectionCls}>
          <SectionHead
            title="Repository Sizes"
            subtitle="Storage usage across GitHub repositories"
            meta={
              <span className="text-xs tabular-nums text-light-text-tertiary dark:text-dark-text-muted">
                {formatSize(totalSize)} across {repos.length} repositories
              </span>
            }
          />
          <div className="space-y-3">
            {repos.slice(0, 8).map((repo) => {
              const pct = Math.max(
                (repo.size / (repos[0]?.size || 1)) * 100,
                2,
              );
              return (
                <div key={repo.id} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm font-medium text-light-text dark:text-dark-text truncate">
                    {repo.name}
                  </span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${TH.azure}80, ${TH.orchid})`,
                      }}
                    />
                  </div>
                  <span className="w-20 text-right text-sm font-medium text-light-text dark:text-dark-text">
                    {formatSize(repo.size)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== Lighthouse Scores ========== */}
      <div className={sectionCls}>
        <SectionHead
          title="Lighthouse Scores"
          subtitle="Google Lighthouse audit results for nevinas_ka_i"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          {lighthouseScores.map((s) => (
            <ScoreRing key={s.label} score={s.score} label={s.label} />
          ))}
        </div>
      </div>

      {/* ========== Core Web Vitals ========== */}
      <div className={sectionCls}>
        <SectionHead
          title="Core Web Vitals"
          subtitle="Real user experience metrics"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreWebVitals.map((v) => (
            <div
              key={v.metric}
              className="p-4 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className={`${v.icon} text-lg text-matte-azure`}></i>
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">
                    {v.metric}
                  </span>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary mb-3">
                {v.fullName}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-medium text-light-text dark:text-dark-text">
                  {v.value}
                </span>
                <span className="text-[10px] font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  target: {v.target}
                </span>
              </div>
              <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary mt-2 leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== Performance History (Area Chart) ========== */}
      <div className={sectionCls}>
        <SectionHead
          title="Performance Trend"
          subtitle="Lighthouse scores over time"
        />
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceHistory}>
              <defs>
                {[
                  { id: "pPerf", c: TH.green },
                  { id: "pAcc", c: TH.azure },
                  { id: "pBP", c: TH.orchid },
                  { id: "pSEO", c: TH.yellow },
                ].map((g) => (
                  <linearGradient
                    key={g.id}
                    id={g.id}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={g.c} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={g.c} stopOpacity={0} />
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
                domain={[70, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <RTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
              <Area
                type="monotone"
                dataKey="performance"
                name="Performance"
                stroke={TH.green}
                fill="url(#pPerf)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: TH.green, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="accessibility"
                name="Accessibility"
                stroke={TH.azure}
                fill="url(#pAcc)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: TH.azure, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="bestPractices"
                name="Best Practices"
                stroke={TH.orchid}
                fill="url(#pBP)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: TH.orchid, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="seo"
                name="SEO"
                stroke={TH.yellow}
                fill="url(#pSEO)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: TH.yellow, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========== Bundle Analysis ========== */}
      <div className={sectionCls}>
        <SectionHead
          title="Bundle Analysis"
          subtitle="Build output comparison across projects"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-border dark:border-dark-border">
                {[
                  "Project",
                  "Build Time",
                  "JS",
                  "CSS",
                  "Total",
                  "Chunks",
                  "Tree Shaking",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bundleAnalysis.map((b) => (
                <tr
                  key={b.project}
                  className="border-b border-light-border/50 dark:border-dark-border/50 hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-light-text dark:text-dark-text">
                    {b.project}
                  </td>
                  <td className="py-3 px-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {b.buildTime}
                  </td>
                  <td className="py-3 px-4 font-inter text-matte-azure">
                    {b.jsSize}
                  </td>
                  <td className="py-3 px-4 font-inter text-velvet-orchid">
                    {b.cssSize}
                  </td>
                  <td className="py-3 px-4 font-medium text-light-text dark:text-dark-text">
                    {b.totalSize}
                  </td>
                  <td className="py-3 px-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {b.chunks}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-global-green/10 text-global-green">
                      {b.treeShaking}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== API Response Times ========== */}
      <div className={sectionCls}>
        <SectionHead
          title="API Response Times"
          subtitle="Average latency per endpoint"
        />
        <div className="space-y-3">
          {apiResponseTimes.map((api) => {
            const maxMs = 400;
            const pct = Math.min((api.avgMs / maxMs) * 100, 100);
            const barColor = api.status === "healthy" ? TH.green : TH.yellow;
            return (
              /* Wraps on mobile. This was a rigid single-line flex — a w-8
                 badge, a w-44 endpoint, a flexible bar, a w-16 latency and a
                 status pill — needing ~396px of a 330px column at 375px
                 viewport, so it overflowed its container by 47px and got
                 clipped by an ancestor rather than scrolling. The bar drops to
                 its own line below sm; everything else stays on one. */
              <div
                key={api.endpoint}
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
              >
                <div className="shrink-0">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${api.method === "GET" ? "bg-global-green/10 text-global-green" : "bg-global-yellow/10 text-global-yellow"}`}
                  >
                    {api.method}
                  </span>
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-inter text-light-text dark:text-dark-text sm:w-44 sm:flex-none">
                  {api.endpoint}
                </span>
                <div className="order-last h-2 basis-full overflow-hidden rounded-full bg-light-surface-2 sm:order-none sm:flex-1 sm:basis-auto dark:bg-dark-surface">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
                    }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-medium text-light-text dark:text-dark-text">
                  {api.avgMs}ms
                </span>
                <StatusBadge status={api.status} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== Code Quality ========== */}
      {/* Code quality figures. Same treatment as the Dashboard's StatStrip —
          small-caps label, 36px/300 tabular figure — rather than four bordered
          cards. The meters stay: each one encodes a proportion the number alone
          does not carry, which is why this is not routed through StatStrip
          itself. */}
      <SectionHead
        title="Code Quality"
        subtitle="Static analysis of this repository"
      />
      <div className="mb-12 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
        {/* TypeScript */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <i className="ri-code-s-slash-line text-matte-azure"></i>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
              TypeScript
            </span>
          </div>
          <div className="mb-1 text-4xl font-light tabular-nums text-light-text dark:text-dark-text">
            {codeQuality.typescript.coverage}%
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Coverage ({codeQuality.typescript.typedFiles}/
            {codeQuality.typescript.totalFiles} files)
          </p>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
            <div
              className="h-full rounded-full bg-matte-azure"
              style={{ width: `${codeQuality.typescript.coverage}%` }}
            />
          </div>
        </div>

        {/* ESLint */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <i className="ri-shield-check-line text-global-green"></i>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
              ESLint
            </span>
          </div>
          <div className="mb-1 text-4xl font-light tabular-nums text-light-text dark:text-dark-text">
            {codeQuality.eslint.errors}
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Errors ({codeQuality.eslint.warnings} warnings)
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {codeQuality.eslint.rules} rules
            </span>
            <span className="text-global-green">
              {codeQuality.eslint.autoFixable} auto-fixable
            </span>
          </div>
        </div>

        {/* Dependencies */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <i className="ri-box-3-line text-velvet-orchid"></i>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
              Dependencies
            </span>
          </div>
          <div className="mb-1 text-4xl font-light tabular-nums text-light-text dark:text-dark-text">
            {codeQuality.dependencies.total}
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {codeQuality.dependencies.devDeps} dev /{" "}
            {codeQuality.dependencies.outdated} outdated
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px]">
            <i className="ri-shield-check-line text-global-green"></i>
            <span className="text-global-green">
              {codeQuality.dependencies.vulnerabilities} vulnerabilities
            </span>
          </div>
        </div>

        {/* Lines of Code */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <i className="ri-file-code-line text-velvet-flamingo"></i>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-light-text-tertiary dark:text-dark-text-muted">
              Code Lines
            </span>
          </div>
          <div className="mb-1 text-4xl font-light tabular-nums text-light-text dark:text-dark-text">
            {codeQuality.codeLines.total.toLocaleString()}
          </div>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            Total lines of code
          </p>
          <div className="mt-3 flex gap-1 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-matte-azure rounded-full"
              style={{
                width: `${(codeQuality.codeLines.typescript / codeQuality.codeLines.total) * 100}%`,
              }}
            />
            <div
              className="bg-velvet-orchid rounded-full"
              style={{
                width: `${(codeQuality.codeLines.css / codeQuality.codeLines.total) * 100}%`,
              }}
            />
            <div
              className="bg-global-yellow rounded-full"
              style={{
                width: `${(codeQuality.codeLines.javascript / codeQuality.codeLines.total) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
