import path from 'path';
import os from 'os';

// On serverless platforms (Vercel / AWS Lambda) the function bundle at
// `process.cwd()` (e.g. `/var/task`) is read-only — only `/tmp` is writable.
// Locally we keep using `<project>/tmp/converter` so files are easy to inspect.
const cwd = process.cwd();
const isServerless =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.LAMBDA_TASK_ROOT ||
  cwd.startsWith('/var/task') ||
  cwd === '/';

export const TMP_ROOT = isServerless
  ? path.join(os.tmpdir(), 'converter')
  : path.join(cwd, 'tmp', 'converter');
export const UPLOAD_DIR = path.join(TMP_ROOT, 'uploads');
export const OUTPUT_DIR = path.join(TMP_ROOT, 'outputs');

export function jobUploadDir(jobId: string) {
  return path.join(UPLOAD_DIR, jobId);
}

export function jobOutputDir(jobId: string) {
  return path.join(OUTPUT_DIR, jobId);
}
