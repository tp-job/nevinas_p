import { Router, type Request, type Response } from 'express';
import { dataStore } from '../services/fileManager';
import { syncGitHub } from '../sync/syncGitHub';
import { getGitHubHeaders, GITHUB_USERNAME } from '../utils/githubRequest';
import { send404 } from '../utils/responseHelpers';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// ---------- GET /api/github/profile ----------
router.get('/profile', (_req: Request, res: Response): void => {
    const github = dataStore.github.readAll();
    const profile = github.profiles
        .slice()
        .sort((a, b) => new Date(b.synced_at).getTime() - new Date(a.synced_at).getTime())[0];
    if (!profile) {
        send404(res, 'No GitHub profile data. Run sync first.');
        return;
    }
    res.json({ success: true, data: profile });
});

// ---------- GET /api/github/repos ----------
router.get('/repos', (_req: Request, res: Response): void => {
    const github = dataStore.github.readAll();
    const repos = github.repos
        .slice()
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
    res.json({ success: true, count: repos.length, data: repos });
});

// ---------- GET /api/github/repos/:name/readme ----------
router.get('/repos/:name/readme', asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const apiRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${name}/readme`,
        { headers: getGitHubHeaders() }
    );

    if (!apiRes.ok) {
        if (apiRes.status === 404) {
            send404(res, 'README not found for this repository');
            return;
        }
        throw new Error(`GitHub API ${apiRes.status}: ${apiRes.statusText}`);
    }

    const readme = await apiRes.json();
    const content = readme.content ? Buffer.from(readme.content, 'base64').toString('utf-8') : '';
    const encoding = readme.encoding || 'base64';

    res.json({
        success: true,
        data: {
            content,
            encoding,
            name: readme.name || 'README.md',
            html_url: readme.html_url || null,
        },
    });
}));

// ---------- GET /api/github/repos/:name/languages ----------
router.get('/repos/:name/languages', asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const apiRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${name}/languages`,
        { headers: getGitHubHeaders() }
    );

    if (!apiRes.ok) {
        throw new Error(`GitHub API ${apiRes.status}: ${apiRes.statusText}`);
    }

    const languages = await apiRes.json();
    res.json({ success: true, data: languages });
}));

// ---------- GET /api/github/stats ----------
router.get('/stats', (_req: Request, res: Response): void => {
    const github = dataStore.github.readAll();
    const stats = github.stats
        .slice()
        .sort((a, b) => new Date(b.synced_at).getTime() - new Date(a.synced_at).getTime())[0];
    if (!stats) {
        send404(res, 'No GitHub stats data. Run sync first.');
        return;
    }
    res.json({ success: true, data: stats });
});

// ---------- GET /api/github/events ----------
router.get('/events', (_req: Request, res: Response): void => {
    const github = dataStore.github.readAll();
    const events = github.events
        .slice()
        .sort((a, b) => new Date(b.event_at).getTime() - new Date(a.event_at).getTime())
        .slice(0, 100);
    res.json({ success: true, count: events.length, data: events });
});

// ---------- POST /api/github/sync  (manual trigger) ----------
router.post('/sync', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    await syncGitHub();
    res.json({ success: true, message: 'GitHub data synced successfully' });
}));

export default router;
