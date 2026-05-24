'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { RbButton } from './ui';
import { exportResumeToPdf } from '@/lib/resume-builder/export-pdf';

export default function ExportPdfButton({ title }: { title: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportResumeToPdf('resume-print-root', title || 'resume');
    } catch (e) {
      console.error(e);
      alert('PDF download failed. Check your internet and try again, or refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RbButton variant="secondary" onClick={handleExport} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? 'Preparing…' : 'Download PDF'}
    </RbButton>
  );
}
