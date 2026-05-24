'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ConverterBackButton({
  href = '/file-converter',
  label = 'सभी Tools पर वापस',
}: {
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm hover:border-rose-300 hover:text-rose-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-rose-500/50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-sm font-bold text-white shadow-md shadow-rose-500/25 hover:bg-rose-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Link>
    </div>
  );
}
