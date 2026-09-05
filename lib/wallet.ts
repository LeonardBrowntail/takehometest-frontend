import { apiFetch } from "@/lib/api";
import type {
  DataEnvelope,
  TransactionResource,
  WalletResource,
} from "@/lib/types";

/**
 * Normalizes a money input to a decimal string with exactly two decimal places,
 * as required by the API (integer-cents money model).
 *
 * Numeric inputs are formatted via `toFixed(2)`; string inputs are parsed and
 * re-formatted. Non-numeric strings are returned unchanged (and will fail
 * validation on the server).
 *
 * @param amount - The amount to normalize, e.g. `50`, `"50.5"`, or `"50.50"`.
 * @returns The 2-decimal string form, e.g. `"50.50"`.
 */
function normalizeAmount(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(value)) return String(amount);
  return value.toFixed(2);
}

/**
 * Fetches the authenticated user's wallet.
 *
 * Requires an active session (Bearer token).
 *
 * @returns A data envelope wrapping the wallet resource.
 * @throws {ApiError} When the request fails (e.g. unauthenticated).
 */
export function getWallet(): Promise<DataEnvelope<WalletResource>> {
  return apiFetch<DataEnvelope<WalletResource>>("/wallet");
}

/**
 * Adds funds to the authenticated user's wallet.
 *
 * @param amount - The amount to deposit (minimum `1.00`). Accepts a number or a
 *   decimal string; both are normalized to two decimal places.
 * @returns A data envelope wrapping the created deposit transaction.
 * @throws {ApiError} With status 400 when the amount is invalid.
 */
export function topUp(
  amount: number | string,
): Promise<DataEnvelope<TransactionResource>> {
  return apiFetch<DataEnvelope<TransactionResource>>("/topup", {
    method: "POST",
    body: JSON.stringify({ amount: normalizeAmount(amount) }),
  });
}

/**
 * Transfers funds from the authenticated user's wallet to another wallet.
 *
 * @param destinationId - The UUID of the destination wallet.
 * @param amount - The amount to send (minimum `1.00`).
 * @returns A data envelope wrapping the created transfer transaction.
 * @throws {ApiError} With status 422 when the balance is insufficient, or 401
 *   when the destination wallet is unknown.
 */
export function transfer(
  destinationId: string,
  amount: number | string,
): Promise<DataEnvelope<TransactionResource>> {
  return apiFetch<DataEnvelope<TransactionResource>>("/transfer", {
    method: "POST",
    body: JSON.stringify({
      destination_id: destinationId,
      amount: normalizeAmount(amount),
    }),
  });
}

/**
 * Lists the authenticated user's transactions, 10 per page.
 *
 * The response provides the array directly under the envelope's `data` key.
 *
 * @param page - The page number to fetch (defaults to `1`).
 * @returns An array of transaction resources for the requested page.
 */
export function getTransactions(page = 1): Promise<TransactionResource[]> {
  return apiFetch<TransactionResource[]>(`/transactions?page=${page}`);
}