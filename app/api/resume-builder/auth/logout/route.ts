import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/resume-builder/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
