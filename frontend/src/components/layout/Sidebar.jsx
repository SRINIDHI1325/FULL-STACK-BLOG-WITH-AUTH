import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn, normalizeRole } from "../../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-posts", label: "My Posts" },
  { to: "/create", label: "Create" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const { user, role } = useAuth();

  return (
    <aside className="hidden w-[280px] shrink-0 xl:block">
      <div className="surface-panel sticky top-24 overflow-hidden p-4">
        <div className="rounded-3xl bg-slate-950 px-4 py-5 text-white shadow-xl shadow-slate-950/25 dark:bg-white dark:text-slate-950">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300 dark:text-cyan-600">
            Workspace
          </div>
          <div className="mt-3 text-xl font-semibold">{user?.username || "Guest editor"}</div>
          <div className="mt-2 text-sm text-white/70 dark:text-slate-600">
            {normalizeRole(role)} access with an always-on content studio.
          </div>
        </div>

        <nav className="mt-5 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                )
              }
            >
              <span>{link.label}</span>
              <span className="text-xs opacity-70">&gt;</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Current role
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
            {normalizeRole(role)}
          </div>
          <p className="mt-2 leading-6">
            Move through posts, profile settings, and publishing tools without losing context.
          </p>
        </div>
      </div>
    </aside>
  );
}
