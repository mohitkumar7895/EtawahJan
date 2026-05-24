import type { ConversionJob, JobStatus } from './types';

const jobs = new Map<string, ConversionJob>();

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
