export function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500 dark:border-slate-800 dark:border-t-sky-400" />
      <span>{label}</span>
    </div>
  );
}
