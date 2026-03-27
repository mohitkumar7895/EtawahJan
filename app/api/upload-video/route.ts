import { NextRequest, NextResponse } from 'next/server';
import {
  ANNOUNCEMENT_VIDEO_MAX,
  inferAnnouncementMedia,
  uploadBufferToImageKit,
} from '@/lib/announcementMediaUpload';

/**
 * POST /api/upload-video
 * Multipart form field: "file" (same convention as Express + multer.single('file')).
 * Streams bytes to ImageKit — no local uploads/ folder. Returns HTTPS URL for <video src>.
 */
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Expected form field "file".' }, { status: 400 });
    }

    const inferred = inferAnnouncementMedia(file);
    if (!inferred || inferred.kind !== 'video') {
      return NextResponse.json(
        {
          error:
            'Not a video file. Use MP4, WebM, MOV, etc., or use POST /api/announcements/upload for images.',
        },
        { status: 400 },
      );
    }

    if (file.size > ANNOUNCEMENT_VIDEO_MAX) {
      const mb = Math.floor(ANNOUNCEMENT_VIDEO_MAX / (1024 * 1024));
      return NextResponse.json({ error: `Video too large. Max ~${mb}MB for this app (adjust ANNOUNCEMENT_VIDEO_MAX / ImageKit plan).` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url } = await uploadBufferToImageKit({
      buffer,
      originalFileName: file.name || 'video.mp4',
      folder: '/announcements/videos',
      mimeType: inferred.mime,
    });

    return NextResponse.json(
      {
        message: 'Video uploaded successfully',
        fileUrl: url,
        videoUrl: url,
        mediaType: 'video' as const,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('❌ /api/upload-video:', error);
    const status = message.includes('IMAGEKIT') || message.includes('ImageKit') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
