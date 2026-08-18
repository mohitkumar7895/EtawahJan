import { NextRequest, NextResponse } from 'next/server';
import {
  ANNOUNCEMENT_IMAGE_MAX,
  inferAnnouncementMedia,
  uploadBufferToImageKit,
} from '@/lib/announcementMediaUpload';

/**
 * POST /api/announcements/upload
 * Images only → ImageKit. Videos must use POST /api/upload-video.
 * Field name: "file" (same as multer.single('file') in Express).
 */
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Expected form field "file".' }, { status: 400 });
    }

    const inferred = inferAnnouncementMedia(file);
    if (!inferred) {
      return NextResponse.json(
        {
          error:
            'Could not detect file type. Use JPG/PNG/… for this endpoint, or POST /api/upload-video for video.',
        },
        { status: 400 },
      );
    }

    if (inferred.kind === 'video') {
      return NextResponse.json(
        {
          error: 'Use POST /api/upload-video for video files (ImageKit streaming).',
        },
        { status: 400 },
      );
    }

    if (file.size > ANNOUNCEMENT_IMAGE_MAX) {
      const mb = Math.floor(ANNOUNCEMENT_IMAGE_MAX / (1024 * 1024));
      return NextResponse.json({ error: `Image too large. Max ${mb}MB.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    try {
      const result = await uploadBufferToImageKit({
        buffer,
        originalFileName: file.name || 'image.jpg',
        folder: '/announcements/images',
        mimeType: inferred.mime,
      });
      url = result.url;
    } catch (ikError: any) {
      console.warn('⚠️ ImageKit upload failed. Saving image locally instead.', ikError.message || ikError);
      
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const safeName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${safeName}`;
      const filePath = path.join(uploadDir, uniqueName);
      
      await fs.writeFile(filePath, buffer);
      url = `/uploads/images/${uniqueName}`;
    }

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        fileUrl: url,
        mediaType: 'image' as const,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('❌ /api/announcements/upload:', error);
    const status = message.includes('IMAGEKIT') || message.includes('ImageKit') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
