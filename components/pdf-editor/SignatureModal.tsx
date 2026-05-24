'use client';

import { useRef } from 'react';
import { usePdfEditorStore } from '@/store/pdfEditorStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SignatureModal({ open, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const addSignature = usePdfEditorStore((s) => s.addSignature);
  const currentPage = usePdfEditorStore((s) => s.currentPage);
  const theme = usePdfEditorStore((s) => s.theme);

  if (!open) return null;

  const isDark = theme === 'dark';

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    addSignature({
      pageIndex: currentPage,
      x: 80,
      y: 80,
      width: 180,
      height: 60,
      dataUrl,
    });
    onClose();
    clear();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
          isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        }`}
      >
        <h3 className="text-lg font-black mb-4">Draw Signature</h3>
        <canvas
          ref={canvasRef}
          width={360}
          height={120}
          className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="mt-4 flex gap-2 justify-end">
          <button type="button" onClick={clear} className="rounded-lg px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
            Clear
          </button>
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button type="button" onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
