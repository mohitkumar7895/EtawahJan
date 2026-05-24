import { PDFDocument, rgb } from 'pdf-lib';
import type { PageEditorData } from './types';
import { hexToPdfRgb } from './fonts';
import { hasDocumentEdits, isTextChanged } from './textItemUtils';
import { pdfBottomY } from './coordinates';
import { drawEditedTextOnPage } from './exportTextOverlay';

export async function exportEditedPdf(
  originalBytes: Uint8Array,
  pages: Record<number, PageEditorData>,
  renderScale: number
): Promise<Uint8Array> {
  if (!hasDocumentEdits(pages)) {
    return originalBytes.slice();
  }

  const pdfDoc = await PDFDocument.load(originalBytes);
  const pageCount = pdfDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const pageData = pages[i];
    if (!pageData) continue;

    const page = pdfDoc.getPage(i);
    const { width: pdfW, height: pdfH } = page.getSize();
    const scaleX = pdfW / pageData.dimensions.width;
    const scaleY = pdfH / pageData.dimensions.height;

    for (const w of pageData.whiteouts) {
      page.drawRectangle({
        x: w.x * scaleX,
        y: pdfBottomY(pdfH, w.y, w.height, scaleY),
        width: w.width * scaleX,
        height: w.height * scaleY,
        color: rgb(1, 1, 1),
        borderWidth: 0,
      });
    }

    for (const item of pageData.textItems) {
      if (!isTextChanged(item)) continue;
      await drawEditedTextOnPage(page, pdfDoc, item, pdfH, scaleX, scaleY);
    }

    for (const h of pageData.highlights) {
      const { r, g, b } = hexToPdfRgb(h.color || '#FFFF00');
      page.drawRectangle({
        x: h.x * scaleX,
        y: pdfBottomY(pdfH, h.y, h.height, scaleY),
        width: h.width * scaleX,
        height: h.height * scaleY,
        color: rgb(r, g, b),
        opacity: 0.35,
        borderWidth: 0,
      });
    }

    for (const img of [...pageData.images, ...pageData.signatures]) {
      const pngBytes = await fetch(img.dataUrl).then((r) => r.arrayBuffer());
      const embedded = img.dataUrl.includes('image/jpeg')
        ? await pdfDoc.embedJpg(pngBytes)
        : await pdfDoc.embedPng(pngBytes);

      page.drawImage(embedded, {
        x: img.x * scaleX,
        y: pdfBottomY(pdfH, img.y, img.height, scaleY),
        width: img.width * scaleX,
        height: img.height * scaleY,
      });
    }
  }

  return pdfDoc.save();
}
