'use client';

import { useState } from 'react';
import { Download, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ConverterTool } from '@/lib/converter/types';
import type { ConversionJob } from '@/lib/converter/types';
import { uploadAndConvert, downloadUrl } from '@/lib/converter/api';
import DropZone from './DropZone';
import ToolIcon from './ToolIcon';
import ConverterBrandLogo from './ConverterBrandLogo';
import ConverterBackButton from './ConverterBackButton';

export default function ToolWorkspace({ tool }: { tool: ConverterTool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ConversionJob | null>(null);
  const [password, setPassword] = useState('');
  const [watermark, setWatermark] = useState('CONFIDENTIAL');
  const [rotation, setRotation] = useState(90);

  const acceptMime = tool.accept.includes('*/*')
    ? undefined
    : tool.accept.join(',');

  const startConversion = async () => {
    if (!files.length) {
      toast.error('Please upload at least one file');
      return;
    }

    setBusy(true);
    setResult(null);
    setProgress(0);
    setMessage('Starting…');

    try {
      const job = await uploadAndConvert(
        tool.id,
        files,
        {
          password: tool.id === 'protect-pdf' ? password : undefined,
          unlockPassword: tool.id === 'unlock-pdf' ? password : undefined,
          watermarkText: tool.id === 'watermark-pdf' ? watermark : undefined,
          rotation: tool.id === 'rotate-pdf' ? rotation : undefined,
          quality: tool.id === 'compress-image' ? 75 : undefined,
        },
        (pct, msg) => {
          setProgress(pct);
          if (msg) setMessage(msg);
        }
      );

      setResult(job);
      saveHistory(job);
      toast.success('Conversion completed!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ConverterBackButton />
      <div className="text-center mb-10 animate-fade-in-up">
        <ConverterBrandLogo size="lg" centered linkHome className="mb-6" />
        <div
          className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} items-center justify-center text-white shadow-lg mb-4`}
        >
          <ToolIcon name={tool.icon} className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">{tool.description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:bg-slate-900 dark:border-slate-800">
        <DropZone
          accept={acceptMime || '*/*'}
          multiple={tool.multiple}
          maxFiles={tool.maxFiles}
          files={files}
          onFilesChange={setFiles}
        />

        {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
          <div className="mt-4">
            <label className="text-sm font-semibold block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:bg-slate-800 dark:border-slate-700"
              placeholder="Enter PDF password"
            />
          </div>
        )}

        {tool.id === 'watermark-pdf' && (
          <div className="mt-4">
            <label className="text-sm font-semibold block mb-1">Watermark text</label>
            <input
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
        )}

        {tool.id === 'rotate-pdf' && (
          <div className="mt-4">
            <label className="text-sm font-semibold block mb-1">Rotation (degrees)</label>
            <select
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 dark:bg-slate-800 dark:border-slate-700"
            >
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
          </div>
        )}

        {busy && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-500">{message}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={busy || !files.length}
          onClick={startConversion}
          className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:opacity-95 disabled:opacity-50 transition-opacity"
        >
          {busy ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Convert Now
            </>
          )}
        </button>
      </div>

      {result?.status === 'completed' && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:bg-emerald-500/10 dark:border-emerald-500/30 animate-fade-in-up">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-4">
            <CheckCircle2 className="w-5 h-5" />
            Ready to download
          </div>

          <div className="flex flex-col gap-2">
            {result.zipUrl && (
              <a
                href={downloadUrl(result.zipUrl)}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download ZIP
              </a>
            )}
            {result.outputs?.map((o) => (
              <a
                key={o.url}
                href={downloadUrl(o.url)}
                className="inline-flex items-center justify-between gap-2 py-3 px-4 rounded-xl bg-white border border-emerald-200 font-semibold text-sm hover:bg-emerald-50 dark:bg-slate-900 dark:border-emerald-500/30"
              >
                <span className="truncate">{o.name}</span>
                <Download className="w-4 h-4 shrink-0 text-emerald-600" />
              </a>
            ))}
          </div>
        </div>
      )}

      {busy && progress < 100 && (
        <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Large files process in background — do not close this tab
        </p>
      )}
    </div>
  );
}

function saveHistory(job: ConversionJob) {
  try {
    const key = 'converter-history';
    const prev = JSON.parse(localStorage.getItem(key) || '[]') as ConversionJob[];
    const next = [job, ...prev].slice(0, 30);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
