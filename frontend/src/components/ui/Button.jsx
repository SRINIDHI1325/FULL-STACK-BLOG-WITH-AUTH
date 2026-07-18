import { cn } from "../../lib/utils";

const styles = {
  primary:
    "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  destructive:
    "bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 hover:bg-rose-500",
};

export function Button({ variant = "primary", className = "", children, as: Component = "button", type = "button", ...props }) {
  const isButton = Component === "button";

  return (
    <Component
      type={isButton ? type : undefined}
      data-variant={variant}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant] || styles.primary,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
