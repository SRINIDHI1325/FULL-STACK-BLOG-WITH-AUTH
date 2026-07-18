import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { Loader } from "./components/ui/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AppShell from "./components/layout/AppShell";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const MyPosts = lazy(() => import("./pages/MyPosts"));

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center px-4">
                  <Loader label="Loading workspace" />
                </div>
              }
            >
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/posts/:id" element={<PostPage />} />

                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create" element={<CreatePost />} />
                    <Route path="/edit/:id" element={<CreatePost />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
