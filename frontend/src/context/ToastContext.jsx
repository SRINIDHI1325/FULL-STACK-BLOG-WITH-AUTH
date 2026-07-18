import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/utils";

const ToastContext = createContext(null);

let toastId = 0;

function ToastItem({ toast, onDismiss }) {
  const tones = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-100",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  };

  return (
    <button
      type="button"
      onClick={() => onDismiss(toast.id)}
      className={cn(
        "animate-pop pointer-events-auto w-full rounded-2xl border px-4 py-3 text-left text-sm shadow-xl shadow-slate-950/10 backdrop-blur transition hover:-translate-y-0.5",
        tones[toast.type] || tones.info,
      )}
    >
      <div className="font-semibold">{toast.title}</div>
      {toast.message ? (
        <div className="mt-1 text-xs opacity-90">{toast.message}</div>
      ) : null}
    </button>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, message = "", type = "info" }) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, title, message, type }]);

      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toast: pushToast,
      success: (title, message) =>
        pushToast({ title, message, type: "success" }),
      error: (title, message) => pushToast({ title, message, type: "error" }),
      info: (title, message) => pushToast({ title, message, type: "info" }),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
