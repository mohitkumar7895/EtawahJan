import fs from 'fs/promises';
import path from 'path';
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

export async function pdfToImages(
  inputPath: string,
  outputDir: string,
  format: 'jpeg' | 'png',
  scale = 2
): Promise<string[]> {
  let createCanvas: any;
  try {
    const canvasPkg = 'canvas';
    createCanvas = (await import(/* webpackIgnore: true */ canvasPkg)).createCanvas;
  } catch {
    throw new Error(
      'PDF to image requires the "canvas" package. Run: npm install canvas'
    );
  }
  const pdfjs = await import(
    /* webpackIgnore: true */ 'pdfjs-dist/legacy/build/pdf.mjs'
  );

  const data = new Uint8Array(await fs.readFile(inputPath));
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
  const pdf = await loadingTask.promise;
  const outputs: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
    }).promise;

    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const out = path.join(outputDir, `page-${i}.${ext}`);
    const buf = canvas.toBuffer(format === 'jpeg' ? 'image/jpeg' : 'image/png');
    await fs.writeFile(out, buf);
    outputs.push(out);
  }

  return outputs;
}
