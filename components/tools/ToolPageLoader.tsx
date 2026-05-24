export default function ToolPageLoader({ label = 'Loading tool…' }: { label?: string }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-4">
      <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}
