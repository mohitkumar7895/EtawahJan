import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { getSession } from '@/lib/resume-builder/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectDB();
  const user = await ResumeBuilderUser.findById(session.userId).lean();
  if (!user || Array.isArray(user)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const u = user as unknown as { _id: unknown; name: string; email: string; role?: string; resumeCount?: number };

  return NextResponse.json({
    user: {
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      resumeCount: u.resumeCount,
    },
  });
}
