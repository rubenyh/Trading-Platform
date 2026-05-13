export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2a2e39] border-t-[#7b61ff]" />
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Loading</span>
    </div>
  );
}
