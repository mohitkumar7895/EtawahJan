import {
  PDFDocument,
  StandardFonts,
  rgb,
} from 'pdf-lib';
import type { PDFFont, PDFImage, PDFPage } from 'pdf-lib';
import {
  formatIndianRupees,
  toIndianWordsEn,
  toIndianWordsHi,
} from './numberToWords';

export interface PdfRow {
  value: number;
  label: string;
  qty: number;
  subtotal: number;
}

interface PdfInput {
  rows: PdfRow[];
  total: number;
  totalPieces: number;
}

// The canonical Jan Seva brand mark used across the site (header, footer,
// share images, favicons). Same file the user sees in the navbar — keeps
// the receipt visually consistent with the rest of jan-seva.site.
const LOGO_URL = '/jan-seva-logo-1.png';

/**
 * Build a clean A4 cash-count receipt PDF.
 *
 * Why pdf-lib instead of `window.print()`:
 *   - Mobile browsers often render print previews blank or strip background
 *     gradients, ignoring our CSS.
 *   - Pop-up blockers and embedded browsers (e.g. WhatsApp/Facebook in-app)
 *     break native print entirely.
 *   - A real PDF can be saved, attached to email/WhatsApp, kept as a record.
 *
 * Note: pdf-lib's standard fonts (Helvetica) do not contain Devanagari
 * glyphs, so Hindi is rendered in romanised form (e.g. "Tetees Hazaar"),
 * which is what `numberToWords` already produces.
 */
export async function generateCashCountPdf(input: PdfInput): Promise<Uint8Array> {
  const { rows, total, totalPieces } = input;
  const filled = rows.filter((r) => r.qty > 0);

  const doc = await PDFDocument.create();
  doc.setTitle('Cash Count Receipt');
  doc.setAuthor('Arpit Jan Seva Kendra');
  doc.setSubject('Cash & Note Counter');
  doc.setCreator('Jan Seva Kendra Cash Counter');
  doc.setProducer('jan-seva.site/cash-counter');

  const page = doc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Logo is optional — falls back to text-only header on failure so the
  // receipt is never broken by a missing asset.
  const logo = await tryEmbedLogo(doc);

  // Palette
  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const grey = rgb(0.42, 0.45, 0.5);
  const greyLight = rgb(0.93, 0.94, 0.95);
  const emerald = rgb(0.04, 0.5, 0.34);
  const emeraldSoft = rgb(0.9, 0.97, 0.94);

  const M = 48; // page margin

  // ── Top accent bar ────────────────────────────────────────────────
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width,
    height: 8,
    color: emerald,
  });

  // ── Header: logo + brand on LEFT, date on RIGHT ───────────────────
  const headerTop = height - 24; // start under the accent bar
  const logoSize = 54;

  let textLeftX = M;
  if (logo) {
    page.drawImage(logo, {
      x: M,
      y: headerTop - logoSize,
      width: logoSize,
      height: logoSize,
    });
    textLeftX = M + logoSize + 14; // text starts to the right of the logo
  }

  // Brand text — vertically aligned with the logo, all left-justified.
  // Lines are placed top-down using fixed offsets from headerTop so the
  // baseline grid stays neat regardless of whether the logo embedded.
  page.drawText('Arpit Jan Seva Kendra', {
    x: textLeftX,
    y: headerTop - 16,
    size: 18,
    font: bold,
    color: black,
  });
  page.drawText('Bharthana, Etawah · Uttar Pradesh · 206242', {
    x: textLeftX,
    y: headerTop - 32,
    size: 9.5,
    font: regular,
    color: grey,
  });
  page.drawText('Phone: 9193898182, 7895094129  ·  www.jan-seva.site', {
    x: textLeftX,
    y: headerTop - 46,
    size: 9.5,
    font: regular,
    color: grey,
  });

  // Date / time block on the right, right-aligned.
  const dateStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  drawRightAligned(page, 'DATE & TIME', width - M, headerTop - 16, 8, bold, grey);
  drawRightAligned(page, dateStr, width - M, headerTop - 32, 10, regular, black);

  // Divider beneath the header block (covers logo height).
  let y = headerTop - logoSize - 12;
  page.drawLine({
    start: { x: M, y },
    end: { x: width - M, y },
    thickness: 1.2,
    color: black,
  });
  y -= 28;

  // ── Title (centered — single heading element, fine to center) ─────
  drawCentered(page, 'CASH COUNT RECEIPT', width / 2, y, 22, bold, black);
  const titleW = bold.widthOfTextAtSize('CASH COUNT RECEIPT', 22);
  page.drawLine({
    start: { x: (width - titleW) / 2, y: y - 4 },
    end: { x: (width + titleW) / 2, y: y - 4 },
    thickness: 1,
    color: emerald,
  });
  y -= 36;

  if (filled.length === 0) {
    // ── Empty state ─────────────────────────────────────────────────
    drawCentered(
      page,
      'Koi note count nahi kiya gaya.',
      width / 2,
      y - 60,
      14,
      bold,
      black
    );
    drawCentered(
      page,
      'Pehle denominations mein ginti daalein, fir PDF banayein.',
      width / 2,
      y - 80,
      10,
      regular,
      grey
    );
  } else {
    // ── Itemised table ──────────────────────────────────────────────
    const tableLeft = M;
    const tableRight = width - M;
    const tableWidth = tableRight - tableLeft;

    const colDenomX = tableLeft + 14;
    const colRateRightX = tableLeft + tableWidth * 0.55;
    const colNotesRightX = tableLeft + tableWidth * 0.78;
    const colAmountRightX = tableRight - 14;

    // Header strip
    const headerH = 26;
    page.drawRectangle({
      x: tableLeft,
      y: y - headerH + 8,
      width: tableWidth,
      height: headerH,
      color: black,
    });
    const headerY = y - 8;
    page.drawText('Denomination', {
      x: colDenomX,
      y: headerY,
      size: 10.5,
      font: bold,
      color: white,
    });
    drawRightAligned(page, 'Rate (Rs.)', colRateRightX, headerY, 10.5, bold, white);
    drawRightAligned(page, 'Notes', colNotesRightX, headerY, 10.5, bold, white);
    drawRightAligned(page, 'Amount (Rs.)', colAmountRightX, headerY, 10.5, bold, white);

    y -= headerH + 4;

    // Data rows (zebra striping for readability on print)
    const rowH = 22;
    for (let i = 0; i < filled.length; i++) {
      const r = filled[i];

      if (i % 2 === 1) {
        page.drawRectangle({
          x: tableLeft,
          y: y - 6,
          width: tableWidth,
          height: rowH,
          color: greyLight,
        });
      }

      page.drawText(`Rs. ${r.value}/- note`, {
        x: colDenomX,
        y,
        size: 11,
        font: regular,
        color: black,
      });
      drawRightAligned(page, formatIndianRupees(r.value), colRateRightX, y, 11, regular, black);
      drawRightAligned(page, String(r.qty), colNotesRightX, y, 11, regular, black);
      drawRightAligned(page, formatIndianRupees(r.subtotal), colAmountRightX, y, 11, bold, black);

      y -= rowH;
    }

    // Total row — emerald-tinted, sitting flush as the last row of the
    // table. Same style we had before the centered-box experiment.
    const totalH = 32;
    page.drawRectangle({
      x: tableLeft,
      y: y - totalH + 18,
      width: tableWidth,
      height: totalH,
      color: emeraldSoft,
      borderColor: emerald,
      borderWidth: 1.5,
    });
    // Box runs from (y - 14) to (y + 18). The previous baseline at y+6
    // sat near the top; y-2 puts the cap-height roughly through the
    // vertical centre of the box so it reads as a proper highlighted row.
    const totalY = y - 2;
    page.drawText('TOTAL', {
      x: colDenomX,
      y: totalY,
      size: 14,
      font: bold,
      color: emerald,
    });
    drawRightAligned(page, String(totalPieces), colNotesRightX, totalY, 14, bold, emerald);
    drawRightAligned(page, `Rs. ${formatIndianRupees(total)}`, colAmountRightX, totalY, 15, bold, emerald);

    y -= totalH + 24;

    // ── Amount in words ─────────────────────────────────────────────
    const wordsBoxH = 70;
    page.drawRectangle({
      x: tableLeft,
      y: y - wordsBoxH + 18,
      width: tableWidth,
      height: wordsBoxH,
      borderColor: grey,
      borderWidth: 0.8,
    });
    page.drawText('Amount in Words:', {
      x: tableLeft + 12,
      y: y + 6,
      size: 10,
      font: bold,
      color: black,
    });
    const enLine = `${toIndianWordsEn(total)} Rupees Only`;
    drawWrappedText(page, enLine, {
      x: tableLeft + 12,
      y: y - 10,
      maxWidth: tableWidth - 24,
      size: 11,
      font: bold,
      color: black,
      lineHeight: 14,
    });
    const hiLine = `(${toIndianWordsHi(total)} Rupaye Maatra)`;
    drawWrappedText(page, hiLine, {
      x: tableLeft + 12,
      y: y - 38,
      maxWidth: tableWidth - 24,
      size: 9.5,
      font: regular,
      color: grey,
      lineHeight: 12,
    });
  }

  // ── Footer (no signature blocks) ──────────────────────────────────
  page.drawLine({
    start: { x: M, y: M + 22 },
    end: { x: width - M, y: M + 22 },
    thickness: 0.4,
    color: greyLight,
  });
  drawCentered(
    page,
    'Generated by Arpit Jan Seva Kendra Cash Counter  ·  Free online tool  ·  jan-seva.site/cash-counter',
    width / 2,
    M + 8,
    8,
    regular,
    grey
  );

  return await doc.save();
}

// ── helpers ──────────────────────────────────────────────────────────

async function tryEmbedLogo(doc: PDFDocument): Promise<PDFImage | null> {
  try {
    const res = await fetch(LOGO_URL, { cache: 'force-cache' });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return await doc.embedPng(bytes);
  } catch {
    return null;
  }
}

function drawRightAligned(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightX - w, y, size, font, color });
}

function drawCentered(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: centerX - w / 2, y, size, font, color });
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  opts: {
    x: number;
    y: number;
    maxWidth: number;
    size: number;
    font: PDFFont;
    color: ReturnType<typeof rgb>;
    lineHeight: number;
  }
) {
  const { x, y, maxWidth, size, font, color, lineHeight } = opts;
  const words = text.split(/\s+/);
  let line = '';
  let cursorY = y;

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test;
    } else {
      if (line) {
        page.drawText(line, { x, y: cursorY, size, font, color });
        cursorY -= lineHeight;
      }
      line = w;
    }
  }
  if (line) {
    page.drawText(line, { x, y: cursorY, size, font, color });
  }
}
