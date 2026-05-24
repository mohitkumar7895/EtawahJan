import fs from 'fs/promises';
import path from 'path';

async function getSharp() {
  try {
    return (await import(/* webpackIgnore: true */ 'sharp')).default;
  } catch {
    throw new Error(
      'Image processing requires the "sharp" package. Run: npm install sharp'
    );
  }
}

export async function convertImageFormat(
  inputPath: string,
  outputPath: string,
  format: 'jpeg' | 'png' | 'webp'
) {
  const sharp = await getSharp();
  const pipeline = sharp(inputPath);
  if (format === 'jpeg') {
    await pipeline.jpeg({ quality: 90, mozjpeg: true }).toFile(outputPath);
  } else if (format === 'png') {
    await pipeline.png({ compressionLevel: 8 }).toFile(outputPath);
  } else {
    await pipeline.webp({ quality: 88 }).toFile(outputPath);
  }
}

export async function compressImage(inputPath: string, outputPath: string, quality = 75) {
  const sharp = await getSharp();
  const meta = await sharp(inputPath).metadata();
  const format = meta.format;

  if (format === 'png') {
    await sharp(inputPath).png({ compressionLevel: 9, quality }).toFile(outputPath);
  } else if (format === 'webp') {
    await sharp(inputPath).webp({ quality }).toFile(outputPath);
  } else {
    await sharp(inputPath).jpeg({ quality, mozjpeg: true }).toFile(outputPath);
  }
}

export async function svgToPng(inputPath: string, outputPath: string) {
  const sharp = await getSharp();
  await sharp(inputPath, { density: 300 }).png().toFile(outputPath);
}

export async function heicToJpg(inputPath: string, outputPath: string) {
  const sharp = await getSharp();
  await sharp(inputPath).jpeg({ quality: 92 }).toFile(outputPath);
}

export async function imagesToPdf(
  imagePaths: string[],
  outputPath: string
): Promise<void> {
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

  const bytes = await pdf.save();
  await fs.writeFile(outputPath, bytes);
}

export function outputName(base: string, ext: string) {
  return path.basename(base, path.extname(base)) + ext;
}
