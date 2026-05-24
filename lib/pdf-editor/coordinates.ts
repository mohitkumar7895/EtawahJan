/** PDF page height (points) → pdf-lib bottom edge of a top-origin box */
export function pdfBottomY(
  pageHeight: number,
  topY: number,
  boxHeight: number,
  scaleY: number
): number {
  return pageHeight - (topY + boxHeight) * scaleY;
}

/** Top Y + font size → PDF.js text baseline (viewport pixels) */
export function baselineFromTop(topY: number, fontSize: number): number {
  return topY + fontSize;
}

/** PDF.js baseline → editor top Y (matches Fabric IText top-left) */
export function topFromBaseline(baselineY: number, fontSize: number): number {
  return baselineY - fontSize;
}
