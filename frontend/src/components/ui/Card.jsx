import { cn } from "../../lib/utils";

export function Card({ className = "", children }) {
  return (
    <div className={cn("surface-panel overflow-hidden", className)}>
      {children}
    </div>
  );
}
