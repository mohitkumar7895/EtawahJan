import path from 'path';

export const TMP_ROOT = path.join(process.cwd(), 'tmp', 'converter');
export const UPLOAD_DIR = path.join(TMP_ROOT, 'uploads');
export const OUTPUT_DIR = path.join(TMP_ROOT, 'outputs');

export function jobUploadDir(jobId: string) {
  return path.join(UPLOAD_DIR, jobId);
}

export function jobOutputDir(jobId: string) {
  return path.join(OUTPUT_DIR, jobId);
}
