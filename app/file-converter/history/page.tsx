'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, Download } from 'lucide-react';
import type { ConversionJob } from '@/lib/converter/types';
import { downloadUrl } from '@/lib/converter/api';
import { getToolById } from '@/lib/converter/tools';
import ConverterBrandLogo from '@/components/converter/ConverterBrandLogo';
import ConverterBackButton from '@/components/converter/ConverterBackButton';

export default function ConverterHistoryPage() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('converter-history');
      setJobs(raw ? JSON.parse(raw) : []);
    } catch {
      setJobs([]);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <ConverterBackButton />
      <ConverterBrandLogo size="md" centered linkHome className="mb-8 mx-auto" />
      <div className="flex items-center gap-3 mb-8">
        <History className="w-8 h-8 text-rose-500" />
        <h1 className="text-3xl font-extrabold">Conversion History</h1>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center text-slate-500">
          <p>No conversions yet.</p>
          <Link
            href="/file-converter"
            className="inline-block mt-4 text-rose-500 font-bold hover:underline"
          >
            Browse tools →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => {
            const tool = getToolById(job.toolId);
            return (
              <li
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold">{tool?.name || job.toolId}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                      job.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                {job.outputs?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.zipUrl && (
                      <a
                        href={downloadUrl(job.zipUrl)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500"
                      >
                        <Download className="w-4 h-4" /> ZIP
                      </a>
                    )}
                    {job.outputs.map((o) => (
                      <a
                        key={o.url}
                        href={downloadUrl(o.url)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500"
                      >
                        <Download className="w-4 h-4" /> {o.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
