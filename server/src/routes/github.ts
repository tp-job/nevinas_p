import { Router, type Request, type Response } from 'express';
import GitHubProfile from '../models/GitHubProfile';
import GitHubRepo from '../models/GitHubRepo';
import GitHubEvent from '../models/GitHubEvent';
import GitHubStats from '../models/GitHubStats';
import { syncGitHub } from '../sync/syncGitHub';

const router = Router();

// ---------- GET /api/github/profile ----------
router.get('/profile', async (_req: Request, res: Response): Promise<void> => {
    try {
        const profile = await GitHubProfile.findOne().sort({ synced_at: -1 });
        if (!profile) {
            res.status(404).json({ success: false, message: 'No GitHub profile data. Run sync first.' });
            return;
        }
        res.json({ success: true, data: profile });
    } catch (err) {
        console.error('GitHub profile error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

// ---------- GET /api/github/repos ----------
router.get('/repos', async (_req: Request, res: Response): Promise<void> => {
    try {
        const repos = await GitHubRepo.find().sort({ pushed_at: -1 });
        res.json({ success: true, count: repos.length, data: repos });
    } catch (err) {
        console.error('GitHub repos error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

// ---------- GET /api/github/repos/:name/languages ----------
// Note: This still proxies to GitHub API since per-repo language breakdown
// is not stored in our sync. Cached at the sync level is not granular enough.
router.get('/repos/:name/languages', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'tp-job';

        const headers: Record<string, string> = {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'nevinas-portfolio',
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
        };

        const apiRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${name}/languages`,
            { headers }
        );

        if (!apiRes.ok) {
            throw new Error(`GitHub API ${apiRes.status}: ${apiRes.statusText}`);
        }

        const languages = await apiRes.json();
        res.json({ success: true, data: languages });
    } catch (err) {
        console.error('GitHub languages error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

// ---------- GET /api/github/stats ----------
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
    try {
        const stats = await GitHubStats.findOne().sort({ synced_at: -1 });
        if (!stats) {
            res.status(404).json({ success: false, message: 'No GitHub stats data. Run sync first.' });
            return;
        }

        // Convert Mongoose Map to plain object for JSON response
        const statsObj = stats.toJSON();
        if (stats.languageDistribution instanceof Map) {
            statsObj.languageDistribution = Object.fromEntries(stats.languageDistribution);
        }
        if (stats.commitsByMonth instanceof Map) {
            statsObj.commitsByMonth = Object.fromEntries(stats.commitsByMonth);
        }

        res.json({ success: true, data: statsObj });
    } catch (err) {
        console.error('GitHub stats error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

// ---------- GET /api/github/events ----------
router.get('/events', async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await GitHubEvent.find().sort({ event_at: -1 }).limit(100);
        res.json({ success: true, count: events.length, data: events });
    } catch (err) {
        console.error('GitHub events error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

// ---------- POST /api/github/sync  (manual trigger) ----------
router.post('/sync', async (_req: Request, res: Response): Promise<void> => {
    try {
        await syncGitHub();
        res.json({ success: true, message: 'GitHub data synced successfully' });
    } catch (err) {
        console.error('GitHub sync error:', (err as Error).message);
        res.status(500).json({ success: false, message: (err as Error).message });
    }
});

export default router;
