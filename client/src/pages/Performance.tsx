import { useState, useEffect, type FC } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import {
    lighthouseScores,
    coreWebVitals,
    bundleAnalysis,
    apiResponseTimes,
    codeQuality,
    performanceHistory,
} from '@/data/Performance';
import { githubApi, type GitHubRepo } from '@/utils/api';

// Theme colors
const TH = {
    green: '#0f9d58',
    azure: '#5983FC',
    orchid: '#964EC2',
    yellow: '#f4b400',
    flamingo: '#FF7BBF',
    royal: '#3E60C1',
};

/* ==================== Score Ring ==================== */
const ScoreRing: FC<{ score: number; label: string; color: string; size?: number }> = ({ score, label, color, size = 120 }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashLength = (score / 100) * circumference;
    const center = size / 2;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth}
                        className="stroke-light-border dark:stroke-dark-surface" />
                    <circle cx={center} cy={center} r={radius} fill="none" stroke={color}
                        strokeWidth={strokeWidth} strokeLinecap="round"
                        strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-light-text dark:text-dark-text">{score}</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">{label}</span>
        </div>
    );
};

/* ==================== Tooltip ==================== */
const ChartTooltip: FC<any> = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl bg-light-surface/95 dark:bg-dark-bg/95 border-light-border dark:border-dark-border">
            <p className="text-xs font-semibold mb-2 text-light-text-secondary dark:text-dark-text-secondary">{label}</p>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-light-text-secondary dark:text-dark-text-secondary opacity-70">{entry.name}:</span>
                    <span className="font-bold text-light-text dark:text-dark-text">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

/* ==================== Status Badge ==================== */
const StatusBadge: FC<{ status: string }> = ({ status }) => {
    const cls = status === 'good'
        ? 'bg-global-green/10 text-global-green'
        : status === 'warning'
            ? 'bg-global-yellow/10 text-global-yellow'
            : 'bg-global-red/10 text-global-red';
    return <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cls}`}>{status}</span>;
};

/* ==================== Performance Page ==================== */
const Performance: FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const gridColor = isDark ? '#2f3848' : '#e2e8f0';
    const tickColor = isDark ? '#9ca3af' : '#64748b';
    const cardCls = 'bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden transition-all duration-300';

    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loadingGH, setLoadingGH] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await githubApi.getRepos();
                setRepos(data.sort((a, b) => b.size - a.size));
            } catch { /* silent */ }
            finally { setLoadingGH(false); }
        })();
    }, []);

    const totalSize = repos.reduce((sum, r) => sum + r.size, 0);
    const formatSize = (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Performance</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">パフォーマンス</h3>
            </div>

            {/* ========== GitHub Repo Sizes ========== */}
            {!loadingGH && repos.length > 0 && (
                <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${TH.royal}60, ${TH.flamingo}60, transparent)` }} />
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Repository Sizes</h3>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Storage usage across GitHub repositories</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-global-blue/10 text-global-blue">
                            Total: {formatSize(totalSize)}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {repos.slice(0, 8).map(repo => {
                            const pct = Math.max((repo.size / (repos[0]?.size || 1)) * 100, 2);
                            return (
                                <div key={repo.id} className="flex items-center gap-4">
                                    <span className="w-40 shrink-0 text-sm font-medium text-light-text dark:text-dark-text truncate">{repo.name}</span>
                                    <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${TH.azure}80, ${TH.orchid})` }} />
                                    </div>
                                    <span className="w-20 text-right text-sm font-bold text-light-text dark:text-dark-text">{formatSize(repo.size)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ========== Lighthouse Scores ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.green}60, ${TH.azure}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Lighthouse Scores</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">Google Lighthouse audit results for nevinas_ka_i</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                    {lighthouseScores.map((s) => (
                        <ScoreRing key={s.label} score={s.score} label={s.label} color={s.color} />
                    ))}
                </div>
            </div>

            {/* ========== Core Web Vitals ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Core Web Vitals</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Real user experience metrics</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coreWebVitals.map((v) => (
                        <div key={v.metric} className="p-4 rounded-xl border bg-light-surface-2 dark:bg-dark-surface border-light-border dark:border-dark-border">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <i className={`${v.icon} text-lg text-matte-azure`}></i>
                                    <span className="text-sm font-bold text-light-text dark:text-dark-text">{v.metric}</span>
                                </div>
                                <StatusBadge status={v.status} />
                            </div>
                            <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary mb-3">{v.fullName}</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-extrabold text-light-text dark:text-dark-text">{v.value}</span>
                                <span className="text-[10px] font-medium text-light-text-secondary dark:text-dark-text-secondary">target: {v.target}</span>
                            </div>
                            <p className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary mt-2 leading-relaxed">{v.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== Performance History (Area Chart) ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Performance Trend</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Lighthouse scores over time</p>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceHistory}>
                            <defs>
                                {[
                                    { id: 'pPerf', c: TH.green },
                                    { id: 'pAcc', c: TH.azure },
                                    { id: 'pBP', c: TH.orchid },
                                    { id: 'pSEO', c: TH.yellow },
                                ].map(g => (
                                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={g.c} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={g.c} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
                            <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
                            <RTooltip content={<ChartTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                            <Area type="monotone" dataKey="performance" name="Performance" stroke={TH.green} fill="url(#pPerf)" strokeWidth={2.5} dot={{ r: 3, fill: TH.green, strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="accessibility" name="Accessibility" stroke={TH.azure} fill="url(#pAcc)" strokeWidth={2.5} dot={{ r: 3, fill: TH.azure, strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="bestPractices" name="Best Practices" stroke={TH.orchid} fill="url(#pBP)" strokeWidth={2.5} dot={{ r: 3, fill: TH.orchid, strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="seo" name="SEO" stroke={TH.yellow} fill="url(#pSEO)" strokeWidth={2.5} dot={{ r: 3, fill: TH.yellow, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ========== Bundle Analysis ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.orchid}60, ${TH.flamingo}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">Bundle Analysis</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Build output comparison across projects</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-light-border dark:border-dark-border">
                                {['Project', 'Build Time', 'JS', 'CSS', 'Total', 'Chunks', 'Tree Shaking'].map(h => (
                                    <th key={h} className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bundleAnalysis.map((b) => (
                                <tr key={b.project} className="border-b border-light-border/50 dark:border-dark-border/50 hover:bg-light-surface-2/50 dark:hover:bg-dark-surface/50 transition-colors">
                                    <td className="py-3 px-4 font-semibold text-light-text dark:text-dark-text">{b.project}</td>
                                    <td className="py-3 px-4 text-light-text-secondary dark:text-dark-text-secondary">{b.buildTime}</td>
                                    <td className="py-3 px-4 font-mono text-matte-azure">{b.jsSize}</td>
                                    <td className="py-3 px-4 font-mono text-velvet-orchid">{b.cssSize}</td>
                                    <td className="py-3 px-4 font-bold text-light-text dark:text-dark-text">{b.totalSize}</td>
                                    <td className="py-3 px-4 text-light-text-secondary dark:text-dark-text-secondary">{b.chunks}</td>
                                    <td className="py-3 px-4">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-global-green/10 text-global-green">{b.treeShaking}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========== API Response Times ========== */}
            <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${TH.yellow}60, transparent)` }} />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1">API Response Times</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">Average latency per endpoint</p>
                <div className="space-y-3">
                    {apiResponseTimes.map((api) => {
                        const maxMs = 400;
                        const pct = Math.min((api.avgMs / maxMs) * 100, 100);
                        const barColor = api.status === 'healthy' ? TH.green : TH.yellow;
                        return (
                            <div key={api.endpoint} className="flex items-center gap-4">
                                <div className="w-8 shrink-0">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${api.method === 'GET' ? 'bg-global-green/10 text-global-green' : 'bg-global-yellow/10 text-global-yellow'}`}>
                                        {api.method}
                                    </span>
                                </div>
                                <span className="w-44 shrink-0 text-sm font-mono text-light-text dark:text-dark-text truncate">{api.path}</span>
                                <div className="flex-1 h-2 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}80, ${barColor})` }} />
                                </div>
                                <span className="w-16 text-right text-sm font-bold text-light-text dark:text-dark-text">{api.avgMs}ms</span>
                                <StatusBadge status={api.status} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ========== Code Quality ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* TypeScript */}
                <div className={`p-5 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)` }} />
                    <div className="flex items-center gap-2 mb-3">
                        <i className="ri-code-s-slash-line text-matte-azure"></i>
                        <span className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">TypeScript</span>
                    </div>
                    <div className="text-3xl font-extrabold text-light-text dark:text-dark-text mb-1">{codeQuality.typescript.coverage}%</div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Coverage ({codeQuality.typescript.typedFiles}/{codeQuality.typescript.totalFiles} files)</p>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                        <div className="h-full rounded-full bg-matte-azure" style={{ width: `${codeQuality.typescript.coverage}%` }} />
                    </div>
                </div>

                {/* ESLint */}
                <div className={`p-5 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)` }} />
                    <div className="flex items-center gap-2 mb-3">
                        <i className="ri-shield-check-line text-global-green"></i>
                        <span className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">ESLint</span>
                    </div>
                    <div className="text-3xl font-extrabold text-light-text dark:text-dark-text mb-1">{codeQuality.eslint.errors}</div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Errors ({codeQuality.eslint.warnings} warnings)</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px]">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">{codeQuality.eslint.rules} rules</span>
                        <span className="text-global-green">{codeQuality.eslint.autoFixable} auto-fixable</span>
                    </div>
                </div>

                {/* Dependencies */}
                <div className={`p-5 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${TH.orchid}60, transparent)` }} />
                    <div className="flex items-center gap-2 mb-3">
                        <i className="ri-box-3-line text-velvet-orchid"></i>
                        <span className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Dependencies</span>
                    </div>
                    <div className="text-3xl font-extrabold text-light-text dark:text-dark-text mb-1">{codeQuality.dependencies.total}</div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{codeQuality.dependencies.devDeps} dev / {codeQuality.dependencies.outdated} outdated</p>
                    <div className="mt-3 flex items-center gap-1 text-[11px]">
                        <i className="ri-shield-check-line text-global-green"></i>
                        <span className="text-global-green">{codeQuality.dependencies.vulnerabilities} vulnerabilities</span>
                    </div>
                </div>

                {/* Lines of Code */}
                <div className={`p-5 ${cardCls}`}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${TH.flamingo}60, transparent)` }} />
                    <div className="flex items-center gap-2 mb-3">
                        <i className="ri-file-code-line text-velvet-flamingo"></i>
                        <span className="text-xs font-bold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Code Lines</span>
                    </div>
                    <div className="text-3xl font-extrabold text-light-text dark:text-dark-text mb-1">{codeQuality.codeLines.total.toLocaleString()}</div>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Total lines of code</p>
                    <div className="mt-3 flex gap-1 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-matte-azure rounded-full" style={{ width: `${(codeQuality.codeLines.typescript / codeQuality.codeLines.total) * 100}%` }} />
                        <div className="bg-velvet-orchid rounded-full" style={{ width: `${(codeQuality.codeLines.css / codeQuality.codeLines.total) * 100}%` }} />
                        <div className="bg-global-yellow rounded-full" style={{ width: `${(codeQuality.codeLines.javascript / codeQuality.codeLines.total) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
