// ─── User & Auth Types ───────────────────────────────────────────────────────

export type Role = "user" | "admin" | "moderator";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── API Request Types ────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateRolePayload {
  role: Role;
}

export interface UpdateStatusPayload {
  isActive: boolean;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserStatsResponse {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<Role, number>;
}

// ─── Route & Permission Types ─────────────────────────────────────────────────

export interface RouteConfig {
  path: string;
  allowedRoles: Role[];
  requiresAuth: boolean;
}
