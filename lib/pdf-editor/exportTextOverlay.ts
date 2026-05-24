import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import type { TextEditItem } from './types';
import { pdfBottomY } from './coordinates';
import { renderTextToDataUrl } from './drawPdfText';

const COVER_PAD = 2;

/** Draw white cover + text image exactly where the editor shows it (WYSIWYG). */
export async function drawEditedTextOnPage(
  page: PDFPage,
  pdfDoc: PDFDocument,
  item: TextEditItem,
  pdfH: number,
  scaleX: number,
  scaleY: number
): Promise<void> {
  if (item.deleted || !item.text.trim()) {
    const coverTop = item.y - COVER_PAD;
    page.drawRectangle({
      x: (item.x - COVER_PAD) * scaleX,
      y: pdfBottomY(pdfH, coverTop, item.height + COVER_PAD * 2, scaleY),
      width: (item.width + COVER_PAD * 2) * scaleX,
      height: (item.height + COVER_PAD * 2) * scaleY,
      color: rgb(1, 1, 1),
      borderWidth: 0,
    });
    return;
  }

  const { dataUrl, width, height } = renderTextToDataUrl(
    item.text,
    item.fontSize,
    item.fontFamily,
    item.color
  );

  const coverH = Math.max(item.height, height) + COVER_PAD * 2;
  const coverW = Math.max(item.width, width) + COVER_PAD * 2;
  const coverTop = item.y - COVER_PAD;

  page.drawRectangle({
    x: (item.x - COVER_PAD) * scaleX,
    y: pdfBottomY(pdfH, coverTop, coverH, scaleY),
    width: coverW * scaleX,
    height: coverH * scaleY,
    color: rgb(1, 1, 1),
    borderWidth: 0,
  });

  const bytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
  const embedded = await pdfDoc.embedPng(bytes);

  page.drawImage(embedded, {
    x: item.x * scaleX,
    y: pdfBottomY(pdfH, item.y, height, scaleY),
    width: width * scaleX,
    height: height * scaleY,
  });
}
