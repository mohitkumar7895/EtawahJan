'use client';

import {
  MousePointer2,
  Type,
  Highlighter,
  Eraser,
  ImagePlus,
  PenLine,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Sun,
  Moon,
  ScanText,
  Trash2,
} from 'lucide-react';
import { usePdfEditorStore } from '@/store/pdfEditorStore';
import { toast } from 'sonner';
import type { EditorTool } from '@/lib/pdf-editor/types';

const tools: { id: EditorTool; icon: typeof Type; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Edit text (double-click)' },
  { id: 'text', icon: Type, label: 'Add new text' },
  { id: 'highlight', icon: Highlighter, label: 'Highlight' },
  { id: 'whiteout', icon: Eraser, label: 'Whiteout' },
  { id: 'image', icon: ImagePlus, label: 'Image' },
  { id: 'signature', icon: PenLine, label: 'Sign' },
];

interface Props {
  onOpenSignature: () => void;
  onInsertImage: () => void;
}

export default function PdfToolbar({ onOpenSignature, onInsertImage }: Props) {
  const theme = usePdfEditorStore((s) => s.theme);
  const tool = usePdfEditorStore((s) => s.tool);
  const zoom = usePdfEditorStore((s) => s.zoom);
  const fileName = usePdfEditorStore((s) => s.fileName);
  const isExporting = usePdfEditorStore((s) => s.isExporting);
  const ocrProgress = usePdfEditorStore((s) => s.ocrProgress);
  const setTheme = usePdfEditorStore((s) => s.setTheme);
  const setTool = usePdfEditorStore((s) => s.setTool);
  const setZoom = usePdfEditorStore((s) => s.setZoom);
  const undo = usePdfEditorStore((s) => s.undo);
  const redo = usePdfEditorStore((s) => s.redo);
  const exportPdf = usePdfEditorStore((s) => s.exportPdf);
  const runOcrOnCurrentPage = usePdfEditorStore((s) => s.runOcrOnCurrentPage);
  const reset = usePdfEditorStore((s) => s.reset);

  const isDark = theme === 'dark';
  const bar = isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800';

  const handleExport = async () => {
    const blob = await exportPdf();
    if (!blob) {
      toast.error('Export failed');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName?.replace(/\.pdf$/i, '') + '_edited.pdf' || 'edited.pdf';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('PDF exported');
  };

  return (
    <header className={`flex flex-wrap items-center gap-2 border-b px-3 py-2 ${bar}`}>
      <div className="flex items-center gap-1 mr-2">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => {
              setTool(id);
              if (id === 'signature') onOpenSignature();
              if (id === 'image') onInsertImage();
            }}
            className={`rounded-lg p-2 transition ${
              tool === id
                ? 'bg-blue-600 text-white shadow'
                : isDark
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

      <button type="button" onClick={undo} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Undo">
        <Undo2 className="h-4 w-4" />
      </button>
      <button type="button" onClick={redo} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Redo">
        <Redo2 className="h-4 w-4" />
      </button>

      <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

      <button type="button" onClick={() => setZoom(zoom - 0.1)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
        <ZoomOut className="h-4 w-4" />
      </button>
      <span className="min-w-[3rem] text-center text-xs font-bold">{Math.round(zoom * 100)}%</span>
      <button type="button" onClick={() => setZoom(zoom + 0.1)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

      <button
        type="button"
        onClick={() => void runOcrOnCurrentPage()}
        disabled={ocrProgress !== null}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <ScanText className="h-4 w-4" />
        {ocrProgress !== null ? `${Math.round(ocrProgress * 100)}%` : 'OCR'}
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button type="button" onClick={reset} className="rounded-lg p-2 hover:bg-red-50 text-red-600" title="Close">
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>
    </header>
  );
}
