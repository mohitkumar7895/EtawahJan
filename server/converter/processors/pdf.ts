import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

export async function mergePdfs(inputPaths: string[], outputPath: string) {
  const merged = await PDFDocument.create();
  for (const p of inputPaths) {
    const bytes = await fs.readFile(p);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  await fs.writeFile(outputPath, await merged.save());
}

export async function splitPdf(inputPath: string, outputDir: string): Promise<string[]> {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const outputs: string[] = [];

  for (let i = 0; i < doc.getPageCount(); i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(doc, [i]);
    newDoc.addPage(page);
    const out = path.join(outputDir, `page-${i + 1}.pdf`);
    await fs.writeFile(out, await newDoc.save());
    outputs.push(out);
  }
  return outputs;
}

export async function rotatePdf(
  inputPath: string,
  outputPath: string,
  rotation = 90
) {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = doc.getPages();
  pages.forEach((page) => {
    page.setRotation(degrees(rotation));
  });
  await fs.writeFile(outputPath, await doc.save());
}

export async function watermarkPdf(
  inputPath: string,
  outputPath: string,
  text: string
) {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(text || 'CONFIDENTIAL', {
      x: width * 0.15,
      y: height * 0.5,
      size: Math.min(width, height) * 0.08,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.35,
      rotate: degrees(-35),
    });
  }
  await fs.writeFile(outputPath, await doc.save());
}

export async function protectPdf(
  inputPath: string,
  outputPath: string,
  password: string
) {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const saved = await doc.save({
    userPassword: password,
    ownerPassword: password + '_owner',
  } as any);
  await fs.writeFile(outputPath, saved);
}

export async function unlockPdf(
  inputPath: string,
  outputPath: string,
  password?: string
) {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, {
    password: password || undefined,
    ignoreEncryption: true,
  } as any);
  const saved = await doc.save();
  await fs.writeFile(outputPath, saved);
}

export async function compressPdf(inputPath: string, outputPath: string) {
  const bytes = await fs.readFile(inputPath);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  await fs.writeFile(
    outputPath,
    await doc.save({ useObjectStreams: true, addDefaultPage: false })
  );
}

export async function txtToPdf(inputPath: string, outputPath: string) {
  const text = await fs.readFile(inputPath, 'utf-8');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([595, 842]);
  const lines = text.split(/\r?\n/);
  let y = 800;
  const size = 11;
  const lineHeight = 14;

  for (const line of lines) {
    if (y < 50) break;
    const chunks = line.match(/.{1,90}/g) || [''];
    for (const chunk of chunks) {
      page.drawText(chunk, { x: 50, y, size, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
      if (y < 50) break;
    }
  }
  await fs.writeFile(outputPath, await doc.save());
}

/**
 * Try to load a canvas implementation. We prefer @napi-rs/canvas because it
 * ships prebuilt binaries on all platforms (Windows / macOS / Linux x64+arm)
 * and needs no C++ toolchain at install time. Plain `canvas` is kept as a
 * fallback for repos that still have only that installed.
 *
 * Returns the underlying module so the caller can use createCanvas AND the
 * appropriate buffer-extraction API (which differs across implementations).
 */
type CanvasImpl = {
  createCanvas: (w: number, h: number) => any;
  // @napi-rs/canvas exposes `Image`, plain `canvas` doesn't.
  flavour: 'napi' | 'node';
};

async function loadCanvasImpl(): Promise<CanvasImpl> {
  const errors: string[] = [];

  try {
    const mod: any = await import(/* webpackIgnore: true */ '@napi-rs/canvas');
    if (mod?.createCanvas) return { createCanvas: mod.createCanvas, flavour: 'napi' };
  } catch (e: any) {
    errors.push(`@napi-rs/canvas: ${e?.message || e}`);
  }

  try {
    const mod: any = await import(/* webpackIgnore: true */ 'canvas');
    if (mod?.createCanvas) return { createCanvas: mod.createCanvas, flavour: 'node' };
  } catch (e: any) {
    errors.push(`canvas: ${e?.message || e}`);
  }

  throw new Error(
    'PDF to image requires a canvas implementation. ' +
      'Run `npm install @napi-rs/canvas` (recommended — prebuilt binaries) ' +
      'or `npm install canvas` (needs Cairo + build tools). ' +
      'Underlying errors: ' +
      errors.join(' | ')
  );
}

/**
 * Extract a PNG/JPEG Buffer from a canvas, transparently handling the API
 * difference between @napi-rs/canvas and node-canvas.
 *
 *   • @napi-rs/canvas: async `encode('jpeg' | 'png')` (preferred)
 *                     also has sync `toBuffer('image/...')` in newer versions
 *   • node-canvas:    sync `toBuffer('image/...')`
 */
async function canvasToBuffer(canvas: any, format: 'jpeg' | 'png'): Promise<Buffer> {
  if (typeof canvas.encode === 'function') {
    const out = await canvas.encode(format === 'jpeg' ? 'jpeg' : 'png');
    return Buffer.isBuffer(out) ? out : Buffer.from(out);
  }
  if (typeof canvas.toBuffer === 'function') {
    const out = canvas.toBuffer(format === 'jpeg' ? 'image/jpeg' : 'image/png');
    return Buffer.isBuffer(out) ? out : Buffer.from(out);
  }
  throw new Error('Canvas implementation has neither encode() nor toBuffer().');
}

/**
 * Locate `pdfjs-dist`'s on-disk asset folders so we can hand them to
 * pdfjs as `file://` URLs. Without these, pdfjs throws
 *   "Value is none of these types `String`, `Path`, `URL`."
 * the moment it tries to resolve a CMap or standard-font asset.
 *
 * We probe a few likely paths because Next.js bundling can shift cwd /
 * __dirname around (especially on Vercel where files live under /var/task).
 */
async function getPdfjsAssetUrls(): Promise<{
  standardFontDataUrl?: string;
  cMapUrl?: string;
}> {
  const candidates = [
    path.join(process.cwd(), 'node_modules', 'pdfjs-dist'),
    path.join('/var/task', 'node_modules', 'pdfjs-dist'),
  ];

  for (const root of candidates) {
    try {
      const fontsDir = path.join(root, 'standard_fonts');
      const cmapsDir = path.join(root, 'cmaps');
      // standard_fonts is the critical one — fail fast if it's missing.
      await fs.access(fontsDir);
      const standardFontDataUrl = pathToFileURL(fontsDir + path.sep).href;
      const cmapsExists = await fs
        .access(cmapsDir)
        .then(() => true)
        .catch(() => false);
      return {
        standardFontDataUrl,
        cMapUrl: cmapsExists ? pathToFileURL(cmapsDir + path.sep).href : undefined,
      };
    } catch {
      continue;
    }
  }
  return {}; // Caller will run with disableFontFace and accept missing-glyph boxes.
}

export async function pdfToImages(
  inputPath: string,
  outputDir: string,
  format: 'jpeg' | 'png',
  scale = 2
): Promise<string[]> {
  const { createCanvas } = await loadCanvasImpl();
  const pdfjs: any = await import(
    /* webpackIgnore: true */ 'pdfjs-dist/legacy/build/pdf.mjs'
  );

  const assets = await getPdfjsAssetUrls();
  const data = new Uint8Array(await fs.readFile(inputPath));

  // Production-grade pdfjs config for Node:
  //   • useSystemFonts:false  — Node has no font-config registry to query
  //   • disableFontFace:true  — pdfjs would otherwise call FontFace.load()
  //                              which doesn't exist outside the browser
  //   • isEvalSupported:false — avoid CSP / SES-blocked Function() calls
  //   • standardFontDataUrl   — file:// URL to bundled fonts so missing
  //                              base-14 substitutes render correctly
  //   • cMapPacked:true       — pdfjs ships .bcmap (binary) by default
  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: false,
    disableFontFace: true,
    isEvalSupported: false,
    cMapPacked: true,
    ...assets,
  });

  const pdf = await loadingTask.promise;
  const outputs: string[] = [];

  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      try {
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(
          Math.ceil(viewport.width),
          Math.ceil(viewport.height)
        );
        const ctx = canvas.getContext('2d');

        await page.render({
          canvasContext: ctx as unknown as CanvasRenderingContext2D,
          viewport,
        }).promise;

        const ext = format === 'jpeg' ? 'jpg' : 'png';
        const out = path.join(outputDir, `page-${i}.${ext}`);
        const buf = await canvasToBuffer(canvas, format);
        await fs.writeFile(out, buf);
        outputs.push(out);
      } finally {
        // pdfjs holds onto large per-page caches; explicit cleanup matters
        // a lot for >50-page PDFs on a memory-tight Lambda.
        page.cleanup();
      }
    }
  } finally {
    await pdf.cleanup().catch(() => {});
    await pdf.destroy().catch(() => {});
  }

  return outputs;
}
