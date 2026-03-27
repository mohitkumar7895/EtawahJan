/**
 * Shared logic for announcement image/video uploads via ImageKit.
 * Next.js route handlers read multipart bodies with request.formData() (same role as multer.single('file') in Express).
 */

import ImageKit, { toFile } from '@imagekit/nodejs';

/** ImageKit free tier: 20MB images; keep under that unless plan allows more */
export const ANNOUNCEMENT_IMAGE_MAX = 5 * 1024 * 1024;

/**
  * ImageKit free tier: up to 100MB for video. Slight margin for overhead.
  * Increase if your ImageKit plan allows larger uploads.
  */
export const ANNOUNCEMENT_VIDEO_MAX = 95 * 1024 * 1024;

const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'ogv', '3gp']);
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']);

const VIDEO_MIME: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  m4v: 'video/x-m4v',
  ogv: 'video/ogg',
  '3gp': 'video/3gpp',
};

const IMAGE_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
};

export type InferredMedia = { kind: 'image' | 'video'; mime: string };

export function inferAnnouncementMedia(file: File): InferredMedia | null {
  const type = (file.type || '').trim().toLowerCase();
  if (type.startsWith('video/')) {
    return { kind: 'video', mime: file.type };
  }
  if (type.startsWith('image/')) {
    return { kind: 'image', mime: file.type };
  }

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (VIDEO_EXT.has(ext)) {
    return { kind: 'video', mime: VIDEO_MIME[ext] || 'video/mp4' };
  }
  if (IMAGE_EXT.has(ext)) {
    return { kind: 'image', mime: IMAGE_MIME[ext] || 'image/jpeg' };
  }
  return null;
}

function sanitizeImageKitFileName(originalName: string, fallbackExt: string): string {
  let base = (originalName.split('/').pop() || originalName).trim() || `upload.${fallbackExt}`;
  base = base.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  if (!base.includes('.')) {
    base = `${base}.${fallbackExt}`;
  }
  return base.slice(0, 180);
}

function getImageKitClient(): ImageKit {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey || !privateKey.trim()) {
    throw new Error(
      'Missing IMAGEKIT_PRIVATE_KEY. Add it in .env for production uploads (ImageKit dashboard → Developer).',
    );
  }
  return new ImageKit({ privateKey: privateKey.trim() });
}

/**
 * Upload raw bytes to ImageKit media library. Returns the permanent HTTPS URL (no local paths).
 */
export async function uploadBufferToImageKit(options: {
  buffer: Buffer;
  originalFileName: string;
  /** e.g. /announcements/videos */
  folder: string;
  mimeType: string;
}): Promise<{ url: string }> {
  const client = getImageKitClient();
  const ext = (options.originalFileName.split('.').pop() || 'bin').replace(/[^a-zA-Z0-9]/g, '') || 'bin';
  const fileName = sanitizeImageKitFileName(options.originalFileName, ext);

  const uploadable = await toFile(options.buffer, fileName, { type: options.mimeType });

  const response = await client.files.upload({
    file: uploadable,
    fileName,
    folder: options.folder,
    useUniqueFileName: true,
  });

  const url = response.url?.trim();
  if (!url) {
    throw new Error('ImageKit upload did not return url — check API keys and dashboard.');
  }

  return { url };
}
