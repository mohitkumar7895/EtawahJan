import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resume from '@/models/Resume';
import { trackResumeEvent } from '@/lib/resume-builder/analytics';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  const raw = await Resume.findOne({ shareSlug: params.slug, isPublic: true }).lean();
  if (!raw || Array.isArray(raw)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const resume = raw as unknown as {
    _id: unknown;
    userId: unknown;
    title: string;
    templateId: string;
    theme: unknown;
    sections: unknown;
    content: unknown;
  };

  await trackResumeEvent('share_view', String(resume.userId), String(resume._id));

  return NextResponse.json({
    resume: {
      title: resume.title,
      templateId: resume.templateId,
      theme: resume.theme,
      sections: resume.sections,
      content: resume.content,
    },
  });
}
