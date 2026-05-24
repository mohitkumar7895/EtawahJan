import path from 'path';

export const PORT = Number(process.env.CONVERTER_PORT || 4000);
export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const USE_REDIS = process.env.CONVERTER_USE_REDIS !== 'false';

export const MAX_FILE_SIZE = Number(process.env.CONVERTER_MAX_FILE_MB || 100) * 1024 * 1024;
export const MAX_FILES = Number(process.env.CONVERTER_MAX_FILES || 50);
export const JOB_TTL_MS = Number(process.env.CONVERTER_JOB_TTL_HOURS || 2) * 60 * 60 * 1000;
export const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;

export const TMP_ROOT = path.join(process.cwd(), 'tmp', 'converter');
export const UPLOAD_DIR = path.join(TMP_ROOT, 'uploads');
export const OUTPUT_DIR = path.join(TMP_ROOT, 'outputs');

export const LIBREOFFICE_PATH =
  process.env.LIBREOFFICE_PATH ||
  (process.platform === 'win32' ? 'soffice.exe' : 'soffice');

export const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';
