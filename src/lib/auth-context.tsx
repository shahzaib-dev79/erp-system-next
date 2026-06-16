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

function setRoleCookie(role: string) {
	document.cookie = `userRole=${role}; path=/; max-age=900`;
}

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
				setState({
					user: null,
					accessToken: null,
					isLoading: false,
					isAuthenticated: false,
				});
				return;
			}
			const res = await auth.getMe();
			const user = res.data?.user ?? null;

			if (user?.role) setRoleCookie(user.role);

			setState({
				user,
				accessToken: token,
				isLoading: false,
				isAuthenticated: true,
			});
		} catch {
			tokenStorage.clear();
			setState({
				user: null,
				accessToken: null,
				isLoading: false,
				isAuthenticated: false,
			});
		}
	}, []);

	useEffect(() => {
		void refreshUser();
	}, [refreshUser]);

	const login = async (payload: LoginPayload) => {
		const res = await auth.login(payload);
		if (!res.success || !res.data?.accessToken || !res.data?.user) {
			throw new Error(res.message || "Login failed");
		}
		tokenStorage.setAccess(res.data.accessToken);
		tokenStorage.setRefresh(res.data.refreshToken!);

		setRoleCookie(res.data.user.role);

		setState({
			user: res.data.user,
			accessToken: res.data.accessToken,
			isLoading: false,
			isAuthenticated: true,
		});
	};

	const register = async (payload: RegisterPayload) => {
		const res = await auth.register(payload);
		if (!res.success || !res.data?.accessToken || !res.data?.user) {
			throw new Error(res.message || "Registration failed");
		}
		tokenStorage.setAccess(res.data.accessToken);
		tokenStorage.setRefresh(res.data.refreshToken!);
		setRoleCookie(res.data.user.role);

		setState({
			user: res.data.user,
			accessToken: res.data.accessToken,
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

			document.cookie = "userRole=; path=/; max-age=0";
			setState({
				user: null,
				accessToken: null,
				isLoading: false,
				isAuthenticated: false,
			});
			router.push("/login");
		}
	};

	return (
		<AuthContext.Provider
			value={{ ...state, login, register, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

export function useRequireAuth(redirectTo = "/login") {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;
		if (!isAuthenticated) {
			router.replace(`${redirectTo}?redirect=/dashboard`);
		}
	}, [isAuthenticated, isLoading, router, redirectTo]);

	return { isAuthenticated, isLoading };
}

export function useRequireRole(
	role: "admin" | "moderator",
	allowAdmin = true, // admins can access any role-gated route by default
) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading || !user) return;
		const hasAccess =
			user.role === role || (allowAdmin && user.role === "admin");
		if (!hasAccess) {
			router.replace("/dashboard");
		}
	}, [user, isLoading, router, role, allowAdmin]);

	return { user, isLoading };
}
