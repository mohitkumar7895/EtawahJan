import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Analytics endpoint — historically backed by an in-memory job store.
 * That store is no longer the source of truth: in production the converter
 * runs synchronously per request (see `app/api/converter/jobs/route.ts`)
 * and there is no persistent job log on Vercel. Returning a static empty
 * summary keeps the admin dashboard from crashing. If you want real
 * analytics, persist conversion events to MongoDB or run the standalone
 * `server/converter` (BullMQ-backed) on a long-lived host.
 */
export async function GET() {
  return NextResponse.json({
    total: 0,
    completed: 0,
    failed: 0,
    active: 0,
    byTool: {},
    note: 'Analytics is not tracked in the serverless build of this app.',
  });
}
