import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectDB } from '@/lib/db';
import Resume from '@/models/Resume';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { getSession } from '@/lib/resume-builder/session';

export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const source = await Resume.findOne({ _id: params.id, userId: session.userId });
  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const copy = await Resume.create({
    userId: session.userId,
    title: `${source.title} (Copy)`,
    templateId: source.templateId,
    theme: source.theme,
    sections: source.sections,
    content: source.content,
    completionPercent: source.completionPercent,
    atsScore: source.atsScore,
    version: 1,
    shareSlug: `r-${randomBytes(6).toString('hex')}`,
    lastAutoSavedAt: new Date(),
  });

  await ResumeBuilderUser.findByIdAndUpdate(session.userId, { $inc: { resumeCount: 1 } });

  return NextResponse.json({ id: String(copy._id) });
}
