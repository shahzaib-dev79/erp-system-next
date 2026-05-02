"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { auth, tokenStorage } from "@/lib/api";
import { AuthState, LoginPayload, RegisterPayload, User } from "@/types";

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const token = tokenStorage.getAccess();
      if (!token) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }
      const res = await auth.getMe();
      setState({
        user: res.user,
        accessToken: token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      tokenStorage.clear();
      setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload) => {
    const res = await auth.login(payload);
    if (!res.success || !res.accessToken || !res.user) {
      throw new Error(res.message || "Login failed");
    }
    tokenStorage.setAccess(res.accessToken);
    setState({
      user: res.user,
      accessToken: res.accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    router.push(res.user.role === "admin" ? "/admin" : "/dashboard");
  };

  const register = async (payload: RegisterPayload) => {
    const res = await auth.register(payload);
    if (!res.success || !res.accessToken || !res.user) {
      throw new Error(res.message || "Registration failed");
    }
    tokenStorage.setAccess(res.accessToken);
    setState({
      user: res.user,
      accessToken: res.accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      tokenStorage.clear();
      setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Role Guards ──────────────────────────────────────────────────────────────

export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace(redirectTo);
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

export function useRequireRole(role: "admin" | "moderator") {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== role && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router, role]);

  return { user, isLoading };
}
