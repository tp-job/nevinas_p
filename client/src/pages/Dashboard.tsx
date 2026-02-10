import React, { useState, useEffect, type FC } from 'react';
import StatsCard from '@/components/card/StatsCard';
import RepoCard from '@/components/card/RepoCard';
import { useTheme } from '@/context/ThemeContext';
import { githubApi, type GitHubStats, type GitHubRepo } from '@/utils/api';
import { techStackData } from '@/data/techData';
import { toolsData, toolSections } from '@/data/toolsData';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, BarChart, Bar, Cell,
    PieChart, Pie
} from 'recharts';

const LANG_COLORS: Record<string, string> = {
    'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Go': '#00ADD8', 'Rust': '#dea584',
    'Java': '#b07219', 'C++': '#f34b7d', 'C#': '#239120', 'PHP': '#4F5D95',
    'Ruby': '#701516', 'Shell': '#89e051',
};

const SKILL_ICONS: Record<string, { icon: string; color: string }> = {
    'react': { icon: 'ri-reactjs-line', color: '#61dafb' },
    'reactjs': { icon: 'ri-reactjs-line', color: '#61dafb' },
    'tailwindcss': { icon: 'ri-tailwind-css-fill', color: '#06b6d4' },
    'tailwind': { icon: 'ri-tailwind-css-fill', color: '#06b6d4' },
    'nodejs': { icon: 'ri-nodejs-line', color: '#339933' },
    'javascript': { icon: 'ri-javascript-line', color: '#f7df1e' },
    'typescript': { icon: 'ri-code-s-slash-line', color: '#3178c6' },
    'python': { icon: 'ri-code-line', color: '#3572A5' },
    'html': { icon: 'ri-html5-line', color: '#e34c26' },
    'css': { icon: 'ri-css3-line', color: '#563d7c' },
    'mongodb': { icon: 'ri-database-2-line', color: '#47A248' },
    'express': { icon: 'ri-server-line', color: '#000000' },
    'fullstack': { icon: 'ri-stack-line', color: '#5983FC' },
    'portfolio': { icon: 'ri-user-line', color: '#964EC2' },
};

const formatRelativeTime = (d?: string): string => {
    if (!d) return 'Recently';
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
};

const TH = {
    royal: '#3E60C1', azure: '#5983FC', indigo: '#50409A',
    orchid: '#964EC2', flamingo: '#FF7BBF', blue: '#4285f4',
    purple: '#608dee', green: '#0f9d58', yellow: '#f4b400', pink: '#e863fa',
};

/* ==================== Tooltip ==================== */
const ChartTooltip: FC<any> = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl bg-light-surface/95 dark:bg-dark-bg/95 border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
            <p className="text-xs font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary">{label}</p>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="opacity-70">{entry.name}:</span>
                    <span className="font-bold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

/* ==================== KPI Badge ==================== */
const KpiBadge: FC<{ icon: string; value: string | number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
            <i className={`${icon} text-sm`} style={{ color }}></i>
        </div>
        <div>
            <p className="text-lg font-extrabold leading-none text-light-text dark:text-dark-text">{value}</p>
            <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">{label}</p>
        </div>
    </div>
);

/* ==================== Heatmap ==================== */
const ContributionHeatmap: FC<{ isDark: boolean; dayActivity: number[]; hourActivity: number[] }> = ({ isDark, dayActivity, hourActivity }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];

    const maxDay = Math.max(...dayActivity, 1);
    const maxHour = Math.max(...hourActivity, 1);

    const heatData = hours.map((_, hi) => {
        const hourIdx = hi * 2 + 6;
        return days.map((_, di) => {
            const dayVal = dayActivity[di] / maxDay;
            const hourVal = (hourActivity[hourIdx] || 0) / maxHour;
            return Math.round(((dayVal + hourVal) / 2) * 4);
        });
    });

    const getColor = (val: number) => {
        if (isDark) return ['#1e202c', '#1e3a5f', '#2563eb40', '#3E60C1', '#5983FC'][val] || '#1e202c';
        return ['#f1f5f9', '#dbeafe', '#93c5fd', '#5983FC', '#3E60C1'][val] || '#f1f5f9';
    };

    const peakDay = dayActivity.indexOf(Math.max(...dayActivity));
    const totalEvents = dayActivity.reduce((a, b) => a + b, 0);

    return (
        <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">{totalEvents} events</span>
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Peak: <strong className="text-light-text dark:text-dark-text">{days[peakDay]}</strong>
                </span>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[380px]">
                    <div className="flex mb-1.5 ml-12">
                        {days.map((d, i) => (
                            <div key={d} className={`flex-1 text-center text-[10px] font-semibold ${i === peakDay ? 'text-matte-azure' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>{d}</div>
                        ))}
                    </div>
                    {hours.map((hour, hi) => (
                        <div key={hour} className="flex items-center gap-1 mb-1">
                            <span className="w-10 text-right text-[9px] font-medium pr-1 text-light-text-secondary dark:text-dark-text-secondary">{hour}</span>
                            {days.map((_, di) => (
                                <div key={di}
                                    className="flex-1 aspect-2/1 rounded transition-all duration-300 hover:scale-110 cursor-pointer"
                                    style={{ backgroundColor: getColor(heatData[hi][di]) }}
                                    title={`${hour} ${days[di]}: ${['None', 'Low', 'Medium', 'High', 'Peak'][heatData[hi][di]]}`}
                                />
                            ))}
                        </div>
                    ))}
                    <div className="flex items-center gap-1 justify-end mt-3">
                        <span className="text-[9px] mr-0.5 text-light-text-secondary dark:text-dark-text-secondary">Less</span>
                        {[0, 1, 2, 3, 4].map(v => <div key={v} className="w-3.5 h-2 rounded-sm" style={{ backgroundColor: getColor(v) }} />)}
                        <span className="text-[9px] ml-0.5 text-light-text-secondary dark:text-dark-text-secondary">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ==================== DASHBOARD ==================== */
const Dashboard: FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [statsData, reposData] = await Promise.all([
                    githubApi.getStats(),
                    githubApi.getRepos(),
                ]);
                setStats(statsData);
                setAllRepos(reposData);
            } catch { setError('Failed to fetch GitHub data'); }
            finally { setLoading(false); }
        })();
    }, []);

    /* --- Derived Data --- */
    const monthlyActivity = stats?.monthlyActivity || [];
    const commitActivity = Object.entries(stats?.commitsByMonth || {}).map(([month, commits]) => ({ month, commits }));
    const dayActivity = stats?.dayOfWeekActivity || [0, 0, 0, 0, 0, 0, 0];
    const hourActivity = stats?.hourActivity || new Array(24).fill(0);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const peakDayIdx = dayActivity.indexOf(Math.max(...dayActivity, 1));
    const weeklyData = dayNames.map((day, i) => ({
        day, events: dayActivity[i], isPeak: i === peakDayIdx,
    }));

    // Language data
    const langDist = stats?.languageDistribution || {};
    const totalLangRepos = Object.values(langDist).reduce((a, b) => a + b, 0) || 1;
    const langData = Object.entries(langDist)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
            name, count,
            pct: Math.round((count / totalLangRepos) * 100),
            color: LANG_COLORS[name] || '#6e7681',
        }));

    // Skills from all repos topics (aggregated)
    const skillMap = new Map<string, number>();
    allRepos.forEach(r => {
        (r.topics || []).forEach(t => {
            const key = t.toLowerCase();
            skillMap.set(key, (skillMap.get(key) || 0) + 1);
        });
    });
    const skillData = Array.from(skillMap.entries())
        .filter(([key]) => SKILL_ICONS[key])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Repos for cards
    const repositories = (stats?.topRepos || []).map(r => ({
        name: r.name,
        description: r.description || 'No description available',
        language: r.language || 'Unknown',
        languageColor: LANG_COLORS[r.language || ''] || '#6e7681',
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: formatRelativeTime(r.updated_at),
        url: r.html_url,
    }));

    // Project status
    const projectStatus = [
        { label: 'Active', count: stats?.projectStatus.active || 0, color: TH.green, icon: 'ri-checkbox-circle-fill' },
        { label: 'Inactive', count: stats?.projectStatus.inactive || 0, color: TH.azure, icon: 'ri-time-line' },
        { label: 'Archived', count: stats?.projectStatus.archived || 0, color: TH.yellow, icon: 'ri-archive-line' },
    ];
    const totalProjects = projectStatus.reduce((a, b) => a + b.count, 0);

    const repoActivity = stats ? Math.round((stats.projectStatus.active / Math.max(stats.repoCount, 1)) * 100) : 0;
    const commitFrequency = stats ? Math.min(Math.round((stats.totalCommits / 100) * 100), 100) : 0;

    // Tech stack categories count
    const techCategories = new Map<string, number>();
    techStackData.forEach(t => techCategories.set(t.category, (techCategories.get(t.category) || 0) + 1));

    // Chart styling
    const gridColor = isDark ? '#2f3848' : '#e2e8f0';
    const tickColor = isDark ? '#9ca3af' : '#64748b';
    const cardBg = isDark ? '#1e202c' : '#ffffff';
    const cardCls = 'bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl';

    /* ---- Loading ---- */
    if (loading) {
        return (
            <>
                <div className="w-full mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Dashboard</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">概要</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {[...Array(4)].map((_, i) => <div key={i} className="rounded-2xl p-6 animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border h-48" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-2xl p-6 animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border h-72" />
                    <div className="rounded-2xl p-6 animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border h-72" />
                </div>
            </>
        );
    }

    /* ---- Error ---- */
    if (error) {
        return (
            <>
                <div className="w-full mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Dashboard</h2>
                </div>
                <div className="rounded-2xl p-6 bg-global-red/5 border border-global-red/20">
                    <p className="text-center text-global-red"><i className="ri-error-warning-line mr-2"></i>{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="w-full">
                <div className="mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Dashboard</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">概要</h3>
                </div>
            </div>

            {/* ========== 1. STATS CARDS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatsCard title="TOTAL COMMITS" value={stats?.totalCommits || 0} subtitle={`${stats?.repoCount || 0} repos`} description="Recent push events" data={commitActivity} dataKey="commits" color={TH.azure} percentage={commitFrequency} />
                <StatsCard title="REPOSITORIES" value={stats?.repoCount || 0} subtitle={`${stats?.totalStars || 0} stars`} description="Public repositories" data={commitActivity} dataKey="commits" color={TH.royal} percentage={repoActivity} />
                <StatsCard title="FOLLOWERS" value={stats?.profile.followers || 0} subtitle={`Following ${stats?.profile.following || 0}`} description="GitHub followers" data={commitActivity} dataKey="commits" color={TH.orchid} percentage={50} />
                <StatsCard title="TOTAL STARS" value={stats?.totalStars || 0} subtitle={`${stats?.totalForks || 0} forks`} description="Across all repos" data={commitActivity} dataKey="commits" color={TH.flamingo} percentage={Math.min(((stats?.totalStars || 0) / Math.max(stats?.repoCount || 1, 1)) * 50, 100)} />
            </div>

            {/* ========== 2. SKILLS + LANGUAGES ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Detected Skills */}
                <div className={`p-6 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)` }} />
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Skills Detected</h3>
                            <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">From {allRepos.length} GitHub repositories</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-velvet-orchid/10 text-velvet-orchid">
                            {skillData.length} skills
                        </span>
                    </div>
                    {skillData.length > 0 ? (
                        <div className="space-y-3">
                            {skillData.map(([skill, count]) => {
                                const meta = SKILL_ICONS[skill];
                                const pct = Math.round((count / allRepos.length) * 100);
                                return (
                                    <div key={skill} className="group">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${meta.color}15` }}>
                                                    <i className={`${meta.icon} text-sm`} style={{ color: meta.color }}></i>
                                                </div>
                                                <span className="text-sm font-semibold text-light-text dark:text-dark-text capitalize">{skill}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary">{count} repos</span>
                                                <span className="text-xs font-bold min-w-[32px] text-right" style={{ color: meta.color }}>{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                                            <div className="h-full rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}60, ${meta.color})` }} />
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
                </div>

                {/* Language Distribution */}
                <div className={`p-6 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)` }} />
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Languages</h3>
                            <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Distribution across repositories</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">
                            {langData.length} langs
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="shrink-0 relative">
                            <PieChart width={150} height={150}>
                                <Pie data={langData} dataKey="count" nameKey="name" cx={75} cy={75}
                                    innerRadius={46} outerRadius={70} paddingAngle={2} strokeWidth={0}>
                                    {langData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <RTooltip content={<ChartTooltip />} />
                            </PieChart>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-extrabold text-light-text dark:text-dark-text">{stats?.repoCount || 0}</span>
                                <span className="text-[9px] text-light-text-secondary dark:text-dark-text-secondary">repos</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-2.5">
                            {langData.map((lang) => (
                                <div key={lang.name}>
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                            <span className="text-xs font-medium text-light-text dark:text-dark-text">{lang.name}</span>
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: lang.color }}>{lang.pct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lang.pct}%`, backgroundColor: lang.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== 3. CONTRIBUTION ACTIVITY ========== */}
            {monthlyActivity.length > 0 && (
                <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}80, ${TH.orchid}80, transparent)` }} />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                        <div>
                            <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Contribution Activity</h3>
                            <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Commits, PRs & Issues from GitHub Events</p>
                        </div>
                        <div className="flex items-center gap-5 text-xs">
                            {[{ label: 'Commits', color: TH.green }, { label: 'PRs', color: TH.azure }, { label: 'Issues', color: TH.orchid }].map(l => (
                                <span key={l.label} className="flex items-center gap-1.5 text-light-text-secondary dark:text-dark-text-secondary">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}60` }} />
                                    {l.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <KpiBadge icon="ri-git-commit-line" value={stats?.totalCommits || 0} label="Commits" color={TH.green} />
                        <KpiBadge icon="ri-git-pull-request-line" value={stats?.totalPRs || 0} label="Pull Requests" color={TH.azure} />
                        <KpiBadge icon="ri-error-warning-line" value={stats?.totalIssues || 0} label="Issues" color={TH.orchid} />
                    </div>

                    <div className="h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyActivity}>
                                <defs>
                                    {[{ id: 'gC', c: TH.green }, { id: 'gP', c: TH.azure }, { id: 'gI', c: TH.orchid }].map(g => (
                                        <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={g.c} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={g.c} stopOpacity={0.02} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} width={35} />
                                <RTooltip content={<ChartTooltip />} />
                                <Area type="monotone" dataKey="commits" stroke={TH.green} fill="url(#gC)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: TH.green, strokeWidth: 2, fill: cardBg }} />
                                <Area type="monotone" dataKey="prs" stroke={TH.azure} fill="url(#gP)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: TH.azure, strokeWidth: 2, fill: cardBg }} />
                                <Area type="monotone" dataKey="issues" stroke={TH.orchid} fill="url(#gI)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: TH.orchid, strokeWidth: 2, fill: cardBg }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ========== 4. TECH STACK ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.royal}80, ${TH.azure}80, transparent)` }} />
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Tech Stack</h3>
                        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Frameworks, libraries & tools used in development</p>
                    </div>
                    <a href="/about/tech-stack" className="flex items-center gap-1.5 text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors">
                        View all <i className="ri-arrow-right-s-line"></i>
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techStackData.slice(0, 9).map((tech) => (
                        <a key={tech.id} href={tech.link} target="_blank" rel="noreferrer"
                            className="group flex items-start gap-3.5 p-4 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-0.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tech.color} shadow-md`}>
                                <i className={`${tech.icon} text-lg text-white`}></i>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors truncate">{tech.name}</h4>
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-light-border dark:bg-dark-border text-light-text-secondary dark:text-dark-text-secondary shrink-0">{tech.category}</span>
                                </div>
                                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary line-clamp-1 mb-1.5">{tech.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {tech.itemTools.slice(0, 3).map((t, i) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-light-bg dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary">{t.split(' ')[0]}</span>
                                    ))}
                                    {tech.itemTools.length > 3 && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-global-blue/10 text-global-blue font-medium">+{tech.itemTools.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {techStackData.length > 9 && (
                    <div className="mt-4 text-center">
                        <a href="/about/tech-stack" className="text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors">
                            +{techStackData.length - 9} more stacks <i className="ri-arrow-right-line ml-1"></i>
                        </a>
                    </div>
                )}
            </div>

            {/* ========== 5. TOOLING ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.orchid}80, ${TH.flamingo}80, transparent)` }} />
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Tooling</h3>
                        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Development tools & workflow utilities</p>
                    </div>
                    <a href="/about/tools" className="flex items-center gap-1.5 text-xs font-semibold text-global-blue hover:text-matte-azure transition-colors">
                        View all <i className="ri-arrow-right-s-line"></i>
                    </a>
                </div>

                {/* Main tools grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    {toolsData.map((tool) => (
                        <a key={tool.id} href={tool.link} target="_blank" rel="noreferrer"
                            className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border transition-all duration-300 hover:-translate-y-0.5 text-center">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tool.color} shadow-md group-hover:scale-110 transition-transform`}>
                                <i className={`${tool.icon} text-xl text-white`}></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-light-text dark:text-dark-text group-hover:text-global-blue transition-colors">{tool.name}</h4>
                                <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary mt-0.5">{tool.category}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Tool sections summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {toolSections.slice(0, 8).map((section) => {
                        const toolCount = section.tools.length;
                        return (
                            <div key={section.id} className="flex items-center gap-3 p-3 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-global-blue/10 shrink-0">
                                    <i className={`${section.icon} text-sm text-global-blue`}></i>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-light-text dark:text-dark-text truncate">{section.title}</p>
                                    <p className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">{toolCount} tools</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ========== 6. WEEKLY ACTIVITY + HEATMAP ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Weekly Activity */}
                <div className={`p-6 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)` }} />
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Weekly Activity</h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-global-yellow/10 text-global-yellow">
                            {dayActivity.reduce((a, b) => a + b, 0)} total
                        </span>
                    </div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">GitHub events by day of week</p>

                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} barCategoryGap="25%">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} width={30} />
                                <RTooltip content={<ChartTooltip />} />
                                <Bar dataKey="events" name="Events" radius={[6, 6, 2, 2]}>
                                    {weeklyData.map((entry, i) => (
                                        <Cell key={i} fill={entry.isPeak ? TH.yellow : isDark ? '#3d4759' : '#cbd5e1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        Peak: <strong className="text-global-yellow">{dayNames[peakDayIdx]}</strong> ({dayActivity[peakDayIdx]} events)
                    </p>
                </div>

                {/* Heatmap */}
                <div className={`p-6 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)` }} />
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Coding Activity Heatmap</h3>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">Activity intensity by time & day</p>
                    <ContributionHeatmap isDark={isDark} dayActivity={dayActivity} hourActivity={hourActivity} />
                </div>
            </div>

            {/* ========== 7. PROJECT STATUS ========== */}
            <div className={`p-6 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.royal}60, ${TH.flamingo}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-5">Project Status</h3>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative w-36 h-36 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            {projectStatus.reduce((acc, item, i) => {
                                const pct = totalProjects > 0 ? (item.count / totalProjects) * 100 : 0;
                                const circ = 2 * Math.PI * 48;
                                const dash = (pct / 100) * circ;
                                acc.elements.push(
                                    <circle key={i} cx="60" cy="60" r="48" fill="none" stroke={item.color} strokeWidth="14"
                                        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-acc.offset}
                                        strokeLinecap="round" className="transition-all duration-700" />
                                );
                                acc.offset += dash;
                                return acc;
                            }, { elements: [] as React.JSX.Element[], offset: 0 }).elements}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-light-text dark:text-dark-text">{totalProjects}</span>
                            <span className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">repos</span>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        {projectStatus.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                                    <i className={`${item.icon}`} style={{ color: item.color }}></i>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-light-text dark:text-dark-text">{item.count}</span>
                                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                            {totalProjects > 0 ? Math.round((item.count / totalProjects) * 100) : 0}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== 8. POPULAR REPOSITORIES ========== */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">Popular Repositories</h3>
                        <p className="text-sm mt-1 text-light-text-secondary dark:text-dark-text-secondary">Top {repositories.length} by stars and activity</p>
                    </div>
                    <a href="/work/repository" className="flex items-center gap-2 text-sm font-semibold text-global-blue hover:text-matte-azure transition-colors">
                        View all <i className="ri-arrow-right-line"></i>
                    </a>
                </div>

                {repositories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repositories.map((repo, i) => <RepoCard key={i} {...repo} />)}
                    </div>
                ) : (
                    <div className="rounded-2xl p-6 bg-light-surface-2 dark:bg-dark-surface text-center">
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">No repositories found</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
