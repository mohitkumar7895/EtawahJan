import fs from 'fs/promises';
import path from 'path';
import type { JobOptions } from '../../../lib/converter/types';
import { zipDirectory } from '../utils/zip';
import * as pdf from './pdf';
import * as image from './image';
import * as office from './office';
import * as ocr from './ocr';

export interface ProcessContext {
  toolId: string;
  inputPaths: string[];
  outputDir: string;
  options: JobOptions;
  onProgress: (pct: number, message?: string) => void;
}

export interface ProcessResult {
  outputs: { name: string; path: string; size: number }[];
  zipPath?: string;
}

export async function runConversion(ctx: ProcessContext): Promise<ProcessResult> {
  const { toolId, inputPaths, outputDir, options, onProgress } = ctx;
  onProgress(10, 'Starting conversion…');

  const outputs: { name: string; path: string; size: number }[] = [];

  const addOutput = async (filePath: string, name?: string) => {
    const stat = await fs.stat(filePath);
    outputs.push({
      name: name || path.basename(filePath),
      path: filePath,
      size: stat.size,
    });
  };

  switch (toolId) {
    case 'merge-pdf': {
      const out = path.join(outputDir, 'merged.pdf');
      await pdf.mergePdfs(inputPaths, out);
      await addOutput(out, 'merged.pdf');
      break;
    }
    case 'split-pdf': {
      const pages = await pdf.splitPdf(inputPaths[0], outputDir);
      for (const p of pages) {
        await addOutput(p);
      }
      try {
        onProgress(80, 'Creating ZIP…');
        const zipPath = path.join(outputDir, 'split-pages.zip');
        await zipDirectory(outputDir, zipPath);
        return { outputs, zipPath };
      } catch {
        return { outputs };
      }
    }
    case 'rotate-pdf': {
      const out = path.join(outputDir, 'rotated.pdf');
      await pdf.rotatePdf(inputPaths[0], out, options.rotation ?? 90);
      await addOutput(out);
      break;
    }
    case 'watermark-pdf': {
      const out = path.join(outputDir, 'watermarked.pdf');
      await pdf.watermarkPdf(inputPaths[0], out, options.watermarkText || 'DRAFT');
      await addOutput(out);
      break;
    }
    case 'protect-pdf': {
      const out = path.join(outputDir, 'protected.pdf');
      await pdf.protectPdf(inputPaths[0], out, options.password || '1234');
      await addOutput(out);
      break;
    }
    case 'unlock-pdf': {
      const out = path.join(outputDir, 'unlocked.pdf');
      await pdf.unlockPdf(inputPaths[0], out, options.unlockPassword);
      await addOutput(out);
      break;
    }
    case 'compress-pdf': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '-compressed.pdf'));
        await pdf.compressPdf(inp, out);
        await addOutput(out);
      }
      break;
    }
    case 'pdf-to-jpg': {
      const imgs = await pdf.pdfToImages(inputPaths[0], outputDir, 'jpeg');
      for (const p of imgs) {
        await addOutput(p);
      }
      try {
        onProgress(85, 'Packaging ZIP…');
        const zipPath = path.join(outputDir, 'pdf-pages.zip');
        await zipDirectory(outputDir, zipPath);
        return { outputs, zipPath };
      } catch {
        return { outputs };
      }
    }
    case 'pdf-to-png': {
      const imgs = await pdf.pdfToImages(inputPaths[0], outputDir, 'png');
      for (const p of imgs) {
        await addOutput(p);
      }
      try {
        const zipPath = path.join(outputDir, 'pdf-pages.zip');
        await zipDirectory(outputDir, zipPath);
        return { outputs, zipPath };
      } catch {
        return { outputs };
      }
    }
    case 'jpg-to-pdf':
    case 'png-to-pdf': {
      const out = path.join(outputDir, 'converted.pdf');
      await image.imagesToPdf(inputPaths, out);
      await addOutput(out);
      break;
    }
    case 'txt-to-pdf': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.pdf'));
        await pdf.txtToPdf(inp, out);
        await addOutput(out);
      }
      break;
    }
    case 'word-to-pdf':
    case 'excel-to-pdf':
    case 'ppt-to-pdf': {
      for (const inp of inputPaths) {
        const out = await office.officeToPdf(inp, outputDir);
        await addOutput(out);
      }
      break;
    }
    case 'html-to-pdf': {
      for (const inp of inputPaths) {
        const out = await office.htmlToPdf(inp, outputDir);
        await addOutput(out);
      }
      break;
    }
    case 'pdf-to-word': {
      const out = await office.pdfToOffice(inputPaths[0], outputDir, 'docx');
      await addOutput(out);
      break;
    }
    case 'pdf-to-excel': {
      const out = await office.pdfToOffice(inputPaths[0], outputDir, 'xlsx');
      await addOutput(out);
      break;
    }
    case 'pdf-to-ppt': {
      const out = await office.pdfToOffice(inputPaths[0], outputDir, 'pptx');
      await addOutput(out);
      break;
    }
    case 'ocr-pdf': {
      const out = path.join(outputDir, 'ocr-result.txt');
      await ocr.ocrPdfToText(inputPaths[0], out, options.ocrLang || 'eng', onProgress);
      await addOutput(out);
      break;
    }
    case 'pdf-to-text': {
      const out = path.join(outputDir, 'extracted.txt');
      await ocr.extractPdfText(inputPaths[0], out);
      await addOutput(out);
      break;
    }
    case 'compress-image': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '-compressed' + path.extname(inp)));
        await image.compressImage(inp, out, options.quality ?? 75);
        await addOutput(out);
      }
      break;
    }
    case 'jpg-to-png': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.png'));
        await image.convertImageFormat(inp, out, 'png');
        await addOutput(out);
      }
      break;
    }
    case 'png-to-jpg': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.jpg'));
        await image.convertImageFormat(inp, out, 'jpeg');
        await addOutput(out);
      }
      break;
    }
    case 'webp-to-jpg': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.jpg'));
        await image.convertImageFormat(inp, out, 'jpeg');
        await addOutput(out);
      }
      break;
    }
    case 'jpg-to-webp': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.webp'));
        await image.convertImageFormat(inp, out, 'webp');
        await addOutput(out);
      }
      break;
    }
    case 'heic-to-jpg': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.jpg'));
        await image.heicToJpg(inp, out);
        await addOutput(out);
      }
      break;
    }
    case 'svg-to-png': {
      for (const inp of inputPaths) {
        const out = path.join(outputDir, image.outputName(inp, '.png'));
        await image.svgToPng(inp, out);
        await addOutput(out);
      }
      break;
    }
    case 'batch-convert': {
      for (let i = 0; i < inputPaths.length; i++) {
        const inp = inputPaths[i];
        const ext = path.extname(inp).toLowerCase();
        onProgress(10 + Math.round((i / inputPaths.length) * 70), `Processing ${i + 1}/${inputPaths.length}`);
        if (ext === '.pdf') {
          const out = path.join(outputDir, image.outputName(inp, '-compressed.pdf'));
          await pdf.compressPdf(inp, out);
          await addOutput(out);
        } else if (/\.(jpe?g|png|webp)$/i.test(ext)) {
          const out = path.join(outputDir, image.outputName(inp, '-compressed' + ext));
          await image.compressImage(inp, out, options.quality ?? 80);
          await addOutput(out);
        }
      }
      if (outputs.length > 1) {
        const zipPath = path.join(outputDir, 'batch-results.zip');
        await zipDirectory(outputDir, zipPath);
        return { outputs, zipPath };
      }
      break;
    }
    default:
      throw new Error(`Unknown tool: ${toolId}`);
  }

  onProgress(95, 'Finalizing…');

  if (outputs.length > 1 && toolId !== 'batch-convert') {
    try {
      const zipPath = path.join(outputDir, 'converted-files.zip');
      await zipDirectory(outputDir, zipPath);
      return { outputs, zipPath };
    } catch {
      return { outputs };
    }
  }

  return { outputs };
}
