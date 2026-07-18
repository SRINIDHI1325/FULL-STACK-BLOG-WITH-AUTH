import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input, Textarea } from "../components/ui/Input";
import { Loader } from "../components/ui/Loader";
import { SectionHeader } from "../components/ui/SectionHeader";
import { formatDate } from "../lib/utils";

export default function CreatePost() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/posts/${id}`);
        setTitle(data.title || "");
        setContent(data.content || "");
      } catch {
        showError(
          "Unable to load post",
          "The post may have been removed or you may not have access.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit, showError]);

  const preview = useMemo(
    () => ({
      title: title || "Post title preview",
      content: content || "Your story will appear here as you type.",
    }),
    [content, title],
  );

  const validate = () => {
    const nextErrors = {};

    if (title.trim().length < 4) {
      nextErrors.title = "Title must be at least 4 characters.";
    }

    if (content.trim().length < 20) {
      nextErrors.content = "Content must be at least 20 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, { title, content });
        success("Post updated", title);
        navigate(`/posts/${id}`);
      } else {
        const { data } = await api.post("/posts", { title, content });
        success("Post published", title);
        navigate(`/posts/${data.id}`);
      }
    } catch {
      showError("Save failed", "Please verify your session and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading editor" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <SectionHeader
        eyebrow={isEdit ? "Edit post" : "Create post"}
        title={isEdit ? "Refine your article" : "Publish a new story"}
        description="A focused form with live preview, validation, and direct publishing to the backend API."
        action={
          <Button as={Link} to="/dashboard" variant="outline">
            Back to dashboard
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <form className="space-y-5" onSubmit={submit}>
            <Input
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              error={errors.title}
              placeholder="Designing a premium content platform"
            />
            <Textarea
              label="Content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              error={errors.content}
              placeholder="Write a polished article, a product update, or a release note."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {isEdit
                  ? `Last saved in preview mode at ${formatDate(new Date())}`
                  : "New content starts in draft mode."}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : isEdit
                      ? "Update post"
                      : "Publish post"}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Live preview
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                {preview.title}
              </h3>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                {preview.content}
              </p>
            </div>
          </Card>

          <EmptyState
            title="Editing tips"
            description="Keep the title crisp, open with a strong lead, and use the dashboard to track changes after publish."
          />
        </div>
      </div>
    </div>
  );
}
