import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'rb_session';

export interface ResumeSessionPayload {
  userId: string;
  email: string;
  name: string;
}

function getSecret() {
  return process.env.RESUME_BUILDER_JWT_SECRET || process.env.NEXTAUTH_SECRET || 'resume-builder-dev-secret-change-me';
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function createSessionToken(payload: ResumeSessionPayload): Promise<string> {
  const data = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');
  return `${data}.${sign(data)}`;
}

export async function verifySessionToken(token: string): Promise<ResumeSessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  if (!safeEqual(sign(data), sig)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as ResumeSessionPayload & {
      exp?: number;
    };
    if (!parsed.userId || !parsed.email) return null;
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return { userId: String(parsed.userId), email: String(parsed.email), name: String(parsed.name || '') };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: ResumeSessionPayload) {
  const token = await createSessionToken(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSession(): Promise<ResumeSessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
