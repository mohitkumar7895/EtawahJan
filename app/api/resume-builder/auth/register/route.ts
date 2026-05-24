import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ResumeBuilderUser from '@/models/ResumeBuilderUser';
import { parseRegister } from '@/lib/resume-builder/schemas';
import { hashPassword } from '@/lib/resume-builder/password';
import { setSessionCookie } from '@/lib/resume-builder/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseRegister(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    await connectDB();

    const existing = await ResumeBuilderUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await ResumeBuilderUser.create({
      name,
      email,
      passwordHash: hashPassword(password),
    });

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
    const message = e instanceof Error ? e.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
