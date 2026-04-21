import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../services/fileManager';
import { getGitHubHeaders, GITHUB_USERNAME, GITHUB_API } from '../utils/githubRequest';
import type { GitHubApiProfile, GitHubApiRepo, GitHubApiEvent } from '../types/github';
import type {
    IGitHubProfile,
    IGitHubRepo,
    IGitHubEvent,
    IGitHubStats,
    IGitHubData,
} from '../types/models';

// ---------- Helpers ----------

const ghFetch = async <T>(url: string): Promise<T> => {
    const res = await fetch(url, { headers: getGitHubHeaders() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
};

// ---------- Topic Inference ----------

const inferTopics = (repo: GitHubApiRepo): string[] => {
    const topics: string[] = [...(repo.topics || [])];
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const combined = `${name} ${desc}`;

    if (combined.includes('react') || combined.includes('vite') || combined.includes('jsx') || combined.includes('tsx')) {
        if (!topics.includes('react')) topics.push('react');
    }
    if (combined.includes('tailwind') || combined.includes('tw-')) {
        if (!topics.includes('tailwindcss')) topics.push('tailwindcss');
    }
    if (lang === 'html' || combined.includes('html')) {
        if (!topics.includes('html')) topics.push('html');
    }
    if (lang === 'css' || combined.includes('css')) {
        if (!topics.includes('css')) topics.push('css');
    }
    if (lang === 'javascript' || lang === 'typescript') {
        if (!topics.includes(lang)) topics.push(lang);
    }
    if (lang === 'python' || combined.includes('python') || combined.includes('pyodide')) {
        if (!topics.includes('python')) topics.push('python');
    }
    if (combined.includes('express') || combined.includes('node') || combined.includes('api') || combined.includes('server')) {
        if (!topics.includes('nodejs')) topics.push('nodejs');
    }
    if (combined.includes('mongo') || combined.includes('mongoose')) {
        if (!topics.includes('mongodb')) topics.push('mongodb');
    }
    if (combined.includes('portfolio') || combined.includes('protfolio') || combined.includes('profile')) {
        if (!topics.includes('portfolio')) topics.push('portfolio');
    }
    if (topics.includes('react') && (topics.includes('nodejs') || topics.includes('mongodb'))) {
        if (!topics.includes('fullstack')) topics.push('fullstack');
    }
    return topics;
};

// ---------- Main Sync ----------

export async function syncGitHub(): Promise<void> {
    const startTime = Date.now();
    console.log(`[GitHub Sync] Starting sync for @${GITHUB_USERNAME}...`);

    try {
        // 1. Fetch data from GitHub API in parallel
        const [profileData, reposData, eventsData] = await Promise.all([
            ghFetch<GitHubApiProfile>(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
            ghFetch<GitHubApiRepo[]>(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
            ghFetch<GitHubApiEvent[]>(`${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=100`),
        ]);

        const now = new Date().toISOString();

        // 2. Build Profile
        const profile: IGitHubProfile = {
            id: uuidv4(),
            login: profileData.login,
            name: profileData.name,
            avatar_url: profileData.avatar_url,
            html_url: profileData.html_url,
            bio: profileData.bio,
            location: profileData.location,
            blog: profileData.blog,
            public_repos: profileData.public_repos,
            public_gists: profileData.public_gists,
            followers: profileData.followers,
            following: profileData.following,
            github_created_at: profileData.created_at,
            github_updated_at: profileData.updated_at,
            synced_at: now,
        };

        // 3. Build Repos
        const repos: IGitHubRepo[] = reposData.map((r) => ({
            id: uuidv4(),
            github_id: r.id,
            name: r.name,
            full_name: r.full_name,
            description: r.description,
            html_url: r.html_url,
            homepage: r.homepage,
            language: r.language,
            topics: inferTopics(r),
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            watchers_count: r.watchers_count ?? 0,
            open_issues_count: r.open_issues_count ?? 0,
            size: r.size,
            fork: r.fork,
            archived: r.archived,
            visibility: r.visibility ?? 'public',
            default_branch: r.default_branch ?? 'main',
            pushed_at: r.pushed_at,
            github_created_at: r.created_at,
            github_updated_at: r.updated_at,
            synced_at: now,
        }));

        // 4. Build Events (filter out events older than 90 days)
        const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const events: IGitHubEvent[] = eventsData
            .filter((e) => new Date(e.created_at) >= cutoff)
            .map((e) => ({
                id: uuidv4(),
                github_id: e.id,
                type: e.type,
                repo: e.repo?.name ?? '',
                payload: {
                    action: e.payload?.action,
                    commits:
                        e.type === 'PushEvent'
                            ? e.payload?.commits?.map((c) => ({
                                  sha: c.sha?.substring(0, 7) ?? '',
                                  message: c.message ?? '',
                              }))
                            : undefined,
                    ref: e.payload?.ref,
                    ref_type: e.payload?.ref_type,
                },
                event_at: e.created_at,
                synced_at: now,
            }));

        // 5. Compute aggregated stats
        const totalStars = reposData.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        const totalForks = reposData.reduce((s, r) => s + (r.forks_count || 0), 0);

        const pushEvents = eventsData.filter((e) => e.type === 'PushEvent');
        const prEvents = eventsData.filter((e) => e.type === 'PullRequestEvent');
        const issueEvents = eventsData.filter((e) => e.type === 'IssuesEvent');
        const createEvents = eventsData.filter((e) => e.type === 'CreateEvent');

        const totalCommits = pushEvents.reduce((s, e) => s + (e.payload?.commits?.length || 0), 0);

        const commitsByMonth: Record<string, number> = {};
        pushEvents.forEach((e) => {
            const month = new Date(e.created_at).toLocaleString('en-US', { month: 'short' });
            commitsByMonth[month] = (commitsByMonth[month] || 0) + (e.payload?.commits?.length || 0);
        });

        const eventsByMonth: Record<string, { commits: number; prs: number; issues: number }> = {};
        eventsData.forEach((e) => {
            const month = new Date(e.created_at).toLocaleString('en-US', { month: 'short' });
            if (!eventsByMonth[month]) eventsByMonth[month] = { commits: 0, prs: 0, issues: 0 };
            if (e.type === 'PushEvent') eventsByMonth[month].commits += e.payload?.commits?.length || 0;
            if (e.type === 'PullRequestEvent') eventsByMonth[month].prs++;
            if (e.type === 'IssuesEvent') eventsByMonth[month].issues++;
        });

        const monthlyActivity = Object.entries(eventsByMonth)
            .map(([month, data]) => ({ month, ...data }))
            .reverse();

        const languageCount: Record<string, number> = {};
        reposData.forEach((r) => {
            if (r.language) languageCount[r.language] = (languageCount[r.language] || 0) + 1;
        });

        const dayOfWeekActivity = [0, 0, 0, 0, 0, 0, 0];
        eventsData.forEach((e) => {
            const day = new Date(e.created_at).getDay();
            dayOfWeekActivity[day === 0 ? 6 : day - 1]++;
        });

        const hourActivity = new Array(24).fill(0);
        eventsData.forEach((e) => {
            hourActivity[new Date(e.created_at).getHours()]++;
        });

        const archivedCount = reposData.filter((r) => r.archived).length;
        const activeCount = reposData.filter((r) => {
            const daysAgo = (Date.now() - new Date(r.pushed_at).getTime()) / 86400000;
            return daysAgo < 90 && !r.archived;
        }).length;

        const topRepos = [...reposData]
            .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
            .slice(0, 6)
            .map((r) => ({
                name: r.name,
                description: r.description,
                html_url: r.html_url,
                homepage: r.homepage,
                language: r.language,
                topics: inferTopics(r),
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                updated_at: r.updated_at,
                pushed_at: r.pushed_at,
            }));

        const stats: IGitHubStats = {
            id: uuidv4(),
            totalStars,
            totalForks,
            totalCommits,
            totalPRs: prEvents.length,
            totalIssues: issueEvents.length,
            totalCreateEvents: createEvents.length,
            repoCount: reposData.length,
            languageDistribution: languageCount,
            monthlyActivity,
            commitsByMonth,
            dayOfWeekActivity,
            hourActivity,
            projectStatus: {
                active: activeCount,
                inactive: reposData.length - activeCount - archivedCount,
                archived: archivedCount,
            },
            topRepos,
            profile: {
                login: profileData.login,
                name: profileData.name,
                avatar_url: profileData.avatar_url,
                bio: profileData.bio,
                public_repos: profileData.public_repos,
                followers: profileData.followers,
                following: profileData.following,
            },
            synced_at: now,
        };

        // 6. Write all data atomically
        const githubData: IGitHubData = {
            profiles: [profile],
            events,
            repos,
            stats: [stats],
        };

        await dataStore.github.withLock(() => {
            dataStore.github.writeAll(githubData);
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[GitHub Sync] Completed in ${elapsed}s — ${repos.length} repos, ${events.length} events`);
    } catch (err) {
        console.error('[GitHub Sync] Error:', (err as Error).message);
        console.error('[GitHub Sync] Existing data in files will be served (stale but usable)');
    }
}

// Run standalone if called directly
if (require.main === module) {
    dataStore.init();
    syncGitHub().then(() => {
        console.log('Sync complete.');
        process.exit(0);
    });
}
