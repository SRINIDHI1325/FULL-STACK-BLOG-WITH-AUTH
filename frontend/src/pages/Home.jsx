import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";
import { Pagination } from "../components/ui/Pagination";
import { PostCard } from "../components/ui/PostCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";

const PAGE_SIZE = 6;

export default function Home() {
  const { isAuthed } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [page, setPage] = useState(1);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/posts");
        setPosts(data || []);
      } catch {
        setError("Unable to load posts from the server.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

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
  }, [deferredQuery, posts, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const uniqueAuthors = new Set(
    posts.map((post) => post.author).filter(Boolean),
  ).size;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading the latest stories" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.6)] sm:px-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.14),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Premium blog studio
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Build, publish, and manage content like a real SaaS product.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              A clean publishing workspace with search, filters, pagination,
              dark mode, and role-aware dashboards.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={isAuthed ? "/dashboard" : "/register"}>
                {isAuthed ? "Open dashboard" : "Get started"}
              </Button>
              <Button as={Link} to="/create" variant="outline">
                Create post
              </Button>
            </div>
          </div>

          <Card
            className="border border-gray-200 bg-white p-5 text-gray-900 shadow-sm 
                 dark:border-white/10 dark:bg-white/10 dark:text-white dark:backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-100 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-white/60">
                  Posts
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {posts.length}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-white/60">
                  Authors
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {uniqueAuthors}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-white/60">
                  Filters
                </div>
                <div className="mt-2 text-3xl font-semibold">Search</div>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4 dark:bg-white/10">
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-white/60">
                  Mode
                </div>
                <div className="mt-2 text-3xl font-semibold">Dark</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total posts"
          value={posts.length}
          hint="Live content in the feed"
          accent="sky"
        />
        <StatCard
          label="Authors"
          value={uniqueAuthors}
          hint="Distinct creators in the feed"
          accent="emerald"
        />
        <StatCard
          label="Page size"
          value={PAGE_SIZE}
          hint="Responsive pagination window"
          accent="rose"
        />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <Input
            label="Search posts"
            placeholder="Title, body, or author"
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

      {error ? (
        <EmptyState
          title="Feed unavailable"
          description={error}
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      ) : visiblePosts.length ? (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Featured feed"
            title="All posts"
            description="A polished public grid for stories, updates, and editorial content."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No matching posts"
          description="Try a different keyword or clear the search field to restore the feed."
        />
      )}
    </div>
  );
}
