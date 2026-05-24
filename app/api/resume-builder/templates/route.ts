import { NextResponse } from 'next/server';
import { RESUME_TEMPLATES } from '@/lib/resume-builder/templates';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ templates: RESUME_TEMPLATES });
}
