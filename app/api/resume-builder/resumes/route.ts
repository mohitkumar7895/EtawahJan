import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectDB } from '@/lib/db';
import Resume from '@/models/Resume';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { getSession } from '@/lib/resume-builder/session';
import { createDefaultResumeDocument } from '@/lib/resume-builder/types';
import { calculateCompletion, estimateAtsScore } from '@/lib/resume-builder/completion';
import { trackResumeEvent } from '@/lib/resume-builder/analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.trim();

  await connectDB();
  const filter: Record<string, unknown> = { userId: session.userId };
  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }

  const resumes = await Resume.find(filter).sort({ updatedAt: -1 }).lean();

  return NextResponse.json({
    resumes: resumes.map((r) => ({
      id: String(r._id),
      title: r.title,
      templateId: r.templateId,
      completionPercent: r.completionPercent,
      atsScore: r.atsScore,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
      isPublic: r.isPublic,
      shareSlug: r.shareSlug,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const doc = createDefaultResumeDocument(body.title || 'My Resume');
  if (body.templateId) doc.templateId = body.templateId;

  doc.completionPercent = calculateCompletion(doc);
  doc.atsScore = estimateAtsScore(doc);

  await connectDB();

  const resume = await Resume.create({
    userId: session.userId,
    title: doc.title,
    templateId: doc.templateId,
    theme: doc.theme,
    sections: doc.sections,
    content: doc.content,
    completionPercent: doc.completionPercent,
    atsScore: doc.atsScore,
    version: 1,
    shareSlug: `r-${randomBytes(6).toString('hex')}`,
    lastAutoSavedAt: new Date(),
  });

  await ResumeBuilderUser.findByIdAndUpdate(session.userId, {
    $inc: { resumeCount: 1 },
  });

  await trackResumeEvent('create', session.userId, String(resume._id));

  return NextResponse.json({
    resume: {
      id: String(resume._id),
      ...doc,
    },
  });
}
