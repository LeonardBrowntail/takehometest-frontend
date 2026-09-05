import { apiFetch } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/token";
import type { LoginResponse, UserResource } from "@/lib/types";

/**
 * Payload for {@link register}. `password` must match `password_confirmation`.
 */
export interface RegisterPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

/**
 * Payload for {@link login}. `identity` is a username, email, or Indonesian phone.
 */
export interface LoginPayload {
  identity: string;
  password: string;
}

/**
 * Registers a new user and creates their wallet.
 *
 * @param payload - The registration data (username, email, phone, password).
 * @returns Resolves to `null` on success; the response carries no body data.
 * @throws {ApiError} With status 400 and per-field errors when validation fails.
 */
export function register(payload: RegisterPayload): Promise<null> {
  return apiFetch<null>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticates a user and returns a Sanctum bearer token.
 *
 * Logging in revokes the user's existing tokens (single active session).
 *
 * @param payload - The login credentials.
 * @returns The bearer token and the authenticated user resource.
 * @throws {ApiError} With status 400 when the credentials are invalid.
 */
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Revokes the current access token on the server and clears it locally.
 *
 * The local token is cleared even when the server request fails, so the client
 * never keeps a revoked token around.
 *
 * @returns Resolves once the token has been revoked and cleared.
 * @throws {ApiError} If the server rejects the logout request.
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch<null>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

/**
 * Checks whether a bearer token is currently stored.
 *
 * @returns `true` when a token exists, otherwise `false`.
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Reads the currently logged-in user from localStorage.
 *
 * @returns The stored user resource, or `null` when absent or unparsable.
 */
export function getCurrentUser(): UserResource | null {
  try {
    const raw = localStorage.getItem("wallet_user");
    return raw ? (JSON.parse(raw) as UserResource) : null;
  } catch {
    return null;
  }
}

/**
 * Removes the stored user from localStorage (used when logging out).
 */
export function clearCurrentUser(): void {
  localStorage.removeItem("wallet_user");
}

/**
 * Persists a login session: stores the bearer token and the authenticated user.
 *
 * @param response - The login response containing the token and user resource.
 */
export function persistLogin(response: LoginResponse): void {
  setToken(response.token);
  localStorage.setItem("wallet_user", JSON.stringify(response.user.data));
}