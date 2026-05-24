import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resume from '@/models/Resume';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { getSession } from '@/lib/resume-builder/session';
import { calculateCompletion, estimateAtsScore } from '@/lib/resume-builder/completion';
import { trackResumeEvent } from '@/lib/resume-builder/analytics';
import type { ResumeDocument } from '@/lib/resume-builder/types';

export const dynamic = 'force-dynamic';

async function getOwnedResume(id: string, userId: string) {
  await connectDB();
  return Resume.findOne({ _id: id, userId });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resume = await getOwnedResume(params.id, session.userId);
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    resume: {
      id: String(resume._id),
      title: resume.title,
      templateId: resume.templateId,
      theme: resume.theme,
      sections: resume.sections,
      content: resume.content,
      completionPercent: resume.completionPercent,
      atsScore: resume.atsScore,
      version: resume.version,
      isPublic: resume.isPublic,
      shareSlug: resume.shareSlug,
      updatedAt: resume.updatedAt,
    },
  });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resume = await getOwnedResume(params.id, session.userId);
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const doc = body as ResumeDocument;

  const nextVersion = (resume.version || 1) + 1;
  const history = [...(resume.history || []), {
    version: resume.version,
    savedAt: new Date(),
    snapshot: {
      title: resume.title,
      templateId: resume.templateId,
      theme: resume.theme,
      sections: resume.sections,
      content: resume.content,
    },
  }].slice(-10);

  const merged = {
    title: doc.title ?? resume.title,
    templateId: doc.templateId ?? resume.templateId,
    theme: doc.theme ?? resume.theme,
    sections: doc.sections ?? resume.sections,
    content: doc.content ?? resume.content,
  };

  const completionPercent = calculateCompletion({
    ...merged,
    completionPercent: 0,
    atsScore: 0,
    version: nextVersion,
  } as ResumeDocument);

  const atsScore = estimateAtsScore({
    ...merged,
    completionPercent,
    atsScore: 0,
    version: nextVersion,
  } as ResumeDocument);

  resume.title = merged.title;
  resume.templateId = merged.templateId;
  resume.theme = merged.theme;
  resume.sections = merged.sections;
  resume.content = merged.content;
  resume.completionPercent = completionPercent;
  resume.atsScore = atsScore;
  resume.version = nextVersion;
  resume.history = history;
  resume.lastAutoSavedAt = new Date();
  if (body.isPublic !== undefined) resume.isPublic = body.isPublic;

  await resume.save();
  await trackResumeEvent('edit', session.userId, String(resume._id));

  return NextResponse.json({ success: true, resume: { id: String(resume._id), completionPercent, atsScore, version: nextVersion } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const deleted = await Resume.findOneAndDelete({ _id: params.id, userId: session.userId });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await ResumeBuilderUser.findByIdAndUpdate(session.userId, { $inc: { resumeCount: -1 } });

  return NextResponse.json({ success: true });
}
