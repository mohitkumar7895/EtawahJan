import { NextResponse } from 'next/server';
import { getSession } from '@/lib/resume-builder/session';
import { parseAiSkills } from '@/lib/resume-builder/schemas';
import { suggestSkills } from '@/lib/resume-builder/ai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = parseAiSkills(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const skills = suggestSkills(parsed.data.jobTitle, parsed.data.summary);
  return NextResponse.json({ skills });
}
