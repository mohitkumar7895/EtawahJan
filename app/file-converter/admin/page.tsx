'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, XCircle, Activity } from 'lucide-react';
import ConverterBrandLogo from '@/components/converter/ConverterBrandLogo';
import ConverterBackButton from '@/components/converter/ConverterBackButton';

interface Analytics {
  total: number;
  completed: number;
  failed: number;
  active: number;
  byTool: Record<string, number>;
}

export default function ConverterAdminPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/converter/jobs/analytics/summary')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Start converter-server to load analytics (npm run converter-server)'));
  }, []);

  const cards = [
    { label: 'Total jobs', value: data?.total ?? 0, icon: BarChart3, color: 'text-blue-500' },
    { label: 'Completed', value: data?.completed ?? 0, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Failed', value: data?.failed ?? 0, icon: XCircle, color: 'text-rose-500' },
    { label: 'Active / Queued', value: data?.active ?? 0, icon: Activity, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <ConverterBackButton />
      <ConverterBrandLogo size="md" centered linkHome className="mb-8 mx-auto" />
      <h1 className="text-3xl font-extrabold mb-2 text-center">Admin Analytics</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 text-sm">
        Queue stats from converter API · Redis + BullMQ when enabled
      </p>

      {error && (
        <p className="mb-6 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:bg-slate-900 dark:border-slate-800"
          >
            <Icon className={`w-6 h-6 ${color} mb-3`} />
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {data?.byTool && Object.keys(data.byTool).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:bg-slate-900 dark:border-slate-800">
          <h2 className="font-bold mb-4">By tool</h2>
          <ul className="space-y-2">
            {Object.entries(data.byTool)
              .sort((a, b) => b[1] - a[1])
              .map(([tool, count]) => (
                <li key={tool} className="flex justify-between text-sm">
                  <span className="font-medium">{tool}</span>
                  <span className="text-slate-500">{count}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
