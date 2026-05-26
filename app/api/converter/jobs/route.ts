import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, rm } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CONVERTER_TOOLS } from '@/lib/converter/tools';
import { runConversion } from '@/lib/converter/engine/runConversion';
import { jobOutputDir, jobUploadDir } from '@/lib/converter/paths';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Hobby max — Pro can raise to 90/300.

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per uploaded file

/**
 * Tools that cannot run on Vercel's default Node.js serverless runtime
 * because they require external system binaries or large native deps that
 * aren't part of the Lambda image.
 *   - office-*  → needs LibreOffice (`soffice`)
 *   - pdf-to-{jpg,png}  → needs `canvas` / `@napi-rs/canvas` native binary
 *   - ocr-pdf  → tesseract.js worker is too heavy for Lambda cold start
 *   - heic-to-jpg  → sharp on Vercel does not include libheif
 *
 * These are surfaced to the user with a helpful message instead of a 500.
 */
const SERVER_ONLY_TOOLS = new Set([
  'word-to-pdf',
  'excel-to-pdf',
  'ppt-to-pdf',
  'pdf-to-word',
  'pdf-to-excel',
  'pdf-to-ppt',
  'html-to-pdf',
  'pdf-to-jpg',
  'pdf-to-png',
  'ocr-pdf',
  'heic-to-jpg',
]);

const MIME_BY_EXT: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.zip': 'application/zip',
  '.txt': 'text/plain',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

function mimeFor(name: string) {
  return MIME_BY_EXT[path.extname(name).toLowerCase()] || 'application/octet-stream';
}

/**
 * Synchronous converter endpoint.
 *
 * Why: on Vercel each route handler runs in its own Lambda invocation, so
 * the previous queue/poll/download design does not work — the Map-based job
 * store and the `/tmp` files written by POST are not visible to a
 * subsequent GET that lands on a different instance.
 *
 * This handler does upload + convert + return-file in a single request.
 * For multi-output tools the result is auto-zipped server-side so the
 * client always gets exactly one file back.
 */
export async function POST(req: NextRequest) {
  const jobId = uuidv4();
  const uploadDir = jobUploadDir(jobId);
  const outputDir = jobOutputDir(jobId);

  try {
    const form = await req.formData();
    const toolId = String(form.get('toolId') || '');
    const tool = CONVERTER_TOOLS.find((t) => t.id === toolId);

    if (!tool) {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
    }

    if (SERVER_ONLY_TOOLS.has(toolId)) {
      return NextResponse.json(
        {
          error: 'Tool unavailable',
          message:
            `${tool.name} requires LibreOffice / native binaries which are not ` +
            `available on the public web converter. Hum jaldi ise add karenge — ` +
            `tab tak alternative tools (Compress PDF, Merge PDF, Image conversions) try karein.`,
        },
        { status: 503 }
      );
    }

    const fileEntries = form
      .getAll('files')
      .filter((f): f is File => f instanceof File);

    if (!fileEntries.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (fileEntries.length > tool.maxFiles) {
      return NextResponse.json(
        { error: `Max ${tool.maxFiles} files allowed for this tool` },
        { status: 400 }
      );
    }

    let options: Record<string, unknown> = {};
    const optionsRaw = form.get('options');
    if (optionsRaw) {
      try {
        options = JSON.parse(String(optionsRaw));
      } catch {
        return NextResponse.json({ error: 'Invalid options JSON' }, { status: 400 });
      }
    }

    await mkdir(uploadDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const inputPaths: string[] = [];
    for (const file of fileEntries) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024} MB)` },
          { status: 400 }
        );
      }
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(uploadDir, `${Date.now()}-${safe}`);
      const buf = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buf);
      inputPaths.push(filePath);
    }

    // Run conversion synchronously — no queue, no setImmediate.
    const result = await runConversion({
      toolId,
      inputPaths,
      outputDir,
      options,
      onProgress: () => {
        /* no progress channel in synchronous mode */
      },
    });

    // Decide which artifact to return. Multi-output tools always zip.
    let outFilePath: string;
    let outFileName: string;

    if (result.zipPath) {
      outFilePath = result.zipPath;
      outFileName = path.basename(result.zipPath);
    } else if (result.outputs.length === 1) {
      outFilePath = result.outputs[0].path;
      outFileName = result.outputs[0].name;
    } else if (result.outputs.length > 1) {
      // Engine didn't zip but produced multiple — that shouldn't happen with
      // current code, but keep a safe fallback.
      outFilePath = result.outputs[0].path;
      outFileName = result.outputs[0].name;
    } else {
      return NextResponse.json(
        { error: 'Conversion produced no output' },
        { status: 500 }
      );
    }

    const buf = await readFile(outFilePath);
    const contentType = mimeFor(outFileName);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${outFileName.replace(/"/g, '')}"`,
        'Content-Length': String(buf.length),
        'X-Output-Name': outFileName,
        'X-Output-Count': String(result.outputs.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('POST /api/converter/jobs:', err);
    const msg = err instanceof Error ? err.message : 'Conversion failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    // Best-effort cleanup of /tmp so we don't fill the Lambda's tmpfs.
    rm(uploadDir, { recursive: true, force: true }).catch(() => {});
    rm(outputDir, { recursive: true, force: true }).catch(() => {});
  }
}
