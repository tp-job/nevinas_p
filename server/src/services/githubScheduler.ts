import cron from 'node-cron';
import { syncGitHub } from '../sync/syncGitHub';

const SYNC_INTERVAL = process.env.GITHUB_SYNC_INTERVAL || '30'; // minutes

export function startGitHubScheduler(): void {
    // Run immediately on server start
    console.log('[GitHub Scheduler] Running initial sync...');
    syncGitHub().catch((err) => {
        console.error('[GitHub Scheduler] Initial sync failed:', err.message);
    });

    // Then run on cron schedule
    const cronExpr = `*/${SYNC_INTERVAL} * * * *`;
    cron.schedule(cronExpr, () => {
        console.log(`[GitHub Scheduler] Running scheduled sync (every ${SYNC_INTERVAL}min)...`);
        syncGitHub().catch((err) => {
            console.error('[GitHub Scheduler] Scheduled sync failed:', err.message);
        });
    });

    console.log(`[GitHub Scheduler] Scheduled every ${SYNC_INTERVAL} minutes`);
}
