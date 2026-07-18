import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { SectionHeader } from "../components/ui/SectionHeader";

export default function Register() {
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      await api.post("/auth/register", { username, password, role });
      success("Account created", "You can sign in with your new credentials.");
      navigate("/login", { replace: true });
    } catch (error) {
      showError(
        "Registration failed",
        error?.response?.data?.error ||
          error?.response?.data ||
          "Try another username.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="animate-fade-up space-y-6">
        <SectionHeader
          eyebrow="Create account"
          title="Start with a premium author profile"
          description="Choose a role, create your workspace, and publish content with a dashboard-first flow."
        />
        <Card className="p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
            What you get
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="font-semibold text-slate-950 dark:text-white">
                Role aware UI
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Admin and user views branch automatically in the dashboard.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="font-semibold text-slate-950 dark:text-white">
                Production feel
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Spacing, glass, and motion are tuned for a SaaS-style first
                impression.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="animate-fade-up p-6 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.55)]">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Register
        </div>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Create your account
        </h2>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <Input
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={errors.username}
            placeholder="jane_doe"
          />
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="USER">Author</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={errors.confirmPassword}
            placeholder="Repeat your password"
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
