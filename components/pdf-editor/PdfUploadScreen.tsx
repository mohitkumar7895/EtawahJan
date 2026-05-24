'use client';

import { useCallback, useRef } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { usePdfEditorStore } from '@/store/pdfEditorStore';
import { toast } from 'sonner';

export default function PdfUploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const loadPdfFile = usePdfEditorStore((s) => s.loadPdfFile);
  const isLoading = usePdfEditorStore((s) => s.isLoading);
  const theme = usePdfEditorStore((s) => s.theme);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.');
        return;
      }
      try {
        await loadPdfFile(file);
        toast.success('PDF loaded successfully');
      } catch {
        toast.error('Failed to load PDF. Try another file.');
      }
    },
    [loadPdfFile]
  );

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-[70vh] flex items-center justify-center px-4 py-16 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      <div
        className={`max-w-xl w-full rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
          isDark
            ? 'border-slate-700 bg-slate-900/50 hover:border-blue-500'
            : 'border-slate-300 bg-white hover:border-blue-500 shadow-lg hover:shadow-xl'
        } ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${
            isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {isLoading ? (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          ) : (
            <Upload className="h-10 w-10" />
          )}
        </div>

        <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Upload PDF to Edit
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Click any text to edit — Adobe Acrobat style. Supports scanned PDFs via OCR.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Multi-page
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> OCR Support
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
