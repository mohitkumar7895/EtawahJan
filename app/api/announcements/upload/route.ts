import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const IMAGE_MAX = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX = 25 * 1024 * 1024; // 25MB (OK when saved as file path; avoid huge base64 in DB)

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

function inferMedia(file: File): { kind: 'image' | 'video'; mime: string } | null {
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

/**
 * Use base64 only on serverless hosts where public/ is not writable for persistent URLs.
 * Do NOT tie this to NODE_ENV — local `next start` should write to public/uploads like dev.
 */
function mustUseBase64Storage(): boolean {
  if (process.env.FORCE_BASE64_STORAGE === 'true') return true;
  const cwd = process.cwd();
  return !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    cwd.includes('/var/task') ||
    cwd.includes('/tmp') ||
    cwd === '/'
  );
}

/**
 * POST /api/announcements/upload
 * Image or video for announcement cards (URL stored on Announcement document).
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const inferred = inferMedia(file);
    if (!inferred) {
      return NextResponse.json(
        {
          error:
            'Could not detect file type. Use a common image (JPG, PNG, …) or video (MP4, WebM, MOV) — or rename the file with the correct extension.',
        },
        { status: 400 }
      );
    }

    const maxSize = inferred.kind === 'video' ? VIDEO_MAX : IMAGE_MAX;
    if (file.size > maxSize) {
      const mb = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File too large. Max ${inferred.kind === 'video' ? `${mb}MB for video` : `${mb}MB for image`}.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const useBase64 = mustUseBase64Storage();

    let fileUrl: string;

    if (useBase64) {
      const base64 = buffer.toString('base64');
      fileUrl = `data:${inferred.mime};base64,${base64}`;
    } else {
      try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        let ext = file.name.split('.').pop();
        if (!ext || ext.length > 8) {
          ext = inferred.kind === 'video' ? 'mp4' : 'jpg';
        }
        ext = ext.replace(/[^a-zA-Z0-9]/g, '') || (inferred.kind === 'video' ? 'mp4' : 'jpg');
        const filename = `${timestamp}-${randomStr}.${ext}`;

        const publicDir = join(process.cwd(), 'public');
        const uploadsDir = join(publicDir, 'uploads', 'announcements');
        await mkdir(uploadsDir, { recursive: true });

        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        fileUrl = `/uploads/announcements/${filename}`;
      } catch (fileError: unknown) {
        const msg = fileError instanceof Error ? fileError.message : 'Unknown error';
        console.warn('⚠️ Announcement upload FS failed, base64 fallback:', msg);
        const base64 = buffer.toString('base64');
        fileUrl = `data:${inferred.mime};base64,${base64}`;
      }
    }

    return NextResponse.json(
      {
        message: 'Uploaded successfully',
        fileUrl,
        mediaType: inferred.kind,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error uploading announcement media:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        message,
      },
      { status: 500 }
    );
  }
}
