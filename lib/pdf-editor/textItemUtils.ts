import type { PageEditorData, TextEditItem } from './types';

const POS_TOLERANCE = 1;

export function isTextChanged(item: TextEditItem): boolean {
  if (item.deleted) return true;
  if (item.source === 'user') return true;
  if (item.modified) return true;
  if (item.text !== item.originalText) return true;
  if (
    item.originalX !== undefined &&
    item.originalY !== undefined &&
    (Math.abs(item.x - item.originalX) > POS_TOLERANCE ||
      Math.abs(item.y - item.originalY) > POS_TOLERANCE)
  ) {
    return true;
  }
  return false;
}

export function shouldShowTextOverlay(item: TextEditItem, editingTextId: string | null): boolean {
  if (editingTextId === item.id) return true;
  return isTextChanged(item);
}

export function hasDocumentEdits(pages: Record<number, PageEditorData>): boolean {
  return Object.values(pages).some(
    (page) =>
      page.highlights.length > 0 ||
      page.whiteouts.length > 0 ||
      page.images.length > 0 ||
      page.signatures.length > 0 ||
      page.textItems.some(isTextChanged)
  );
}
