import { useState, useEffect, type FC } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { githubApi, type GitHubStats } from '@/utils/api';

const C = {
    azure: '#5983FC', royal: '#3E60C1', orchid: '#964EC2',
    flamingo: '#FF7BBF', indigo: '#50409A', yellow: '#f4b400',
    green: '#0f9d58', teal: '#00897b', orange: '#ff6d00',
};

const LANG_COLORS: Record<string, string> = {
    'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Go': '#00ADD8', 'Rust': '#dea584',
    'Java': '#b07219', 'C++': '#f34b7d', 'C#': '#239120', 'PHP': '#4F5D95',
    'Ruby': '#701516', 'Shell': '#89e051',
};

const FRAMEWORK_COLORS = [C.azure, C.orchid, C.green, C.yellow, C.flamingo, C.teal, C.orange, C.royal];

/* ==================== Donut Chart ==================== */
const DonutChart: FC<{ data: { label: string; value: number; color: string }[]; size?: number; centerLabel?: string; centerValue?: string }> =
    ({ data, size = 180, centerLabel, centerValue }) => {
        const total = data.reduce((a, b) => a + b.value, 0);
        const cx = size / 2, cy = size / 2;
        const outerR = size / 2 - 8, innerR = outerR * 0.62;
        const gap = 0.03;

        let currentAngle = -Math.PI / 2;
        const arcs = data.map((item) => {
            const pct = item.value / total;
            const sweep = pct * 2 * Math.PI - gap;
            const startAngle = currentAngle + gap / 2;
            const endAngle = startAngle + sweep;
            currentAngle += pct * 2 * Math.PI;

            const x1o = cx + outerR * Math.cos(startAngle), y1o = cy + outerR * Math.sin(startAngle);
            const x2o = cx + outerR * Math.cos(endAngle), y2o = cy + outerR * Math.sin(endAngle);
            const x1i = cx + innerR * Math.cos(endAngle), y1i = cy + innerR * Math.sin(endAngle);
            const x2i = cx + innerR * Math.cos(startAngle), y2i = cy + innerR * Math.sin(startAngle);
            const largeArc = sweep > Math.PI ? 1 : 0;
            const d = `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i} Z`;
            return { d, color: item.color, label: item.label, pct: Math.round(pct * 100) };
        });

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {arcs.map((arc, i) => (
                        <path key={i} d={arc.d} fill={arc.color}
                            className="transition-all duration-500 hover:opacity-80 cursor-pointer" />
                    ))}
                    <circle cx={cx} cy={cy} r={innerR + 1} fill="none" className="stroke-light-surface dark:stroke-dark-bg" strokeWidth="2" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold tracking-tight text-light-text dark:text-dark-text">{centerValue || total}</span>
                    <span className="text-[10px] font-medium text-light-text-secondary dark:text-dark-text-secondary mt-0.5">{centerLabel || 'Total'}</span>
                </div>
            </div>
        );
    };

/* ==================== Main Component ==================== */
const TechStackCharts: FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await githubApi.getStats();
                setStats(data);
            } catch { /* silent */ }
            finally { setLoading(false); }
        })();
    }, []);

    // Language data from GitHub
    const langDist = stats?.languageDistribution || {};
    const totalRepos = Object.values(langDist).reduce((a, b) => a + b, 0) || 1;
    const languageData = Object.entries(langDist)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([label, value]) => ({
            label, value,
            pct: Math.round((value / totalRepos) * 100),
            color: LANG_COLORS[label] || '#6e7681',
        }));

    // Framework data - infer from top repos + topics
    const topRepos = stats?.topRepos || [];
    const frameworkMap = new Map<string, number>();
    topRepos.forEach((r) => {
        (r.topics || []).forEach((t) => {
            const name = t.toLowerCase();
            if (['react', 'reactjs'].includes(name)) frameworkMap.set('React', (frameworkMap.get('React') || 0) + 1);
            else if (['tailwindcss', 'tailwind'].includes(name)) frameworkMap.set('Tailwind', (frameworkMap.get('Tailwind') || 0) + 1);
            else if (['nodejs', 'node'].includes(name)) frameworkMap.set('Node.js', (frameworkMap.get('Node.js') || 0) + 1);
            else if (['mongodb', 'mongoose'].includes(name)) frameworkMap.set('MongoDB', (frameworkMap.get('MongoDB') || 0) + 1);
            else if (['express'].includes(name)) frameworkMap.set('Express', (frameworkMap.get('Express') || 0) + 1);
            else if (['python'].includes(name)) frameworkMap.set('Python', (frameworkMap.get('Python') || 0) + 1);
            else if (['fullstack'].includes(name)) frameworkMap.set('Full-Stack', (frameworkMap.get('Full-Stack') || 0) + 1);
        });
    });
    const maxFw = Math.max(...frameworkMap.values(), 1);
    const frameworkData = Array.from(frameworkMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([framework, count], i) => ({
            framework,
            count,
            value: Math.round((count / maxFw) * 100),
            color: FRAMEWORK_COLORS[i % FRAMEWORK_COLORS.length],
        }));

    const cardCls = 'bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl';

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 animate-pulse ${cardCls} h-72`} />
                <div className={`p-6 animate-pulse ${cardCls} h-72`} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Language Distribution */}
            <div className={`p-6 sm:p-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${C.azure}60, ${C.orchid}60, transparent)` }} />

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Language Breakdown</h3>
                        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Code distribution by language</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-matte-azure/10 text-matte-azure">
                        {languageData.length} langs
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="shrink-0">
                        <DonutChart data={languageData} size={170} centerValue={`${stats?.repoCount || 0}`} centerLabel="Repos" />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {languageData.map((lang) => (
                                <div key={lang.label} className="flex items-center gap-2.5 group">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-light-surface dark:ring-offset-dark-bg"
                                        style={{ backgroundColor: lang.color, ringColor: `${lang.color}40` }} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary truncate">{lang.label}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-light-text dark:text-dark-text">{lang.pct}%</span>
                                            <span className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">({lang.value})</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Framework / Tech Proficiency */}
            <div className={`p-6 sm:p-8 ${cardCls}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${C.orchid}60, ${C.flamingo}60, transparent)` }} />

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Tech Proficiency</h3>
                        <p className="text-sm mt-0.5 text-light-text-secondary dark:text-dark-text-secondary">Framework usage across repos</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-velvet-orchid/10 text-velvet-orchid">
                        {frameworkData.length} stacks
                    </span>
                </div>

                {frameworkData.length > 0 ? (
                    <div className="space-y-4">
                        {frameworkData.map((item) => (
                            <div key={item.framework}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-semibold text-light-text dark:text-dark-text">{item.framework}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary">{item.count} repos</span>
                                        <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
                                    </div>
                                </div>
                                <div className="h-2.5 rounded-full overflow-hidden bg-light-surface-2 dark:bg-dark-surface">
                                    <div className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                        style={{
                                            width: `${item.value}%`,
                                            background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                                        }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm"
                                            style={{ backgroundColor: item.color }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-40 text-light-text-secondary dark:text-dark-text-secondary text-sm">
                        No framework data detected
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechStackCharts;
