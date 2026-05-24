import { getJobMetaRows, type JobMeta } from '@/lib/jobDisplay';

export default function JobMetaChips({
  job,
  compact = false,
}: {
  job: JobMeta;
  compact?: boolean;
}) {
  const rows = getJobMetaRows(job);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-slate-500">
        {rows.map((r) => (
          <span key={r.label}>
            <span className="font-semibold text-slate-600">{r.label}:</span> {r.value}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {rows.map((r) => (
        <div
          key={r.label}
          className="bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {r.label}
          </span>
          <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800 line-clamp-2">{r.value}</p>
        </div>
      ))}
    </div>
  );
}
