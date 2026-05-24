import { NextResponse } from 'next/server';
import { getSession } from '@/lib/resume-builder/session';
import { parseAiAts } from '@/lib/resume-builder/schemas';
import { analyzeAts } from '@/lib/resume-builder/ai';
import { trackResumeEvent } from '@/lib/resume-builder/analytics';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = parseAiAts(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const result = analyzeAts(parsed.data.resumeText, parsed.data.jobDescription);
  await trackResumeEvent('ai_ats', session.userId);

  return NextResponse.json(result);
}
