export type EditorTheme = 'light' | 'dark';

export type EditorTool =
  | 'select'
  | 'text'
  | 'highlight'
  | 'whiteout'
  | 'image'
  | 'signature';

export interface TextEditItem {
  id: string;
  pageIndex: number;
  originalText: string;
  text: string;
  /** Canvas top-left X (PDF.js viewport coords) */
  x: number;
  /** Canvas top-left Y */
  y: number;
  /** PDF.js baseline Y (viewport pixels, top-origin) */
  baselineY: number;
  /** Position when loaded (detect moves) */
  originalX: number;
  originalY: number;
  originalBaselineY: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  deleted: boolean;
  modified: boolean;
  source: 'pdf' | 'ocr' | 'user';
}

export interface HighlightItem {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface WhiteoutItem {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageItem {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface SignatureItem {
  id: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export interface PageEditorData {
  dimensions: PageDimensions;
  textItems: TextEditItem[];
  highlights: HighlightItem[];
  whiteouts: WhiteoutItem[];
  images: ImageItem[];
  signatures: SignatureItem[];
  /** Rendered page preview for OCR / background */
  renderScale: number;
}

export interface EditorSnapshot {
  pages: Record<number, PageEditorData>;
}

export interface PdfDocumentMeta {
  fileName: string;
  numPages: number;
  pdfBytes: Uint8Array;
}
