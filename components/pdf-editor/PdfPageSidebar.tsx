'use client';

import { usePdfEditorStore } from '@/store/pdfEditorStore';

export default function PdfPageSidebar() {
  const theme = usePdfEditorStore((s) => s.theme);
  const numPages = usePdfEditorStore((s) => s.numPages);
  const currentPage = usePdfEditorStore((s) => s.currentPage);
  const pageBackgrounds = usePdfEditorStore((s) => s.pageBackgrounds);
  const setPage = usePdfEditorStore((s) => s.setPage);

  const isDark = theme === 'dark';

  return (
    <aside
      className={`w-36 shrink-0 overflow-y-auto border-r p-2 ${
        isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <p className={`mb-2 px-1 text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Pages ({numPages})
      </p>
      <div className="space-y-2">
        {Array.from({ length: numPages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPage(i)}
            className={`w-full rounded-lg border-2 overflow-hidden transition ${
              currentPage === i
                ? 'border-blue-600 ring-2 ring-blue-500/30'
                : isDark
                  ? 'border-slate-700 hover:border-slate-600'
                  : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {pageBackgrounds[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pageBackgrounds[i]} alt={`Page ${i + 1}`} className="w-full h-auto" />
            ) : (
              <div className={`aspect-[3/4] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            )}
            <span
              className={`block py-1 text-center text-[10px] font-bold ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
