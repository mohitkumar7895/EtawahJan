import fs from 'fs/promises';
import path from 'path';
import { LIBREOFFICE_PATH } from '../config';
import { commandExists, runCommand } from '../utils/exec';

let libreOfficeReady: boolean | null = null;

async function hasLibreOffice(): Promise<boolean> {
  if (libreOfficeReady !== null) return libreOfficeReady;
  libreOfficeReady = await commandExists(LIBREOFFICE_PATH);
  return libreOfficeReady;
}

export async function convertWithLibreOffice(
  inputPath: string,
  outputDir: string,
  targetFormat: string
): Promise<string> {
  if (!(await hasLibreOffice())) {
    throw new Error(
      'LibreOffice is not installed. Install LibreOffice Headless for Office conversions.'
    );
  }

  await fs.mkdir(outputDir, { recursive: true });
  await runCommand(
    LIBREOFFICE_PATH,
    [
      '--headless',
      '--nologo',
      '--nofirststartwizard',
      '--convert-to',
      targetFormat,
      '--outdir',
      outputDir,
      inputPath,
    ],
    180000
  );

  const base = path.basename(inputPath, path.extname(inputPath));
  const ext = targetFormat.split(':')[0];
  const outPath = path.join(outputDir, `${base}.${ext}`);
  try {
    await fs.access(outPath);
    return outPath;
  } catch {
    const files = await fs.readdir(outputDir);
    const match = files.find((f) => f.startsWith(base));
    if (!match) throw new Error('LibreOffice conversion produced no output');
    return path.join(outputDir, match);
  }
}

export async function officeToPdf(inputPath: string, outputDir: string) {
  return convertWithLibreOffice(inputPath, outputDir, 'pdf');
}

export async function pdfToOffice(
  inputPath: string,
  outputDir: string,
  format: 'docx' | 'xlsx' | 'pptx'
) {
  return convertWithLibreOffice(inputPath, outputDir, format);
}

export async function htmlToPdf(inputPath: string, outputDir: string) {
  return convertWithLibreOffice(inputPath, outputDir, 'pdf');
}
