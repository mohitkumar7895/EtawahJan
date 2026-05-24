import { create } from 'zustand/react';
import type { StateCreator } from 'zustand/vanilla';
import { v4 as uuidv4 } from 'uuid';
import { loadPdfDocument, renderPageToDataUrl } from '@/lib/pdf-editor/pdfjs';
import { extractTextFromPage } from '@/lib/pdf-editor/extractText';
import { exportEditedPdf } from '@/lib/pdf-editor/exportPdf';
import { baselineFromTop } from '@/lib/pdf-editor/coordinates';
import { ocrWordsToTextItems, runBrowserOcr } from '@/lib/pdf-editor/ocr';
import type {
  EditorSnapshot,
  EditorTheme,
  EditorTool,
  HighlightItem,
  ImageItem,
  PageEditorData,
  SignatureItem,
  TextEditItem,
  WhiteoutItem,
} from '@/lib/pdf-editor/types';

const BASE_RENDER_SCALE = 1.5;

function clonePages(pages: Record<number, PageEditorData>): Record<number, PageEditorData> {
  return JSON.parse(JSON.stringify(pages));
}

function emptyPage(width: number, height: number): PageEditorData {
  return {
    dimensions: { width, height },
    textItems: [],
    highlights: [],
    whiteouts: [],
    images: [],
    signatures: [],
    renderScale: BASE_RENDER_SCALE,
  };
}

interface PdfEditorState {
  fileName: string | null;
  pdfBytes: Uint8Array | null;
  numPages: number;
  currentPage: number;
  zoom: number;
  theme: EditorTheme;
  tool: EditorTool;
  pages: Record<number, PageEditorData>;
  pageBackgrounds: Record<number, string>;
  history: EditorSnapshot[];
  historyIndex: number;
  isLoading: boolean;
  isExporting: boolean;
  ocrProgress: number | null;
  editingTextId: string | null;

  setTheme: (theme: EditorTheme) => void;
  setEditingTextId: (id: string | null) => void;
  setTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  setPage: (page: number) => void;
  loadPdfFile: (file: File) => Promise<void>;
  runOcrOnCurrentPage: () => Promise<void>;
  updateTextItem: (id: string, patch: Partial<TextEditItem>) => void;
  deleteTextItem: (id: string) => void;
  addTextItem: (pageIndex: number, x: number, y: number) => void;
  addHighlight: (item: Omit<HighlightItem, 'id'>) => void;
  addWhiteout: (item: Omit<WhiteoutItem, 'id'>) => void;
  addImage: (item: Omit<ImageItem, 'id'>) => void;
  addSignature: (item: Omit<SignatureItem, 'id'>) => void;
  moveObject: (
    pageIndex: number,
    type: 'text' | 'image' | 'signature',
    id: string,
    x: number,
    y: number
  ) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  exportPdf: () => Promise<Blob | null>;
  reset: () => void;
}

const pdfEditorStoreCreator: StateCreator<PdfEditorState> = (set, get) => ({
  fileName: null,
  pdfBytes: null,
  numPages: 0,
  currentPage: 0,
  zoom: 1,
  theme: 'light',
  tool: 'select',
  pages: {},
  pageBackgrounds: {},
  history: [],
  historyIndex: -1,
  isLoading: false,
  isExporting: false,
  ocrProgress: null,
  editingTextId: null,

  setTheme: (theme) => set({ theme }),
  setEditingTextId: (id) => set({ editingTextId: id }),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.4, zoom)) }),
  setPage: (page) => set({ currentPage: page }),

  loadPdfFile: async (file) => {
    set({ isLoading: true, ocrProgress: null });
    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);
      const doc = await loadPdfDocument(pdfBytes);
      const numPages = doc.numPages;
      const pages: Record<number, PageEditorData> = {};
      const pageBackgrounds: Record<number, string> = {};

      for (let i = 0; i < numPages; i++) {
        const page = await doc.getPage(i + 1);
        const rendered = await renderPageToDataUrl(page, BASE_RENDER_SCALE);
        pageBackgrounds[i] = rendered.dataUrl;

        const textItems = await extractTextFromPage(page, i, BASE_RENDER_SCALE);
        pages[i] = {
          ...emptyPage(rendered.width, rendered.height),
          textItems,
          renderScale: BASE_RENDER_SCALE,
        };
      }

      const snapshot: EditorSnapshot = { pages: clonePages(pages) };
      const totalText = Object.values(pages).reduce((n, p) => n + p.textItems.length, 0);
      set({
        fileName: file.name,
        pdfBytes,
        numPages,
        currentPage: 0,
        tool: 'select',
        pages,
        pageBackgrounds,
        history: [snapshot],
        historyIndex: 0,
        editingTextId: null,
        isLoading: false,
      });
      if (totalText === 0) {
        const { toast } = await import('sonner');
        toast.message('इस PDF में selectable text नहीं मिला', {
          description: 'Scanned PDF हो सकती है — OCR बटन से text निकालें, फिर edit करें।',
          duration: 8000,
        });
      }
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
      throw e;
    }
  },

  runOcrOnCurrentPage: async () => {
    const { currentPage, pageBackgrounds, pages } = get();
    const bg = pageBackgrounds[currentPage];
    if (!bg) return;

    set({ ocrProgress: 0 });
    try {
      const words = await runBrowserOcr(bg, (p) => set({ ocrProgress: p }));
      const textItems = ocrWordsToTextItems(words, currentPage);
      const nextPages = clonePages(pages);
      const existing = nextPages[currentPage].textItems.filter((t) => !t.deleted);
      nextPages[currentPage] = {
        ...nextPages[currentPage],
        textItems:
          existing.length === 0
            ? textItems
            : [...nextPages[currentPage].textItems, ...textItems],
      };
      set({ pages: nextPages, ocrProgress: null });
      get().pushHistory();
    } catch {
      set({ ocrProgress: null });
    }
  },

  updateTextItem: (id, patch) => {
    const { pages, currentPage } = get();
    const next = clonePages(pages);
    const page = next[currentPage];
    if (!page) return;
    page.textItems = page.textItems.map((t) => {
      if (t.id !== id) return t;
      const nextY = patch.y ?? t.y;
      const nextFontSize = patch.fontSize ?? t.fontSize;
      const next = {
        ...t,
        ...patch,
        baselineY: patch.baselineY ?? baselineFromTop(nextY, nextFontSize),
      };
      const moved =
        (patch.x !== undefined && Math.abs(patch.x - t.originalX) > 1) ||
        (patch.y !== undefined && Math.abs(patch.y - t.originalY) > 1);
      const textChanged = patch.text !== undefined ? patch.text !== t.originalText : next.text !== t.originalText;
      return { ...next, modified: textChanged || moved || t.modified };
    });
    set({ pages: next });
  },

  deleteTextItem: (id) => {
    get().pushHistory();
    const { pages, currentPage } = get();
    const next = clonePages(pages);
    const page = next[currentPage];
    if (!page) return;
    page.textItems = page.textItems.map((t) =>
      t.id === id ? { ...t, deleted: true, text: '', modified: true } : t
    );
    set({ pages: next, editingTextId: null });
  },

  addTextItem: (pageIndex, x, y) => {
    get().pushHistory();
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[pageIndex];
    if (!page) return;
    const id = uuidv4();
    page.textItems.push({
      id,
      pageIndex,
      originalText: '',
      text: 'New text',
      x,
      y,
      baselineY: baselineFromTop(y, 16),
      originalX: x,
      originalY: y,
      originalBaselineY: baselineFromTop(y, 16),
      width: 120,
      height: 24,
      fontSize: 16,
      fontFamily: 'Helvetica, Arial, sans-serif',
      color: '#000000',
      align: 'left',
      deleted: false,
      modified: true,
      source: 'user',
    });
    set({ pages: next, editingTextId: id });
  },

  addHighlight: (item) => {
    get().pushHistory();
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[item.pageIndex];
    if (!page) return;
    page.highlights.push({ ...item, id: uuidv4() });
    set({ pages: next });
  },

  addWhiteout: (item) => {
    get().pushHistory();
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[item.pageIndex];
    if (!page) return;
    page.whiteouts.push({ ...item, id: uuidv4() });
    set({ pages: next });
  },

  addImage: (item) => {
    get().pushHistory();
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[item.pageIndex];
    if (!page) return;
    page.images.push({ ...item, id: uuidv4() });
    set({ pages: next });
  },

  addSignature: (item) => {
    get().pushHistory();
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[item.pageIndex];
    if (!page) return;
    page.signatures.push({ ...item, id: uuidv4() });
    set({ pages: next });
  },

  moveObject: (pageIndex, type, id, x, y) => {
    const { pages } = get();
    const next = clonePages(pages);
    const page = next[pageIndex];
    if (!page) return;

    if (type === 'text') {
      page.textItems = page.textItems.map((t) => {
        if (t.id !== id) return t;
        const moved =
          Math.abs(x - t.originalX) > 1 || Math.abs(y - t.originalY) > 1;
        return {
          ...t,
          x,
          y,
          baselineY: baselineFromTop(y, t.fontSize),
          modified: t.modified || moved,
        };
      });
    } else if (type === 'image') {
      page.images = page.images.map((img) => (img.id === id ? { ...img, x, y } : img));
    } else {
      page.signatures = page.signatures.map((s) => (s.id === id ? { ...s, x, y } : s));
    }
    set({ pages: next });
  },

  pushHistory: () => {
    const { pages, history, historyIndex } = get();
    const snapshot: EditorSnapshot = { pages: clonePages(pages) };
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(snapshot);
    set({ history: trimmed, historyIndex: trimmed.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({ pages: clonePages(history[newIndex].pages), historyIndex: newIndex });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ pages: clonePages(history[newIndex].pages), historyIndex: newIndex });
  },

  exportPdf: async () => {
    const { pdfBytes, pages, fileName } = get();
    if (!pdfBytes) return null;
    set({ isExporting: true });
    try {
      const bytes = await exportEditedPdf(pdfBytes, pages, BASE_RENDER_SCALE);
      return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
    } finally {
      set({ isExporting: false });
    }
  },

  reset: () =>
    set({
      fileName: null,
      pdfBytes: null,
      numPages: 0,
      currentPage: 0,
      pages: {},
      pageBackgrounds: {},
      history: [],
      historyIndex: -1,
      editingTextId: null,
    }),
});

export const usePdfEditorStore = create<PdfEditorState>()(pdfEditorStoreCreator);
