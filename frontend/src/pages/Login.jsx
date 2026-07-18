import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { SectionHeader } from "../components/ui/SectionHeader";

export default function Login() {
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const { data } = await api.post("/auth/login", { username, password });
      login(data.token);
      success("Welcome back", "You are now signed in.");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      showError(
        "Login failed",
        error?.response?.data?.error || "Check your credentials and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="animate-fade-up space-y-6">
        <SectionHeader
          eyebrow="Welcome back"
          title="Sign in to your content workspace"
          description="Manage posts, publish faster, and keep your editorial flow focused."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Secure access
            </div>
            <div className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
              JWT session flow
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Tokens are attached automatically on every request so your
              workspace stays persistent.
            </p>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Responsive UI
            </div>
            <div className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
              Dashboard first
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The layout adapts from mobile auth cards to a fully featured
              creator dashboard.
            </p>
          </Card>
        </div>
      </div>

      <Card className="animate-fade-up p-6 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.55)]">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Login
        </div>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
          Enter your credentials
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
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            placeholder="password"
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
