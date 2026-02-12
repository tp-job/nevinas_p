import 'dotenv/config';
import GitHubProfile from '../models/GitHubProfile';
import GitHubRepo from '../models/GitHubRepo';
import GitHubEvent from '../models/GitHubEvent';
import GitHubStats from '../models/GitHubStats';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'tp-job';
const GITHUB_API = 'https://api.github.com';

// ---------- Helpers ----------

const getHeaders = (): Record<string, string> => ({
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'nevinas-portfolio',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
});

const ghFetch = async <T = any>(url: string): Promise<T> => {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
};

// ---------- Topic Inference ----------

const inferTopics = (repo: any): string[] => {
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
            ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
            ghFetch<any[]>(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
            ghFetch<any[]>(`${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=100`),
        ]);

        const now = new Date();

        // 2. Upsert Profile
        await GitHubProfile.findOneAndUpdate(
            { login: profileData.login },
            {
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
            },
            { upsert: true, new: true }
        );

        // 3. Upsert Repos + remove deleted repos
        const githubRepoIds = reposData.map((r: any) => r.id);

        const repoBulkOps = reposData.map((r: any) => ({
            updateOne: {
                filter: { github_id: r.id },
                update: {
                    $set: {
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
                        watchers_count: r.watchers_count,
                        open_issues_count: r.open_issues_count,
                        size: r.size,
                        fork: r.fork,
                        archived: r.archived,
                        visibility: r.visibility,
                        default_branch: r.default_branch,
                        pushed_at: r.pushed_at,
                        github_created_at: r.created_at,
                        github_updated_at: r.updated_at,
                        synced_at: now,
                    },
                },
                upsert: true,
            },
        }));

        if (repoBulkOps.length > 0) {
            await GitHubRepo.bulkWrite(repoBulkOps);
        }

        // Remove repos no longer on GitHub
        await GitHubRepo.deleteMany({ github_id: { $nin: githubRepoIds } });

        // 4. Upsert Events + cleanup old events (>90 days)
        const eventBulkOps = eventsData.map((e: any) => ({
            updateOne: {
                filter: { github_id: e.id },
                update: {
                    $set: {
                        github_id: e.id,
                        type: e.type,
                        repo: e.repo?.name,
                        payload: {
                            action: e.payload?.action,
                            commits:
                                e.type === 'PushEvent'
                                    ? e.payload?.commits?.map((c: any) => ({
                                          sha: c.sha?.substring(0, 7),
                                          message: c.message,
                                      }))
                                    : undefined,
                            ref: e.payload?.ref,
                            ref_type: e.payload?.ref_type,
                        },
                        event_at: e.created_at,
                        synced_at: now,
                    },
                },
                upsert: true,
            },
        }));

        if (eventBulkOps.length > 0) {
            await GitHubEvent.bulkWrite(eventBulkOps);
        }

        // Delete events older than 90 days
        const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        await GitHubEvent.deleteMany({ event_at: { $lt: cutoff } });

        // 5. Compute and upsert aggregated stats
        const repos = reposData;
        const events = eventsData;

        const totalStars = repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0);
        const totalForks = repos.reduce((s: number, r: any) => s + (r.forks_count || 0), 0);

        const pushEvents = events.filter((e: any) => e.type === 'PushEvent');
        const prEvents = events.filter((e: any) => e.type === 'PullRequestEvent');
        const issueEvents = events.filter((e: any) => e.type === 'IssuesEvent');
        const createEvents = events.filter((e: any) => e.type === 'CreateEvent');

        const totalCommits = pushEvents.reduce((s: number, e: any) => s + (e.payload?.commits?.length || 0), 0);

        const commitsByMonth: Record<string, number> = {};
        pushEvents.forEach((e: any) => {
            const month = new Date(e.created_at).toLocaleString('en-US', { month: 'short' });
            commitsByMonth[month] = (commitsByMonth[month] || 0) + (e.payload?.commits?.length || 0);
        });

        const eventsByMonth: Record<string, { commits: number; prs: number; issues: number }> = {};
        events.forEach((e: any) => {
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
        repos.forEach((r: any) => {
            if (r.language) languageCount[r.language] = (languageCount[r.language] || 0) + 1;
        });

        const dayOfWeekActivity = [0, 0, 0, 0, 0, 0, 0];
        events.forEach((e: any) => {
            const day = new Date(e.created_at).getDay();
            dayOfWeekActivity[day === 0 ? 6 : day - 1]++;
        });

        const hourActivity = new Array(24).fill(0);
        events.forEach((e: any) => {
            hourActivity[new Date(e.created_at).getHours()]++;
        });

        const archivedCount = repos.filter((r: any) => r.archived).length;
        const activeCount = repos.filter((r: any) => {
            const daysAgo = (Date.now() - new Date(r.pushed_at).getTime()) / 86400000;
            return daysAgo < 90 && !r.archived;
        }).length;

        const topRepos = [...repos]
            .sort((a: any, b: any) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
            .slice(0, 6)
            .map((r: any) => ({
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

        await GitHubStats.findOneAndUpdate(
            {},
            {
                $set: {
                    totalStars,
                    totalForks,
                    totalCommits,
                    totalPRs: prEvents.length,
                    totalIssues: issueEvents.length,
                    totalCreateEvents: createEvents.length,
                    repoCount: repos.length,
                    languageDistribution: languageCount,
                    monthlyActivity,
                    commitsByMonth,
                    dayOfWeekActivity,
                    hourActivity,
                    projectStatus: {
                        active: activeCount,
                        inactive: repos.length - activeCount - archivedCount,
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
                },
            },
            { upsert: true, new: true }
        );

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[GitHub Sync] Completed in ${elapsed}s — ${repos.length} repos, ${events.length} events`);
    } catch (err) {
        console.error('[GitHub Sync] Error:', (err as Error).message);
        console.error('[GitHub Sync] Existing data in MongoDB will be served (stale but usable)');
    }
}

// Run standalone if called directly
if (require.main === module) {
    import('mongoose').then(async (mongoose) => {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';
        await mongoose.default.connect(MONGODB_URI);
        console.log('MongoDB connected');
        await syncGitHub();
        await mongoose.default.connection.close();
        process.exit(0);
    });
}
