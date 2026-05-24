'use client';

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

let pdfjsModule: typeof import('pdfjs-dist') | null = null;

export async function getPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js runs in the browser only.');
  }

  if (!pdfjsModule) {
    pdfjsModule = await import('pdfjs-dist');
    pdfjsModule.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsModule.version}/build/pdf.worker.min.mjs`;
  }

  return pdfjsModule;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  return pdfjs.getDocument({ data: bytes.slice() }).promise;
}

export async function renderPageToDataUrl(
  page: PDFPageProxy,
  scale: number
): Promise<{ dataUrl: string; width: number; height: number; viewport: import('pdfjs-dist').PageViewport }> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  await page.render({ canvasContext: ctx, viewport }).promise;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: viewport.width,
    height: viewport.height,
    viewport,
  };
}
