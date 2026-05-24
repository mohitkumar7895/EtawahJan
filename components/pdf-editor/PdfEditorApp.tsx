'use client';

import { useRef, useState } from 'react';
import { Toaster } from 'sonner';
import PdfQueryProvider from '@/components/pdf-editor/PdfQueryProvider';
import PdfUploadScreen from '@/components/pdf-editor/PdfUploadScreen';
import PdfToolbar from '@/components/pdf-editor/PdfToolbar';
import PdfPageSidebar from '@/components/pdf-editor/PdfPageSidebar';
import PdfCanvasEditor from '@/components/pdf-editor/PdfCanvasEditor';
import SignatureModal from '@/components/pdf-editor/SignatureModal';
import { usePdfEditorStore } from '@/store/pdfEditorStore';

function PdfEditorWorkspace() {
  const fileName = usePdfEditorStore((s) => s.fileName);
  const theme = usePdfEditorStore((s) => s.theme);
  const addImage = usePdfEditorStore((s) => s.addImage);
  const currentPage = usePdfEditorStore((s) => s.currentPage);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  if (!fileName) {
    return <PdfUploadScreen />;
  }

  const handleImagePick = () => imageInputRef.current?.click();

  return (
    <div className={`flex h-[calc(100vh-4rem)] flex-col ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <PdfToolbar onOpenSignature={() => setSignatureOpen(true)} onInsertImage={handleImagePick} />
      <div className="flex flex-1 min-h-0">
        <PdfPageSidebar />
        <PdfCanvasEditor />
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            addImage({
              pageIndex: currentPage,
              x: 100,
              y: 100,
              width: 160,
              height: 120,
              dataUrl: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />
      <SignatureModal open={signatureOpen} onClose={() => setSignatureOpen(false)} />
    </div>
  );
}

export default function PdfEditorApp() {
  return (
    <PdfQueryProvider>
      <PdfEditorWorkspace />
      <Toaster position="top-center" richColors />
    </PdfQueryProvider>
  );
}
