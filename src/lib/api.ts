import {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateRolePayload,
  UpdateStatusPayload,
  UpdateUserPayload,
  User,
  UserStatsResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Token Management ─────────────────────────────────────────────────────────

// export const tokenStorage = {
//   getAccess: () =>
//     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
//   setAccess: (token: string) =>
//     typeof window !== "undefined" && localStorage.setItem("accessToken", token),
//   getRefresh: () =>
//     typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
//   setRefresh: (token: string) =>
//     typeof window !== "undefined" &&
//     localStorage.setItem("refreshToken", token),
//   clear: () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     }
//   },
// };

export const tokenStorage = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  setAccess: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      // Cookie bhi set karo taake middleware check kar sake
      document.cookie = `accessToken=${token}; path=/; max-age=900`;
    }
  },
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  setRefresh: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", token);
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Cookie bhi clear karo
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "userRole=; path=/; max-age=0";
    }
  },
};

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = tokenStorage.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-refresh on 401
  if (res.status === 401 && withAuth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${tokenStorage.getAccess()}`;
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryRes.ok) {
        const err = await retryRes.json();
        throw new Error(err.message || "Request failed");
      }
      return retryRes.json();
    }
    tokenStorage.clear();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

// ─── Auth Routes: /api/auth ───────────────────────────────────────────────────

export const auth = {
  /** POST /auth/register */
  register: (payload: RegisterPayload) =>
    apiFetch<AuthResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    ),

  /** POST /auth/login */
  login: (payload: LoginPayload) =>
    apiFetch<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false,
    ),

  /** GET /auth/me */
  getMe: () => apiFetch<{ success: boolean; data: { user: User } }>("/auth/me"),

  /** POST /auth/logout */
  logout: () =>
    apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" }),
};

async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data: AuthResponse = await res.json();

    if (data.data?.accessToken) {
      tokenStorage.setAccess(data.data.accessToken);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ─── User Routes: /api/users ──────────────────────────────────────────────────

export const users = {
  /** GET /users (admin only) */
  getAll: () => apiFetch<{ success: boolean; users: User[] }>("/users"),

  /** GET /users/stats (admin only) */
  getStats: () =>
    apiFetch<{ success: boolean; stats: UserStatsResponse }>("/users/stats"),

  /** GET /users/:id (owner or admin) */
  getById: (id: string) =>
    apiFetch<{ success: boolean; data: { user: User } }>(`/users/${id}`),

  /** PUT /users/:id (owner or admin) */
  update: (id: string, payload: UpdateUserPayload) =>
    apiFetch<{ success: boolean; user: User }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  /** PATCH /users/:id/password (owner or admin) */
  changePassword: (id: string, payload: ChangePasswordPayload) =>
    apiFetch<{ success: boolean }>(`/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /** PATCH /users/:id/role (admin only) */
  updateRole: (id: string, payload: UpdateRolePayload) =>
    apiFetch<{ success: boolean; user: User }>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /** PATCH /users/:id/status (admin only) */
  updateStatus: (id: string, payload: UpdateStatusPayload) =>
    apiFetch<{ success: boolean; user: User }>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /** DELETE /users/:id (admin only) */
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/users/${id}`, { method: "DELETE" }),
};
