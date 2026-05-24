import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CONVERTER_TOOLS } from '@/lib/converter/tools';
import { createJobRecord } from '@/lib/converter/jobStore';
import { processConversionJob } from '@/lib/converter/processJob';
import { jobOutputDir, jobUploadDir } from '@/lib/converter/paths';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const toolId = String(form.get('toolId') || '');
    const tool = CONVERTER_TOOLS.find((t) => t.id === toolId);

    if (!tool) {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
    }

    const fileEntries = form.getAll('files').filter((f): f is File => f instanceof File);
    if (!fileEntries.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (fileEntries.length > tool.maxFiles) {
      return NextResponse.json({ error: `Max ${tool.maxFiles} files allowed` }, { status: 400 });
    }

    let options = {};
    const optionsRaw = form.get('options');
    if (optionsRaw) {
      try {
        options = JSON.parse(String(optionsRaw));
      } catch {
        return NextResponse.json({ error: 'Invalid options JSON' }, { status: 400 });
      }
    }

    const jobId = uuidv4();
    const uploadDir = jobUploadDir(jobId);
    const outputDir = jobOutputDir(jobId);
    await mkdir(uploadDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const inputPaths: string[] = [];
    for (const file of fileEntries) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
      }
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(uploadDir, `${Date.now()}-${safe}`);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buf);
      inputPaths.push(filePath);
    }

    const job = createJobRecord(jobId, toolId);

    setImmediate(() => {
      processConversionJob({
        jobId,
        toolId,
        inputPaths,
        outputDir,
        options,
      }).catch((err) => console.error('Conversion job error:', err));
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error('POST /api/converter/jobs:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create job' },
      { status: 500 }
    );
  }
}
