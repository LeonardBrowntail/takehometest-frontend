/**
 * Key under which the Sanctum bearer token is stored in localStorage.
 */
const TOKEN_KEY = "wallet_access_token";

/**
 * Reads the Sanctum bearer token from localStorage.
 *
 * Safe to call during server-side rendering – returns `null` outside a browser.
 *
 * @returns The stored token, or `null` when there is none.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/**
 * Stores the Sanctum bearer token in localStorage.
 *
 * @param token - The token to persist.
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Removes the Sanctum bearer token from localStorage.
 */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}