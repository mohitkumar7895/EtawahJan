import fs from 'fs/promises';
import path from 'path';

/** JPG/PNG → PDF using pdf-lib only (no sharp) */
export async function imagesToPdf(imagePaths: string[], outputPath: string): Promise<void> {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();

  for (const imgPath of imagePaths) {
    const buf = await fs.readFile(imgPath);
    const ext = path.extname(imgPath).toLowerCase();
    const embedded =
      ext === '.png' ? await pdf.embedPng(buf) : await pdf.embedJpg(buf);
    const { width, height } = embedded.scale(1);
    const page = pdf.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }

  await fs.writeFile(outputPath, await pdf.save());
}
