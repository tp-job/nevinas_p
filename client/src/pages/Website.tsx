import { useState, useEffect } from 'react';
import { githubApi, type GitHubRepo } from '@/utils/api';
import ProjectCard from '@/components/card/ProjectCard';

const Website = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const repos = await githubApi.getRepos();
                const filtered = repos.filter(r => {
                    const topics = r.topics || [];
                    const name = (r.name || '').toLowerCase();
                    const desc = (r.description || '').toLowerCase();
                    return topics.includes('html') || topics.includes('css')
                        || r.language === 'HTML' || r.language === 'CSS'
                        || name.includes('html') || name.includes('css')
                        || desc.includes('html') || desc.includes('css');
                });
                setProjects(filtered);
            } catch {
                setError('Failed to fetch projects from GitHub');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <div className="w-full">
                <div className="mb-4">
                    <h4 className="mb-1 text-lg text-light-text dark:text-dark-text">Skill Showcase</h4>
                    <h2 className="mb-1 text-4xl sm:text-5xl text-light-text dark:text-dark-text">Website (HTML/CSS/JS)</h2>
                    <h3 className="text-xl font-zen text-light-text-secondary dark:text-dark-text-secondary">ウェブサイト</h3>
                </div>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl animate-pulse bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border overflow-hidden">
                            <div className="h-56 bg-light-surface-2 dark:bg-dark-surface" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 w-1/3 rounded bg-light-border dark:bg-dark-border" />
                                <div className="h-6 w-3/4 rounded bg-light-border dark:bg-dark-border" />
                                <div className="h-4 w-full rounded bg-light-border dark:bg-dark-border" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-2xl p-6 bg-global-red/5 border border-global-red/20">
                    <p className="text-center text-global-red">
                        <i className="ri-error-warning-line mr-2"></i>{error}
                    </p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map(repo => (
                        <ProjectCard key={repo.id} repo={repo} category="html" categoryLabel="HTML / CSS" />
                    ))}
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div className="text-center py-12 rounded-xl bg-light-surface-2 dark:bg-dark-surface">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">No HTML/CSS projects found</p>
                </div>
            )}
        </>
    );
};

export default Website;
