import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./ui/Loader";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Loader label="Preparing your workspace" />
      </div>
    );
  }

  if (isAuthed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
