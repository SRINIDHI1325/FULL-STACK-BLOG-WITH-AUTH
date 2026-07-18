import { Link } from "react-router-dom";
import { Button } from "./Button";
import { Card } from "./Card";
import { cn, excerpt, formatDate } from "../../lib/utils";

export function PostCard({ post, compact = false, actions }) {
  return (
    <Card
      className={cn(
        "group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]",
        compact && "p-4",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            {post.author || "Editorial"}
          </div>
          <h3
            className={cn(
              "mt-3 font-semibold text-slate-950 dark:text-white",
              compact ? "text-lg" : "text-xl",
            )}
          >
            {post.title}
          </h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <p
        className={cn(
          "mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300",
          compact ? "line-clamp-3" : "line-clamp-4",
        )}
      >
        {excerpt(post.content, compact ? 120 : 180)}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
            Post
          </span>
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-600 dark:text-sky-300">
            Live
          </span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Button
            as={Link}
            variant="ghost"
            className="px-0 text-slate-950 dark:text-white"
            to={`/posts/${post.id}`}
          >
            Read more &gt;
          </Button>
        </div>
      </div>
    </Card>
  );
}
