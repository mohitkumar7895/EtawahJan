import type { PDFDocument, PDFImage, PDFPage, PDFFont } from 'pdf-lib';
import { hexToPdfRgb } from './fonts';

/** Common PDF symbol replacements when standard fonts are used */
const CHAR_REPLACEMENTS: Record<string, string> = {
  '\u25cf': '*', // ●
  '\u25cb': 'o', // ○
  '\u25a0': '#', // ■
  '\u25aa': '*', // ▪
  '\u2022': '*', // •
  '\u2023': '>', // ‣
  '\u2713': 'v', // ✓
  '\u2714': 'v', // ✔
  '\u2717': 'x', // ✗
  '\u2718': 'x', // ✘
  '\u20b9': 'Rs', // ₹
  '\u2013': '-', // –
  '\u2014': '-', // —
  '\u2018': "'",
  '\u2019': "'",
  '\u201c': '"',
  '\u201d': '"',
  '\u00a0': ' ',
};

const DEVANAGARI_RE = /[\u0900-\u097F]/;

export function sanitizeForWinAnsi(text: string): string {
  let out = text;
  for (const [from, to] of Object.entries(CHAR_REPLACEMENTS)) {
    out = out.split(from).join(to);
  }
  return out;
}

/** True when text should be drawn via canvas image (Hindi, bullets, emoji, etc.) */
export function shouldRasterizeText(text: string): boolean {
  if (DEVANAGARI_RE.test(text)) return true;
  for (let i = 0; i < text.length; i++) {
    const cp = text.codePointAt(i)!;
    if (cp > 0xff) return true;
    if (cp > 0x7e && !isWinAnsiByte(cp)) return true;
    if (i + 1 < text.length && cp > 0xffff) i++;
  }
  return false;
}

/** WinAnsi bytes allowed above ASCII (pdf-lib StandardFonts) */
function isWinAnsiByte(cp: number): boolean {
  const winAnsiExtra = new Set([
    0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0,
    0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xda, 0xdb, 0xdc, 0xdd, 0xde,
    0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
    0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
    0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff, 0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5,
    0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xb0, 0xb1, 0xb2,
    0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf,
    0xc0, 0xc1, 0xc2, 0xc3,
  ]);
  return winAnsiExtra.has(cp);
}

export function renderTextToDataUrl(
  text: string,
  fontSizePx: number,
  fontFamily: string,
  color: string
): { dataUrl: string; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const px = Math.max(8, Math.round(fontSizePx));
  const font = `${px}px ${fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width) + 4;
  const height = Math.ceil(px * 1.2);

  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.fillText(text, 2, 0);

  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

async function drawTextImage(
  page: PDFPage,
  pdfDoc: PDFDocument,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  color: string
) {
  const { dataUrl, width, height } = renderTextToDataUrl(text, fontSize, fontFamily, color);
  const bytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
  const embedded: PDFImage = await pdfDoc.embedPng(bytes);
  page.drawImage(embedded, { x, y: y - height * 0.15, width, height });
}

export async function drawPdfText(
  page: PDFPage,
  pdfDoc: PDFDocument,
  opts: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    font: PDFFont;
    rgb: typeof import('pdf-lib')['rgb'];
  }
): Promise<void> {
  const { text, x, y, fontSize, fontFamily, color, font, rgb } = opts;

  if (!text.trim()) return;

  if (shouldRasterizeText(text)) {
    await drawTextImage(page, pdfDoc, text, x, y, fontSize, fontFamily, color);
    return;
  }

  const safe = sanitizeForWinAnsi(text);
  try {
    const { r, g, b } = hexToPdfRgb(color);
    page.drawText(safe, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
    });
  } catch {
    await drawTextImage(page, pdfDoc, text, x, y, fontSize, fontFamily, color);
  }
}
