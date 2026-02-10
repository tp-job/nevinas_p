const express = require('express');
const router = express.Router();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'tp-job';
const GITHUB_API = 'https://api.github.com';

// Headers for GitHub API
const getHeaders = () => ({
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'nevinas-portfolio',
    ...(GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {})
});

// Simple in-memory cache (5 min TTL)
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

const getCached = (key) => {
    const entry = cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
    return null;
};

const setCache = (key, data) => {
    cache[key] = { data, timestamp: Date.now() };
};

// Helper: fetch from GitHub
const ghFetch = async (url) => {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    return res.json();
};

// Helper: auto-infer topics from repo name, description, and language
const inferTopics = (repo) => {
    const topics = [...(repo.topics || [])];
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const combined = `${name} ${desc}`;

    // React detection
    if (combined.includes('react') || combined.includes('vite') || combined.includes('jsx') || combined.includes('tsx')) {
        if (!topics.includes('react')) topics.push('react');
    }

    // TailwindCSS detection
    if (combined.includes('tailwind') || combined.includes('tw-')) {
        if (!topics.includes('tailwindcss')) topics.push('tailwindcss');
    }

    // HTML/CSS detection
    if (lang === 'html' || combined.includes('html')) {
        if (!topics.includes('html')) topics.push('html');
    }
    if (lang === 'css' || combined.includes('css')) {
        if (!topics.includes('css')) topics.push('css');
    }

    // JavaScript/TypeScript detection
    if (lang === 'javascript' || lang === 'typescript') {
        if (!topics.includes(lang)) topics.push(lang);
    }

    // Python detection
    if (lang === 'python' || combined.includes('python') || combined.includes('pyodide')) {
        if (!topics.includes('python')) topics.push('python');
    }

    // Node/Express detection
    if (combined.includes('express') || combined.includes('node') || combined.includes('api') || combined.includes('server')) {
        if (!topics.includes('nodejs')) topics.push('nodejs');
    }

    // MongoDB detection
    if (combined.includes('mongo') || combined.includes('mongoose')) {
        if (!topics.includes('mongodb')) topics.push('mongodb');
    }

    // Portfolio detection
    if (combined.includes('portfolio') || combined.includes('protfolio') || combined.includes('profile')) {
        if (!topics.includes('portfolio')) topics.push('portfolio');
    }

    // Full-stack detection
    if (topics.includes('react') && (topics.includes('nodejs') || topics.includes('mongodb'))) {
        if (!topics.includes('fullstack')) topics.push('fullstack');
    }

    return topics;
};

// ----------------------------
// GET /api/github/profile
// User profile data
// ----------------------------
router.get('/profile', async (req, res) => {
    try {
        const cached = getCached('profile');
        if (cached) return res.json({ success: true, data: cached });

        const profile = await ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
        const data = {
            login: profile.login,
            name: profile.name,
            avatar_url: profile.avatar_url,
            html_url: profile.html_url,
            bio: profile.bio,
            location: profile.location,
            blog: profile.blog,
            public_repos: profile.public_repos,
            public_gists: profile.public_gists,
            followers: profile.followers,
            following: profile.following,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
        };

        setCache('profile', data);
        res.json({ success: true, data });
    } catch (error) {
        console.error('GitHub profile error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------
// GET /api/github/repos
// All public repositories
// ----------------------------
router.get('/repos', async (req, res) => {
    try {
        const cached = getCached('repos');
        if (cached) return res.json({ success: true, count: cached.length, data: cached });

        // Fetch all pages of repos (max 100 per page)
        let page = 1;
        let allRepos = [];
        let hasMore = true;

        while (hasMore) {
            const repos = await ghFetch(
                `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated&direction=desc`
            );
            allRepos = allRepos.concat(repos);
            hasMore = repos.length === 100;
            page++;
        }

        const data = allRepos.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: inferTopics(repo),
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            watchers_count: repo.watchers_count,
            open_issues_count: repo.open_issues_count,
            size: repo.size,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            fork: repo.fork,
            archived: repo.archived,
            visibility: repo.visibility,
            default_branch: repo.default_branch,
        }));

        setCache('repos', data);
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        console.error('GitHub repos error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------
// GET /api/github/repos/:name/languages
// Languages for a specific repo
// ----------------------------
router.get('/repos/:name/languages', async (req, res) => {
    try {
        const { name } = req.params;
        const cacheKey = `lang-${name}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json({ success: true, data: cached });

        const languages = await ghFetch(`${GITHUB_API}/repos/${GITHUB_USERNAME}/${name}/languages`);
        setCache(cacheKey, languages);
        res.json({ success: true, data: languages });
    } catch (error) {
        console.error('GitHub languages error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------
// GET /api/github/stats
// Aggregated stats (contributions, profile views, etc.)
// ----------------------------
router.get('/stats', async (req, res) => {
    try {
        const cached = getCached('stats');
        if (cached) return res.json({ success: true, data: cached });

        // Fetch profile + repos + events in parallel
        const [profile, repos, events] = await Promise.all([
            ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
            ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
            ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=100`),
        ]);

        // Count stars and forks across all repos
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

        // Count event types
        const pushEvents = events.filter(e => e.type === 'PushEvent');
        const prEvents = events.filter(e => e.type === 'PullRequestEvent');
        const issueEvents = events.filter(e => e.type === 'IssuesEvent');
        const createEvents = events.filter(e => e.type === 'CreateEvent');

        // Count total commits from push events
        const totalCommits = pushEvents.reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0);

        // Aggregate commits by month from events
        const commitsByMonth = {};
        pushEvents.forEach(e => {
            const month = new Date(e.created_at).toLocaleString('en-US', { month: 'short' });
            commitsByMonth[month] = (commitsByMonth[month] || 0) + (e.payload?.commits?.length || 0);
        });

        // Aggregate events by month
        const eventsByMonth = {};
        events.forEach(e => {
            const month = new Date(e.created_at).toLocaleString('en-US', { month: 'short' });
            if (!eventsByMonth[month]) eventsByMonth[month] = { commits: 0, prs: 0, issues: 0 };
            if (e.type === 'PushEvent') eventsByMonth[month].commits += (e.payload?.commits?.length || 0);
            if (e.type === 'PullRequestEvent') eventsByMonth[month].prs++;
            if (e.type === 'IssuesEvent') eventsByMonth[month].issues++;
        });

        // Convert to chart-friendly array
        const monthlyActivity = Object.entries(eventsByMonth).map(([month, data]) => ({
            month,
            ...data,
        })).reverse();

        // Language distribution across all repos
        const languageCount = {};
        repos.forEach(r => {
            if (r.language) {
                languageCount[r.language] = (languageCount[r.language] || 0) + 1;
            }
        });

        // Events by day of week (for heatmap)
        const dayOfWeekActivity = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
        events.forEach(e => {
            const day = new Date(e.created_at).getDay();
            // Convert Sunday=0 to index 6, Monday=1 to 0, etc.
            const idx = day === 0 ? 6 : day - 1;
            dayOfWeekActivity[idx]++;
        });

        // Events by hour (for heatmap)
        const hourActivity = new Array(24).fill(0);
        events.forEach(e => {
            const hour = new Date(e.created_at).getHours();
            hourActivity[hour]++;
        });

        // Project status from repos
        const archivedCount = repos.filter(r => r.archived).length;
        const activeCount = repos.filter(r => {
            const pushed = new Date(r.pushed_at);
            const daysAgo = (Date.now() - pushed.getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo < 90 && !r.archived;
        }).length;
        const inactiveCount = repos.length - activeCount - archivedCount;

        const data = {
            profile: {
                login: profile.login,
                name: profile.name,
                avatar_url: profile.avatar_url,
                bio: profile.bio,
                public_repos: profile.public_repos,
                followers: profile.followers,
                following: profile.following,
            },
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
                inactive: inactiveCount,
                archived: archivedCount,
            },
            topRepos: repos
                .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
                .slice(0, 6)
                .map(r => ({
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
                })),
        };

        setCache('stats', data);
        res.json({ success: true, data });
    } catch (error) {
        console.error('GitHub stats error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ----------------------------
// GET /api/github/events
// Recent activity events
// ----------------------------
router.get('/events', async (req, res) => {
    try {
        const cached = getCached('events');
        if (cached) return res.json({ success: true, count: cached.length, data: cached });

        const events = await ghFetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=100`);
        const data = events.map(e => ({
            id: e.id,
            type: e.type,
            repo: e.repo?.name,
            created_at: e.created_at,
            payload: {
                action: e.payload?.action,
                commits: e.type === 'PushEvent' ? e.payload?.commits?.map(c => ({
                    sha: c.sha?.substring(0, 7),
                    message: c.message,
                })) : undefined,
                ref: e.payload?.ref,
                ref_type: e.payload?.ref_type,
            },
        }));

        setCache('events', data);
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        console.error('GitHub events error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
