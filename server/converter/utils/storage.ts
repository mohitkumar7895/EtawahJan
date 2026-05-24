import fs from 'fs/promises';
import path from 'path';
import { OUTPUT_DIR, UPLOAD_DIR } from '../config';

export async function ensureDirs() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

export function jobUploadDir(jobId: string) {
  return path.join(UPLOAD_DIR, jobId);
}

export function jobOutputDir(jobId: string) {
  return path.join(OUTPUT_DIR, jobId);
}

export async function createJobDirs(jobId: string) {
  const upload = jobUploadDir(jobId);
  const output = jobOutputDir(jobId);
  await fs.mkdir(upload, { recursive: true });
  await fs.mkdir(output, { recursive: true });
  return { upload, output };
}

export async function removeJobDirs(jobId: string) {
  for (const dir of [jobUploadDir(jobId), jobOutputDir(jobId)]) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

export async function cleanupOldJobs(maxAgeMs: number) {
  const roots = [UPLOAD_DIR, OUTPUT_DIR];
  const now = Date.now();

  for (const root of roots) {
    let entries: string[] = [];
    try {
      entries = await fs.readdir(root);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const full = path.join(root, entry);
      try {
        const stat = await fs.stat(full);
        if (now - stat.mtimeMs > maxAgeMs) {
          await fs.rm(full, { recursive: true, force: true });
        }
      } catch {
        /* ignore */
      }
    }
  }
}
