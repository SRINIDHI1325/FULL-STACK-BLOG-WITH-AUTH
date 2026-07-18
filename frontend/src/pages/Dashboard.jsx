import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";
import { Modal } from "../components/ui/Modal";
import { Pagination } from "../components/ui/Pagination";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { cn, formatDate, normalizeRole } from "../lib/utils";

const PAGE_SIZE = 6;

export default function Dashboard() {
  const { user, role } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [page, setPage] = useState(1);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const loadPosts = async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        role === "ADMIN" ? "/posts" : `/posts/user/${user.username}`;
      const { data } = await api.get(endpoint);
      setPosts(data || []);
    } catch {
      showError(
        "Unable to load posts",
        "Check the backend connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [role, user?.username]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items = posts.filter((post) => {
      const haystack =
        `${post.title} ${post.content} ${post.author || ""}`.toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });

    items.sort((left, right) => {
      const leftDate = new Date(
        left.updatedAt || left.createdAt || 0,
      ).getTime();
      const rightDate = new Date(
        right.updatedAt || right.createdAt || 0,
      ).getTime();
      return sortOrder === "recent"
        ? rightDate - leftDate
        : leftDate - rightDate;
    });

    return items;
  }, [posts, query, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const metrics = [
    {
      label: "Visible posts",
      value: filteredPosts.length,
      hint:
        role === "ADMIN"
          ? "Across the full studio"
          : "Your own published drafts",
      accent: "sky",
    },
    {
      label: "Workspace role",
      value: normalizeRole(role),
      hint:
        role === "ADMIN"
          ? "Can review every article"
          : "Focused author permissions",
      accent: "emerald",
    },
    {
      label: "Latest update",
      value: filteredPosts[0]
        ? formatDate(filteredPosts[0].updatedAt || filteredPosts[0].createdAt)
        : "-",
      hint: "Sorted by recent activity",
      accent: "rose",
    },
  ];

  const handleDelete = async () => {
    if (!confirmingDelete) {
      return;
    }

    try {
      await api.delete(`/posts/${confirmingDelete.id}`);
      success("Post deleted", confirmingDelete.title);
      setConfirmingDelete(null);
      await loadPosts();
    } catch {
      showError(
        "Delete failed",
        "You may not have permission to remove this post.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Preparing dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <SectionHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.username || "creator"}`}
        description="A clean control center for publishing, monitoring, and editing content without clutter."
        action={<Button onClick={() => navigate("/create")}>New post</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
          <Input
            label="Search content"
            placeholder="Search by title, body, author"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Sort order</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </Card>

      {pagedPosts.length ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.24em] text-slate-500 dark:bg-slate-900/90 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    {role === "ADMIN" ? (
                      <th className="px-5 py-4">Author</th>
                    ) : null}
                    <th className="px-5 py-4">Updated</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pagedPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/60"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-950 dark:text-white">
                          {post.title}
                        </div>
                        <div className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {post.content}
                        </div>
                      </td>
                      {role === "ADMIN" ? (
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {post.author || "-"}
                        </td>
                      ) : null}
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {formatDate(post.updatedAt || post.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                          Published
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            className="px-4 py-2"
                            onClick={() => navigate(`/edit/${post.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="px-4 py-2"
                            onClick={() => navigate(`/posts/${post.id}`)}
                          >
                            Open
                          </Button>
                          <Button
                            variant="destructive"
                            className="px-4 py-2"
                            onClick={() => setConfirmingDelete(post)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No posts yet"
          description="Create the first post in your premium studio. Add a polished story, then track it from the dashboard."
          actionLabel="Create post"
          onAction={() => navigate("/create")}
        />
      )}

      <Modal
        open={Boolean(confirmingDelete)}
        title={confirmingDelete?.title || "Delete this post?"}
        description="This action cannot be undone. The post will disappear from the dashboard and public feed."
        confirmLabel="Delete post"
        onClose={() => setConfirmingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
