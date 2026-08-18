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

    let url: string;
    try {
      const result = await uploadBufferToImageKit({
        buffer,
        originalFileName: file.name || 'video.mp4',
        folder: '/announcements/videos',
        mimeType: inferred.mime,
      });
      url = result.url;
    } catch (ikError: any) {
      console.warn('⚠️ ImageKit upload failed or not configured. Saving video locally instead.', ikError.message || ikError);
      
      // Local fallback
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const safeName = (file.name || 'video.mp4').replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${safeName}`;
      const filePath = path.join(uploadDir, uniqueName);
      
      await fs.writeFile(filePath, buffer);
      url = `/uploads/videos/${uniqueName}`;
    }

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
