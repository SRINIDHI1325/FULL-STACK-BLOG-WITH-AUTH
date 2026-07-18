import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const TOKEN_KEY = "token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      refreshUser,
      isAuthed: Boolean(token),
      role: user?.role ?? "USER",
    }),
    [loading, login, logout, refreshUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
