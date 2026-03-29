import ImageKit from '@imagekit/nodejs';
import { NextResponse } from 'next/server';

/**
 * Client-side ImageKit uploads need token + signature from the server.
 * Avoids proxying large video bodies through Next.js (413 on Vercel / many reverse proxies).
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
    if (!privateKey || !publicKey) {
      return NextResponse.json(
        {
          error:
            'Missing IMAGEKIT_PRIVATE_KEY or IMAGEKIT_PUBLIC_KEY. Set both for browser video uploads.',
        },
        { status: 503 },
      );
    }

    const client = new ImageKit({ privateKey });
    const expireAt = Math.floor(Date.now() / 1000) + 7200;
    const auth = client.helper.getAuthenticationParameters(undefined, expireAt);

    return NextResponse.json({ ...auth, publicKey });
  } catch (error: unknown) {
    console.error('❌ /api/imagekit-auth:', error);
    return NextResponse.json({ error: 'Failed to generate upload credentials' }, { status: 500 });
  }
}
