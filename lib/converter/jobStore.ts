import type { ConversionJob, JobStatus } from './types';

// In Next.js App Router, every route handler bundles its imports independently
// (and dev-mode HMR re-evaluates modules), so a plain module-level `Map` ends
// up duplicated per route — the POST handler stores the job in one map and the
// GET /[id] handler reads from a different one, producing 404s.
// Pinning the map onto `globalThis` makes every copy of this module share the
// same singleton within a single Node.js process. (This still does not survive
// across processes / serverless invocations — see the README note.)
const globalForJobs = globalThis as unknown as {
  __converterJobs?: Map<string, ConversionJob>;
};

const jobs: Map<string, ConversionJob> =
  globalForJobs.__converterJobs ?? new Map<string, ConversionJob>();

if (!globalForJobs.__converterJobs) {
  globalForJobs.__converterJobs = jobs;
}

export function createJobRecord(id: string, toolId: string): ConversionJob {
  const job: ConversionJob = {
    id,
    toolId,
    status: 'queued',
    progress: 0,
    message: 'Queued',
    createdAt: new Date().toISOString(),
  };
  jobs.set(id, job);
  return job;
}

export function updateJob(id: string, patch: Partial<ConversionJob> & { status?: JobStatus }) {
  const current = jobs.get(id);
  if (!current) return;
  jobs.set(id, { ...current, ...patch });
}

export function getJob(id: string): ConversionJob | undefined {
  return jobs.get(id);
}

export function getAnalytics() {
  const all = [...jobs.values()];
  return {
    total: all.length,
    completed: all.filter((j) => j.status === 'completed').length,
    failed: all.filter((j) => j.status === 'failed').length,
    active: all.filter((j) => j.status === 'active' || j.status === 'queued').length,
    byTool: all.reduce<Record<string, number>>((acc, j) => {
      acc[j.toolId] = (acc[j.toolId] || 0) + 1;
      return acc;
    }, {}),
  };
}
