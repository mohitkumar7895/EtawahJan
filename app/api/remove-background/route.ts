import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_URL = 'https://api.remove.bg/v1.0/removebg';
const MAX_FILE_BYTES = 12 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Remove.bg API key is not configured. Add REMOVE_BG_API_KEY to .env.local' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image_file') as File | null;
    const bgColorRaw = formData.get('bg_color');
    const formatRaw = formData.get('format');

    if (!imageFile || !(imageFile instanceof Blob) || imageFile.size === 0) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'Image is too large. Maximum size is 12 MB.' },
        { status: 400 }
      );
    }

    const format =
      typeof formatRaw === 'string' && ['png', 'jpg', 'webp'].includes(formatRaw)
        ? formatRaw
        : 'png';

    const removeBgForm = new FormData();
    removeBgForm.append('image_file', imageFile, imageFile.name || 'photo.jpg');
    removeBgForm.append('size', 'auto');
    removeBgForm.append('format', format);

    if (typeof bgColorRaw === 'string' && bgColorRaw.trim()) {
      removeBgForm.append('bg_color', bgColorRaw.replace('#', '').trim());
    }

    const response = await fetch(REMOVE_BG_URL, {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: removeBgForm,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let message = 'Remove.bg could not process this image';

      try {
        const parsed = JSON.parse(errorBody) as {
          errors?: Array<{ title?: string; detail?: string }>;
        };
        message =
          parsed.errors?.[0]?.title ||
          parsed.errors?.[0]?.detail ||
          message;
      } catch {
        if (errorBody) {
          message = errorBody.slice(0, 200);
        }
      }

      if (response.status === 402) {
        message = 'Remove.bg API credits finished. Please add credits or try again next month.';
      }

      return NextResponse.json({ error: message }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType =
      format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('remove.bg proxy error:', error);
    return NextResponse.json(
      { error: 'Background removal service failed. Please try again.' },
      { status: 500 }
    );
  }
}
