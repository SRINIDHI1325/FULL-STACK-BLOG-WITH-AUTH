import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "../../lib/utils";

const DASHBOARD_PATHS = ["/dashboard", "/create", "/profile", "/my-posts"];

export default function AppShell() {
  const location = useLocation();
  const isWorkspaceRoute = DASHBOARD_PATHS.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith("/edit/"),
  );

  return (
    <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <Navbar />
      <div
        className={cn(
          "mx-auto w-full max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8",
          isWorkspaceRoute && "xl:flex xl:gap-6",
        )}
      >
        {isWorkspaceRoute ? <Sidebar /> : null}
        <main
          className={cn(
            "min-w-0 flex-1",
            isWorkspaceRoute ? "xl:pt-0" : "pt-2",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
