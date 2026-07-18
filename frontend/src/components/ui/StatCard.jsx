import { Card } from "./Card";

export function StatCard({ label, value, hint, accent = "sky" }) {
  const accents = {
    sky: "from-sky-500/10 to-cyan-500/10 text-sky-500",
    emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-500",
    rose: "from-rose-500/10 to-orange-500/10 text-rose-500",
    slate: "from-slate-500/10 to-slate-500/10 text-slate-500",
  };

  return (
    <Card className="p-5">
      <div
        className={`inline-flex rounded-2xl bg-gradient-to-br px-3 py-1 text-xs font-semibold ${accents[accent] || accents.sky}`}
      >
        {label}
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {hint}
        </div>
      ) : null}
    </Card>
  );
}
