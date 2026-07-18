import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { PostCard } from "../components/ui/PostCard";
import { normalizeRole } from "../lib/utils";

export default function Profile() {
  const { user, role } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.username) {
        setLoading(false);
        return;
      }

      try {
        const endpoint =
          role === "ADMIN" ? "/posts" : `/posts/user/${user.username}`;
        const { data } = await api.get(endpoint);
        setPosts(data || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [role, user?.username]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading profile" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <SectionHeader
        eyebrow="Profile"
        title="Your creator profile"
        description="A streamlined identity panel for permissions, post history, and workspace overview."
        action={<Button>Edit profile</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-950 text-2xl font-semibold text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Authenticated member
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                {user?.username}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300">
                  {normalizeRole(role)} role
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {posts.length} posts tracked
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Your dashboard stays connected to the JWT session and reflects
                the current backend role.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard
            label="Role"
            value={normalizeRole(role)}
            hint="Derived from your session"
            accent="emerald"
          />
          <StatCard
            label="Visibility"
            value={role === "ADMIN" ? "All posts" : "Own posts"}
            hint="Role-based data access"
            accent="sky"
          />
          <StatCard
            label="Status"
            value="Active"
            hint="Ready to create or edit content"
            accent="rose"
          />
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader
          eyebrow="Recent work"
          title="Latest posts"
          description="A clean history of what you published most recently."
        />

        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No posts yet"
            description="Profile activity appears here once you create a post."
            actionLabel="Create your first post"
            onAction={() => (window.location.href = "/create")}
          />
        )}
      </div>
    </div>
  );
}
