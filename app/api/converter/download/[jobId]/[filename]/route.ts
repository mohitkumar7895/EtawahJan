import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { jobOutputDir } from '@/lib/converter/paths';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string; filename: string } }
) {
  try {
    const safeName = path.basename(decodeURIComponent(params.filename));
    const filePath = path.join(jobOutputDir(params.jobId), safeName);

    if (!filePath.startsWith(jobOutputDir(params.jobId))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const buf = await readFile(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const types: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.zip': 'application/zip',
      '.txt': 'text/plain',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };

    return new NextResponse(buf, {
      headers: {
        'Content-Type': types[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
