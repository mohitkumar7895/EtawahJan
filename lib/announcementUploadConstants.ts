/** Shared limits (safe to import from client — no server-only deps). */

export const ANNOUNCEMENT_IMAGE_MAX = 5 * 1024 * 1024;

/**
 * ImageKit free tier: up to 100MB for video. Slight margin for overhead.
 * Keep in sync with lib/announcementMediaUpload policy comments.
 */
export const ANNOUNCEMENT_VIDEO_MAX = 95 * 1024 * 1024;
