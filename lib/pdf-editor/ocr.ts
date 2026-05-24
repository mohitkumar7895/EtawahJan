import { v4 as uuidv4 } from 'uuid';
import type { TextEditItem } from './types';

export interface OcrWord {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export function ocrWordsToTextItems(
  words: OcrWord[],
  pageIndex: number
): TextEditItem[] {
  return words
    .filter((w) => w.text.trim() && w.confidence > 40)
    .map((w) => ({
      id: uuidv4(),
      pageIndex,
      originalText: w.text,
      text: w.text,
      x: w.x,
      y: w.y,
      baselineY: w.y + w.height * 0.85,
      originalX: w.x,
      originalY: w.y,
      originalBaselineY: w.y + w.height * 0.85,
      width: w.width,
      height: w.height,
      fontSize: Math.max(10, w.height * 0.85),
      fontFamily: 'Helvetica, Arial, sans-serif',
      color: '#000000',
      align: 'left' as const,
      deleted: false,
      modified: false,
      source: 'ocr' as const,
    }));
}

export async function runBrowserOcr(
  imageDataUrl: string,
  onProgress?: (p: number) => void
): Promise<OcrWord[]> {
  const Tesseract = await import('tesseract.js');
  const result = await Tesseract.recognize(imageDataUrl, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
  });

  const words: OcrWord[] = [];
  const data = result.data;

  if (data.words?.length) {
    for (const w of data.words) {
      if (!w.text?.trim()) continue;
      const b = w.bbox;
      words.push({
        text: w.text,
        x: b.x0,
        y: b.y0,
        width: b.x1 - b.x0,
        height: b.y1 - b.y0,
        confidence: w.confidence,
      });
    }
  } else if (data.lines?.length) {
    for (const line of data.lines) {
      if (!line.text?.trim()) continue;
      const b = line.bbox;
      words.push({
        text: line.text,
        x: b.x0,
        y: b.y0,
        width: b.x1 - b.x0,
        height: b.y1 - b.y0,
        confidence: line.confidence,
      });
    }
  }

  return words;
}
