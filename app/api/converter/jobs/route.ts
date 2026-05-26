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
 * Tools that DEFINITELY cannot run on Vercel's default serverless runtime
 * because LibreOffice / Tesseract aren't part of the Lambda image. We only
 * gate these on Vercel — locally they work fine if the dev has the right
 * binaries / npm packages installed.
 *
 *   - office-*  → needs LibreOffice (`soffice`)
 *   - ocr-pdf   → tesseract.js worker bundle is too heavy for cold start
 *
 * `pdf-to-jpg`, `pdf-to-png`, `heic-to-jpg` are NOT blocked anymore — they
 * may work on Vercel when @napi-rs/canvas / sharp's bundled libheif are
 * available. If they fail, the real error message will surface instead of
 * being preemptively hidden.
 */
const VERCEL_BLOCKED_TOOLS = new Set([
  'word-to-pdf',
  'excel-to-pdf',
  'ppt-to-pdf',
  'pdf-to-word',
  'pdf-to-excel',
  'pdf-to-ppt',
  'html-to-pdf',
  'ocr-pdf',
]);

const IS_SERVERLESS =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.LAMBDA_TASK_ROOT;

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

    if (IS_SERVERLESS && VERCEL_BLOCKED_TOOLS.has(toolId)) {
      return NextResponse.json(
        {
          error: 'Tool unavailable on hosted converter',
          message:
            `${tool.name} requires LibreOffice (or a heavy OCR runtime) which ` +
            `is not available on the public web converter yet. Hum jaldi enable ` +
            `karenge — tab tak Compress PDF, Merge PDF, Split PDF, Image ` +
            `conversions try karein.`,
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
    // Always log the full error server-side so it's easy to grep in Vercel
    // logs / `npm run dev` terminal output.
    console.error('POST /api/converter/jobs: conversion failed', err);
    const msg = err instanceof Error ? err.message : 'Conversion failed';
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      {
        error: msg,
        // Expose the stack only in dev — keeps prod responses small and
        // doesn't leak file paths to end users.
        stack: process.env.NODE_ENV !== 'production' ? stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Best-effort cleanup of /tmp so we don't fill the Lambda's tmpfs.
    rm(uploadDir, { recursive: true, force: true }).catch(() => {});
    rm(outputDir, { recursive: true, force: true }).catch(() => {});
  }
}
