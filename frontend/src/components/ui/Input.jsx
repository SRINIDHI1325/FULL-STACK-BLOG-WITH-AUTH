import { cn } from "../../lib/utils";

const baseInput =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

export function Input({ label, error, helper, className = "", ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      <input className={cn(baseInput, className)} {...props} />
      {helper ? (
        <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </span>
      ) : null}
      {error ? (
        <span className="mt-2 block text-xs text-rose-500">{error}</span>
      ) : null}
    </label>
  );
}

export function Textarea({ label, error, helper, className = "", ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      <textarea
        className={cn(baseInput, "min-h-[220px] resize-y", className)}
        {...props}
      />
      {helper ? (
        <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </span>
      ) : null}
      {error ? (
        <span className="mt-2 block text-xs text-rose-500">{error}</span>
      ) : null}
    </label>
  );
}
