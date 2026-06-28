import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import { scrapeLatestJobs } from '@/lib/scraper';

const SCRAPE_EVERY_SIX_HOURS = '0 */6 * * *';
const SCRAPE_INTERVAL_MS = 6 * 60 * 60 * 1000;

type ScrapeResult = Awaited<ReturnType<typeof scrapeLatestJobs>>;

type JobPortalGlobal = typeof globalThis & {
  jobPortalCronRegistered?: boolean;
  jobPortalCron?: ScheduledTask;
  jobPortalScrapePromise?: Promise<ScrapeResult> | null;
  jobPortalLastScrapeStartedAt?: number;
  jobPortalLastScrapeFinishedAt?: string;
  jobPortalLastScrapeError?: string;
};

const jobGlobal = globalThis as JobPortalGlobal;

async function runScrape(reason: string) {
  console.log(`⏰ Job portal scraper triggered (${reason})...`);
  jobGlobal.jobPortalLastScrapeStartedAt = Date.now();
  jobGlobal.jobPortalLastScrapeError = undefined;

  try {
    const result = await scrapeLatestJobs();
    jobGlobal.jobPortalLastScrapeFinishedAt = result.syncedAt;
    console.log(
      `⏰ Job portal scraper completed (${reason}). New: ${result.created}, Updated: ${result.updated}`
    );
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    jobGlobal.jobPortalLastScrapeError = message;
    console.error(`❌ Job portal scraper failed (${reason}):`, message);
    throw err;
  }
}

export function ensureJobPortalCron() {
  if (jobGlobal.jobPortalCronRegistered) {
    return;
  }

  console.log('⏰ Registering background Cron worker: Scrapes sarkariexam.com every 6 hours...');
  jobGlobal.jobPortalCron = cron.schedule(SCRAPE_EVERY_SIX_HOURS, () => {
    startJobPortalScrape('cron');
  });
  jobGlobal.jobPortalCronRegistered = true;
}

export function startJobPortalScrape(reason = 'manual') {
  if (jobGlobal.jobPortalScrapePromise) {
    console.log(`⏳ Job portal scraper already running. Skipping duplicate trigger (${reason}).`);
    return jobGlobal.jobPortalScrapePromise;
  }

  const promise = runScrape(reason).finally(() => {
    jobGlobal.jobPortalScrapePromise = null;
  });
  jobGlobal.jobPortalScrapePromise = promise;
  return promise;
}

export function startJobPortalScrapeIfStale(lastSync?: Date | string | null) {
  const lastSyncTime = lastSync ? new Date(lastSync).getTime() : 0;
  const lastStarted = jobGlobal.jobPortalLastScrapeStartedAt || 0;
  const newestKnownRun = Math.max(lastSyncTime || 0, lastStarted || 0);
  const isStale = !newestKnownRun || Date.now() - newestKnownRun > SCRAPE_INTERVAL_MS;

  if (isStale) {
    startJobPortalScrape(lastSync ? 'stale-data' : 'empty-data').catch(() => {
      // Error is already logged in runScrape; callers should keep serving cached/live data.
    });
  }
}

export function getJobPortalCronStatus() {
  return {
    cronRegistered: !!jobGlobal.jobPortalCronRegistered,
    cronRunning: !!jobGlobal.jobPortalCron,
    scrapeRunning: !!jobGlobal.jobPortalScrapePromise,
    schedule: 'every 6 hours (0 */6 * * *)',
    lastScrapeStartedAt: jobGlobal.jobPortalLastScrapeStartedAt
      ? new Date(jobGlobal.jobPortalLastScrapeStartedAt).toISOString()
      : null,
    lastScrapeFinishedAt: jobGlobal.jobPortalLastScrapeFinishedAt || null,
    lastScrapeError: jobGlobal.jobPortalLastScrapeError || null,
  };
}
