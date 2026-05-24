'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, IText, Rect, FabricImage } from 'fabric';
import { usePdfEditorStore } from '@/store/pdfEditorStore';
import type { PageEditorData } from '@/lib/pdf-editor/types';
import { isTextChanged, shouldShowTextOverlay } from '@/lib/pdf-editor/textItemUtils';

function layoutKey(page: PageEditorData | undefined): string {
  if (!page) return '';
  return JSON.stringify({
    highlights: page.highlights,
    whiteouts: page.whiteouts,
    images: page.images.map((i) => i.id),
    signatures: page.signatures.map((s) => s.id),
    text: page.textItems.map((t) => ({
      id: t.id,
      deleted: t.deleted,
      modified: t.modified,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height,
      fontSize: t.fontSize,
      source: t.source,
    })),
  });
}

export default function PdfCanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const theme = usePdfEditorStore((s) => s.theme);
  const currentPage = usePdfEditorStore((s) => s.currentPage);
  const zoom = usePdfEditorStore((s) => s.zoom);
  const tool = usePdfEditorStore((s) => s.tool);
  const pages = usePdfEditorStore((s) => s.pages);
  const pageBackgrounds = usePdfEditorStore((s) => s.pageBackgrounds);
  const historyIndex = usePdfEditorStore((s) => s.historyIndex);
  const editingTextId = usePdfEditorStore((s) => s.editingTextId);
  const setEditingTextId = usePdfEditorStore((s) => s.setEditingTextId);
  const updateTextItem = usePdfEditorStore((s) => s.updateTextItem);
  const deleteTextItem = usePdfEditorStore((s) => s.deleteTextItem);
  const addTextItem = usePdfEditorStore((s) => s.addTextItem);
  const addHighlight = usePdfEditorStore((s) => s.addHighlight);
  const addWhiteout = usePdfEditorStore((s) => s.addWhiteout);
  const pushHistory = usePdfEditorStore((s) => s.pushHistory);

  const pageData = pages[currentPage];
  const bgUrl = pageBackgrounds[currentPage];
  const isDark = theme === 'dark';
  const pageLayoutKey = useMemo(() => layoutKey(pageData), [pageData]);

  useEffect(() => {
    if (!canvasRef.current || !pageData || !bgUrl) return;

    const canvasEl = canvasRef.current;
    let disposed = false;

    const init = async () => {
      const snapshot = usePdfEditorStore.getState().pages[currentPage];
      if (!snapshot) return;

      fabricRef.current?.dispose();
      const canSelectText = tool === 'select' || tool === 'text';
      const fc = new Canvas(canvasEl, {
        width: snapshot.dimensions.width * zoom,
        height: snapshot.dimensions.height * zoom,
        selection: canSelectText,
        backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
      });
      fabricRef.current = fc;

      const bg = await FabricImage.fromURL(bgUrl, { crossOrigin: 'anonymous' });
      if (disposed) return;
      bg.set({
        scaleX: (snapshot.dimensions.width * zoom) / (bg.width || 1),
        scaleY: (snapshot.dimensions.height * zoom) / (bg.height || 1),
        selectable: false,
        evented: false,
      });
      fc.backgroundImage = bg;

      for (const h of snapshot.highlights) {
        fc.add(
          new Rect({
            left: h.x * zoom,
            top: h.y * zoom,
            width: h.width * zoom,
            height: h.height * zoom,
            fill: h.color || 'rgba(255,255,0,0.35)',
            selectable: false,
            evented: false,
          })
        );
      }

      for (const w of snapshot.whiteouts) {
        fc.add(
          new Rect({
            left: w.x * zoom,
            top: w.y * zoom,
            width: w.width * zoom,
            height: w.height * zoom,
            fill: '#ffffff',
            selectable: false,
            evented: false,
          })
        );
      }

      for (const img of snapshot.images) {
        const fi = await FabricImage.fromURL(img.dataUrl);
        if (disposed) return;
        fi.set({
          left: img.x * zoom,
          top: img.y * zoom,
          scaleX: (img.width * zoom) / (fi.width || 1),
          scaleY: (img.height * zoom) / (fi.height || 1),
          data: { type: 'image', id: img.id },
        });
        fc.add(fi);
      }

      for (const sig of snapshot.signatures) {
        const fi = await FabricImage.fromURL(sig.dataUrl);
        if (disposed) return;
        fi.set({
          left: sig.x * zoom,
          top: sig.y * zoom,
          scaleX: (sig.width * zoom) / (fi.width || 1),
          scaleY: (sig.height * zoom) / (fi.height || 1),
          data: { type: 'signature', id: sig.id },
        });
        fc.add(fi);
      }

      const activeEditId = usePdfEditorStore.getState().editingTextId;

      for (const t of snapshot.textItems) {
        if (t.deleted) {
          if (isTextChanged(t)) {
            fc.add(
              new Rect({
                left: t.x * zoom - 2,
                top: t.y * zoom - 2,
                width: t.width * zoom + 4,
                height: t.height * zoom + 4,
                fill: '#ffffff',
                selectable: false,
                evented: false,
              })
            );
          }
          continue;
        }

        const showOverlay = shouldShowTextOverlay(t, activeEditId);

        if (!showOverlay) {
          if (canSelectText) {
            fc.add(
              new Rect({
                left: t.x * zoom,
                top: t.y * zoom,
                width: t.width * zoom,
                height: t.height * zoom,
                fill: 'rgba(0,0,0,0.001)',
                strokeWidth: 0,
                evented: true,
                hoverCursor: 'text',
                data: { type: 'text-hit', id: t.id },
              })
            );
          }
          continue;
        }

        fc.add(
          new Rect({
            left: t.x * zoom - 2,
            top: t.y * zoom - 2,
            width: t.width * zoom + 4,
            height: t.height * zoom + 4,
            fill: '#ffffff',
            selectable: false,
            evented: false,
          })
        );

        const text = new IText(t.text, {
          left: t.x * zoom,
          top: t.y * zoom,
          fontSize: t.fontSize * zoom,
          fontFamily: t.fontFamily,
          fill: t.color,
          lineHeight: 1.2,
          editable: canSelectText,
          selectable: canSelectText,
          data: { type: 'text', id: t.id },
        });
        text.on('changed', () => {
          updateTextItem(t.id, { text: text.text || '' });
        });
        text.on('editing:exited', () => {
          const finalText = text.text || '';
          updateTextItem(t.id, {
            text: finalText,
            modified: finalText !== t.originalText,
          });
          setEditingTextId(null);
          pushHistory();
        });
        fc.add(text);

        if (activeEditId === t.id) {
          requestAnimationFrame(() => {
            if (!fabricRef.current) return;
            fabricRef.current.setActiveObject(text);
            text.enterEditing();
            text.selectAll();
            fabricRef.current.renderAll();
          });
        }
      }

      fc.on('object:modified', (e) => {
        const obj = e.target as IText & { data?: { type: string; id: string } };
        if (!obj.data?.id) return;
        pushHistory();
        if (obj.data.type === 'text') {
          const x = (obj.left || 0) / zoom;
          const y = (obj.top || 0) / zoom;
          const fontSize = (obj.fontSize || 16) / zoom;
          updateTextItem(obj.data.id, {
            x,
            y,
            fontSize,
            width: Math.max((obj.width || 80) * (obj.scaleX || 1), 40) / zoom,
            height: Math.max(fontSize * 1.2, (obj.height || 24) * (obj.scaleY || 1) / zoom),
          });
          if ((obj.scaleX && obj.scaleX !== 1) || (obj.scaleY && obj.scaleY !== 1)) {
            obj.set({ scaleX: 1, scaleY: 1 });
          }
        }
      });

      fc.on('mouse:down', (opt) => {
        const pointer = fc.getPointer(opt.e);
        if (tool === 'text' && !opt.target) {
          addTextItem(currentPage, pointer.x / zoom, pointer.y / zoom);
          pushHistory();
          return;
        }
        if (tool === 'highlight' || tool === 'whiteout') {
          dragStart.current = { x: pointer.x, y: pointer.y };
        }
      });

      fc.on('mouse:up', (opt) => {
        if (!dragStart.current) return;
        const pointer = fc.getPointer(opt.e);
        const x1 = dragStart.current.x / zoom;
        const y1 = dragStart.current.y / zoom;
        const x2 = pointer.x / zoom;
        const y2 = pointer.y / zoom;
        const rect = {
          pageIndex: currentPage,
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        };
        if (rect.width > 4 && rect.height > 4) {
          if (tool === 'highlight') {
            addHighlight({ ...rect, color: '#FFFF0080' });
          } else if (tool === 'whiteout') {
            addWhiteout(rect);
          }
        }
        dragStart.current = null;
      });

      fc.on('mouse:dblclick', (opt) => {
        const target = opt.target as { data?: { type: string; id: string } };
        if (!canSelectText || !target?.data?.id) return;
        if (target.data.type === 'text-hit' || target.data.type === 'text') {
          setEditingTextId(target.data.id);
        }
      });

      fc.on('selection:created', (e) => {
        const obj = e.selected?.[0] as IText & { data?: { id: string; type: string } };
        if (obj?.data?.type === 'text') setSelectedTextId(obj.data.id);
      });

      fc.on('selection:cleared', () => setSelectedTextId(null));

      fc.renderAll();
    };

    void init();

    return () => {
      disposed = true;
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
    // pageLayoutKey tracks layout changes; full pageData omitted to avoid rebuild on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    zoom,
    bgUrl,
    tool,
    isDark,
    pageLayoutKey,
    historyIndex,
    editingTextId,
    addHighlight,
    addTextItem,
    addWhiteout,
    pushHistory,
    updateTextItem,
    setEditingTextId,
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = fabricRef.current?.getActiveObject() as IText | undefined;
      if (active?.isEditing) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTextId) {
        deleteTextItem(selectedTextId);
        setSelectedTextId(null);
      }
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        usePdfEditorStore.getState().undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        usePdfEditorStore.getState().redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedTextId, deleteTextItem]);

  if (!pageData) return null;

  return (
    <div className={`flex-1 overflow-auto p-6 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <p
        className={`mb-3 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
      >
        PDF upload होने के बाद वैसी ही दिखेगी — text बदलने के लिए उस पर <strong>double-click</strong> करें
      </p>
      <div className="mx-auto w-fit rounded-lg shadow-2xl ring-1 ring-black/5">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
