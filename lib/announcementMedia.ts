/** Detect video from URL (path or data URL) when MIME was missing at upload. */
export function isLikelyVideoUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim().toLowerCase();
  if (u.startsWith('data:video/')) return true;
  const base = u.split('?')[0].split('#')[0];
  return /\.(mp4|webm|mov|mkv|m4v|ogv|3gp|avi)$/i.test(base);
}

export function resolveAnnouncementMedia(announcement: {
  videoUrl?: string;
  imageUrl?: string;
}): { videoSrc: string | null; imageSrc: string | null } {
  const v = (announcement.videoUrl || '').trim();
  const i = (announcement.imageUrl || '').trim();
  if (v) return { videoSrc: v, imageSrc: null };
  if (i && isLikelyVideoUrl(i)) return { videoSrc: i, imageSrc: null };
  if (i) return { videoSrc: null, imageSrc: i };
  return { videoSrc: null, imageSrc: null };
}
