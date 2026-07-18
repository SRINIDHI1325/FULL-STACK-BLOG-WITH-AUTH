import { Button } from "./Button";

export function Modal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  children,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="surface-panel animate-pop relative z-[71] w-full max-w-lg p-6 shadow-[0_30px_100px_-32px_rgba(15,23,42,0.5)]">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Confirm action
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
        <div className="mt-5">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
