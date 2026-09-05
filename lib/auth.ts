import { apiFetch } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/token";
import type { LoginResponse, UserResource } from "@/lib/types";

export interface RegisterPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  identity: string;
  password: string;
}

export function register(payload: RegisterPayload): Promise<null> {
  return apiFetch<null>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<null>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getCurrentUser(): UserResource | null {
  try {
    const raw = localStorage.getItem("wallet_user");
    return raw ? (JSON.parse(raw) as UserResource) : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser(): void {
  localStorage.removeItem("wallet_user");
}

export function persistLogin(response: LoginResponse): void {
  setToken(response.token);
  localStorage.setItem("wallet_user", JSON.stringify(response.user.data));
}
