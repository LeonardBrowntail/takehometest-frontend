import { apiFetch } from "@/lib/api";
import type {
  DataEnvelope,
  TransactionResource,
  WalletResource,
} from "@/lib/types";

function normalizeAmount(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(value)) return String(amount);
  return value.toFixed(2);
}

export function getWallet(): Promise<DataEnvelope<WalletResource>> {
  return apiFetch<DataEnvelope<WalletResource>>("/wallet");
}

export function topUp(
  amount: number | string,
): Promise<DataEnvelope<TransactionResource>> {
  return apiFetch<DataEnvelope<TransactionResource>>("/topup", {
    method: "POST",
    body: JSON.stringify({ amount: normalizeAmount(amount) }),
  });
}

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

export function getTransactions(page = 1): Promise<TransactionResource[]> {
  return apiFetch<TransactionResource[]>(`/transactions?page=${page}`);
}