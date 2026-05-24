import type { PDFPageProxy } from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import type { TextEditItem } from './types';
import { topFromBaseline } from './coordinates';

interface TextItemLike {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
  hasEOL?: boolean;
}

function inferFontFamily(fontName?: string): string {
  if (!fontName) return 'Helvetica, Arial, sans-serif';
  const name = fontName.toLowerCase();
  if (name.includes('times') || name.includes('serif')) return 'Times New Roman, Times, serif';
  if (name.includes('courier') || name.includes('mono')) return 'Courier New, Courier, monospace';
  if (name.includes('helv') || name.includes('arial')) return 'Helvetica, Arial, sans-serif';
  return 'Helvetica, Arial, sans-serif';
}

function rgbFromTransform(): string {
  return '#000000';
}

function mergeLineItems(items: TextEditItem[]): TextEditItem[] {
  if (items.length === 0) return items;

  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
  const merged: TextEditItem[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    const sameLine = Math.abs(next.y - current.y) < current.fontSize * 0.6;
    const gap = next.x - (current.x + current.width);
    const closeEnough = gap < current.fontSize * 1.2;

    if (sameLine && closeEnough) {
      const spacer = gap > current.fontSize * 0.35 ? ' ' : '';
      current.text += spacer + next.text;
      current.originalText += spacer + next.originalText;
      current.width = next.x + next.width - current.x;
      current.height = Math.max(current.height, next.height);
      current.fontSize = Math.max(current.fontSize, next.fontSize);
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged;
}

export async function extractTextFromPage(
  page: PDFPageProxy,
  pageIndex: number,
  scale: number
): Promise<TextEditItem[]> {
  const viewport = page.getViewport({ scale });
  const textContent = await page.getTextContent();
  const pdfjs = await import('pdfjs-dist');
  const items: TextEditItem[] = [];

  for (const raw of textContent.items as TextItemLike[]) {
    if (!raw.str) continue;

    const tx = pdfjs.Util.transform(viewport.transform, raw.transform);
    const fontSize = Math.max(8, Math.hypot(tx[0], tx[1]));
    const x = tx[4];
    const baselineY = tx[5];
    const y = topFromBaseline(baselineY, fontSize);
    const displayText = raw.str;

    items.push({
      id: uuidv4(),
      pageIndex,
      originalText: displayText,
      text: displayText,
      x,
      y,
      baselineY,
      originalX: x,
      originalY: y,
      originalBaselineY: baselineY,
      width: Math.max(raw.width * scale, displayText.length * fontSize * 0.55),
      height: Math.max(fontSize * 1.2, raw.height * scale || fontSize * 1.2),
      fontSize,
      fontFamily: inferFontFamily(raw.fontName),
      color: rgbFromTransform(),
      align: 'left',
      deleted: false,
      modified: false,
      source: 'pdf',
    });
  }

  return mergeLineItems(items);
}
