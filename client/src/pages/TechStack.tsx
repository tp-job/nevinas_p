import { useState, useEffect } from 'react';
import { techStackData } from '@/data/techData';
import type { FC } from 'react';
import TechStackCard from '@/components/card/TechStackCard';
import { githubApi } from '@/utils/api';

const LANG_COLORS: Record<string, string> = {
    'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Java': '#b07219', 'Go': '#00ADD8',
    'Rust': '#dea584', 'C++': '#f34b7d', 'C#': '#239120', 'PHP': '#4F5D95',
    'Ruby': '#701516', 'Shell': '#89e051',
};

const TechStack: FC = () => {
    const [langStats, setLangStats] = useState<Record<string, number>>({});
    const [repoCount, setRepoCount] = useState(0);
    const [loadingGH, setLoadingGH] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const stats = await githubApi.getStats();
                setLangStats(stats.languageDistribution);
                setRepoCount(stats.repoCount);
            } catch {
                // silently fail - GitHub section is optional
            } finally {
                setLoadingGH(false);
            }
        })();
    }, []);

    const totalLangs = Object.values(langStats).reduce((a, b) => a + b, 0) || 1;
    const sortedLangs = Object.entries(langStats).sort((a, b) => b[1] - a[1]);

    return (
        <div className="w-full">
            <div className="mb-4">
                <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Developer Analytics</h4>
                <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Tech Stack</h2>
                <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">技術スタック</h3>
            </div>

            {/* GitHub Language Distribution */}
            {!loadingGH && sortedLangs.length > 0 && (
                <div className="mb-8 p-6 rounded-2xl bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="ri-github-fill text-xl text-light-text dark:text-dark-text"></i>
                        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">GitHub Languages</h3>
                        <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{repoCount} repositories</span>
                    </div>

                    {/* Language bar */}
                    <div className="w-full h-4 rounded-full overflow-hidden flex mb-4">
                        {sortedLangs.map(([lang, count]) => (
                            <div
                                key={lang}
                                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                                style={{
                                    width: `${(count / totalLangs) * 100}%`,
                                    backgroundColor: LANG_COLORS[lang] || '#6e7681',
                                }}
                                title={`${lang}: ${((count / totalLangs) * 100).toFixed(1)}%`}
                            />
                        ))}
                    </div>

                    {/* Language legend */}
                    <div className="flex flex-wrap gap-4">
                        {sortedLangs.map(([lang, count]) => (
                            <div key={lang} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: LANG_COLORS[lang] || '#6e7681' }}
                                />
                                <span className="text-sm text-light-text dark:text-dark-text font-medium">{lang}</span>
                                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                    {((count / totalLangs) * 100).toFixed(1)}%
                                </span>
                                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                    ({count} repos)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loadingGH && (
                <div className="mb-8 p-6 rounded-2xl animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border">
                    <div className="h-6 w-48 rounded bg-light-border dark:bg-dark-border mb-4" />
                    <div className="h-4 w-full rounded-full bg-light-border dark:bg-dark-border mb-4" />
                    <div className="flex gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 w-24 rounded bg-light-border dark:bg-dark-border" />
                        ))}
                    </div>
                </div>
            )}

            {/* Tech Stack Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {techStackData.map((techStack) => (
                    <TechStackCard key={techStack.id} techStack={techStack} />
                ))}
            </div>
        </div>
    );
};

export default TechStack;
