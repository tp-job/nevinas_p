/**
 * Shared headers for GitHub API requests.
 * Used by routes/github.ts and sync/syncGitHub.ts.
 */
export function getGitHubHeaders(): Record<string, string> {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    return {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'nevinas-portfolio',
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    };
}

export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'tp-job';
export const GITHUB_API = 'https://api.github.com';
