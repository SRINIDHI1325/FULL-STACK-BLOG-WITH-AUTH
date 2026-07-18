import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Loader } from "../components/ui/Loader";
import { Modal } from "../components/ui/Modal";
import { SectionHeader } from "../components/ui/SectionHeader";
import { formatDate, normalizeRole } from "../lib/utils";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { success, error: showError } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        showError(
          "Unable to load post",
          "The requested article could not be found.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, showError]);

  const canManage = useMemo(() => {
    if (!post) {
      return false;
    }

    return role === "ADMIN" || user?.username === post.author;
  }, [post, role, user?.username]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      success("Post deleted", post?.title || "");
      navigate("/dashboard");
    } catch {
      showError(
        "Delete failed",
        "You may not have permission to delete this post.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading article" />
      </div>
    );
  }

  if (!post) {
    return (
      <EmptyState
        title="Post missing"
        description="The article was not found or has been removed."
        actionLabel="Back to home"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <SectionHeader
        eyebrow="Post detail"
        title={post.title}
        description={`By ${post.author || "Editorial"} | ${formatDate(post.createdAt)}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/dashboard" variant="outline">
              Dashboard
            </Button>
            {canManage ? (
              <>
                <Button as={Link} to={`/edit/${post.id}`} variant="outline">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-6">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-600 dark:text-sky-300">
              Published
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              {normalizeRole(role)}
            </span>
          </div>
          <article className="mt-6 space-y-6">
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-200">
              {post.content}
            </p>
          </article>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Article info
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between gap-3">
                <span>Author</span>
                <span>{post.author || "Editorial"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Created</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Updated</span>
                <span>{formatDate(post.updatedAt)}</span>
              </div>
            </div>
          </Card>
          <EmptyState
            title="Publishing note"
            description="Use the dashboard to update or remove content, then revisit this page for the clean reader view."
          />
        </div>
      </div>

      <Modal
        open={confirmDelete}
        title="Delete this post?"
        description="This action cannot be undone. The article will be removed from the feed and dashboard."
        confirmLabel="Delete post"
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
