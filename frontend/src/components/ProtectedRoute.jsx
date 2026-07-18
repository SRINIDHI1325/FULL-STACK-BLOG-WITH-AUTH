import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "./ui/Loader";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Loader label="Unlocking your dashboard" />
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
