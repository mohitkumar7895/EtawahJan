import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { parseLogin } from '@/lib/resume-builder/schemas';
import { verifyPassword } from '@/lib/resume-builder/password';
import { setSessionCookie } from '@/lib/resume-builder/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseLogin(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { email, password } = parsed.data;
    await connectDB();

    const user = await ResumeBuilderUser.findOne({ email });
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    user.lastLoginAt = new Date();
    await user.save();

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
