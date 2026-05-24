import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/converter/jobStore';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getAnalytics());
}
