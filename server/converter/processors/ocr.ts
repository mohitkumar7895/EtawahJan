import fs from 'fs/promises';
import path from 'path';
import { pdfToImages } from './pdf';

export async function ocrPdfToText(
  inputPath: string,
  outputPath: string,
  lang = 'eng',
  onProgress?: (pct: number) => void
): Promise<void> {
  const tmpDir = path.join(path.dirname(outputPath), '_ocr_pages');
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    const pages = await pdfToImages(inputPath, tmpDir, 'jpeg', 1.5);
    const Tesseract = await import('tesseract.js');
    const parts: string[] = [];

    for (let i = 0; i < pages.length; i++) {
      onProgress?.(Math.round(((i + 1) / pages.length) * 90));
      const result = await Tesseract.recognize(pages[i], lang);
      parts.push(`--- Page ${i + 1} ---\n${result.data.text}\n`);
    }

    await fs.writeFile(outputPath, parts.join('\n'), 'utf-8');
    onProgress?.(100);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function extractPdfText(inputPath: string, outputPath: string): Promise<void> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await fs.readFile(inputPath));
  const pdf = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    parts.push(`--- Page ${i} ---\n${text}\n`);
  }

  await fs.writeFile(outputPath, parts.join('\n'), 'utf-8');
}
