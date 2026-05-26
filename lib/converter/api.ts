import type { ConversionJob, JobOptions } from './types';

const API_BASE = '/api/converter';

/**
 * Upload files and run a conversion. The server processes the request
 * synchronously and streams back exactly one file (auto-zipped if the
 * tool produced multiple outputs). This used to be a job/poll/download
 * dance; that didn't work on Vercel because each handler runs in a
 * different Lambda instance with its own memory and `/tmp`.
 *
 * The returned `ConversionJob` is synthesized client-side. Its `outputs[].url`
 * (and `zipUrl`) are object URLs (`blob:`) — they expire when this tab
 * closes, which is fine since the user clicks Download immediately.
 */
export async function uploadAndConvert(
  toolId: string,
  files: File[],
  options: JobOptions = {},
  onProgress?: (pct: number, message?: string) => void
): Promise<ConversionJob> {
  const form = new FormData();
  form.append('toolId', toolId);
  form.append('options', JSON.stringify(options));
  files.forEach((f) => form.append('files', f));

  onProgress?.(5, 'Uploading files…');

  // Fire-and-watch with a fake progress estimate. We don't get real progress
  // from the server in synchronous mode, so we simulate a smooth ramp until
  // the response actually arrives.
  let timer: ReturnType<typeof setInterval> | null = null;
  let fake = 10;
  if (onProgress) {
    timer = setInterval(() => {
      fake = Math.min(90, fake + Math.max(1, Math.round((90 - fake) * 0.06)));
      onProgress(fake, fake < 60 ? 'Processing…' : 'Almost done…');
    }, 400);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      body: form,
    });
  } finally {
    if (timer) clearInterval(timer);
  }

  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const err = await res.json().catch(() => ({}));
      // Log full payload (including server-side stack) so devs can debug
      // without having to dig into the dev-server terminal.
      // eslint-disable-next-line no-console
      console.error('[converter] server returned error:', err);
      const detail =
        err.message || err.error || `HTTP ${res.status}: Conversion failed`;
      throw new Error(detail);
    }
    throw new Error(`Conversion failed (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const outputName =
    res.headers.get('X-Output-Name') ||
    extractFilename(res.headers.get('Content-Disposition')) ||
    defaultName(toolId, blob.type);

  onProgress?.(100, 'Done');

  const blobUrl = URL.createObjectURL(blob);
  const isZip = blob.type === 'application/zip' || /\.zip$/i.test(outputName);

  // Build the same shape the UI expects.
  return {
    id: crypto.randomUUID(),
    toolId,
    status: 'completed',
    progress: 100,
    message: 'Done',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    outputs: [
      {
        name: outputName,
        url: blobUrl,
        size: blob.size,
      },
    ],
    zipUrl: isZip ? blobUrl : undefined,
  };
}

/**
 * In synchronous mode the URLs we return are already absolute `blob:` URLs
 * pointing at in-memory data, so this just passes them through. Kept as a
 * pass-through so existing UI imports don't have to change.
 */
export function downloadUrl(p: string): string {
  return p;
}

function extractFilename(disposition: string | null): string | null {
  if (!disposition) return null;
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  return match ? match[1] : null;
}

function defaultName(toolId: string, mime: string): string {
  if (mime === 'application/zip') return `${toolId}-result.zip`;
  if (mime === 'application/pdf') return `${toolId}-result.pdf`;
  if (mime.startsWith('image/')) {
    const ext = mime.split('/')[1] || 'bin';
    return `${toolId}-result.${ext}`;
  }
  if (mime === 'text/plain') return `${toolId}-result.txt`;
  return `${toolId}-result`;
}
