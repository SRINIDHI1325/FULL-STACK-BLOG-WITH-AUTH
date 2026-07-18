import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="surface-panel flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
        *
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {actionLabel ? (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
