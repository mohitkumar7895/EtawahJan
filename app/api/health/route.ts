import { NextResponse } from 'next/server';
import { isDBConnected } from '@/lib/db';

export async function GET() {
  const dbStatus = isDBConnected() ? 'connected' : 'disconnected';
  return NextResponse.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
}










