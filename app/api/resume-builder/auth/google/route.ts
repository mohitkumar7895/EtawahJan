import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Google OAuth — set GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in env, then wire NextAuth or OAuth callback here. */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error: 'Google sign-in not configured',
        hint: 'Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google authentication.',
      },
      { status: 501 }
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jan-seva.site'}/api/resume-builder/auth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(url.toString());
}
