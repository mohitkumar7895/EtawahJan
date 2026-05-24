import type { ConversionJob, JobOptions } from './types';

const API_BASE = '/api/converter';

export async function uploadAndConvert(
  toolId: string,
  files: File[],
  options: JobOptions = {},
  onProgress?: (pct: number, message?: string) => void
): Promise<ConversionJob> {
  const form = new FormData();
  form.append('toolId', toolId);
  form.append('options', JSON.stringify(options));
  files.forEach((f) => form.append('files', f));

  onProgress?.(5, 'Uploading files…');

  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Upload failed');
  }

  const job: ConversionJob = await res.json();
  onProgress?.(15, 'Queued for processing…');

  return pollJob(job.id, onProgress);
}

export async function pollJob(
  jobId: string,
  onProgress?: (pct: number, message?: string) => void
): Promise<ConversionJob> {
  const maxAttempts = 600;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch job status');

    const job: ConversionJob = await res.json();
    onProgress?.(job.progress, job.message);

    if (job.status === 'completed' || job.status === 'failed') {
      if (job.status === 'failed') {
        throw new Error(job.error || 'Conversion failed');
      }
      return job;
    }

    await new Promise((r) => setTimeout(r, 800));
    attempt++;
  }

  throw new Error('Conversion timed out');
}

export function downloadUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
