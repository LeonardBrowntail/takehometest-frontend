"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getTransactions } from "@/lib/wallet";
import { shortId } from "@/lib/money";
import type { TransactionResource } from "@/lib/types";
import { StatusPill, TypeBadge } from "@/components/ui";

const PAGE_SIZE = 10;

export function TransactionList({
  transactions,
  emptyMessage = "No transactions yet.",
}: {
  transactions: TransactionResource[];
  emptyMessage?: string;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">{emptyMessage}</p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {transaction.attributes.description}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">ID {shortId(transaction.id)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <TypeBadge type={transaction.attributes.type} />
            <StatusPill status={transaction.attributes.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TransactionHistory({
  refreshSignal = 0,
}: {
  refreshSignal?: number;
}) {
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<TransactionResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadPage = useCallback(async (target: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(target);
      setTransactions(result);
      setHasMore(result.length === PAGE_SIZE);
      setPage(target);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getTransactions(1)
      .then((result) => {
        if (!cancelled) {
          setTransactions(result);
          setHasMore(result.length === PAGE_SIZE);
          setPage(1);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load transactions.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshSignal]);

  const emptyMessage =
    page > 1 && transactions.length === 0
      ? "Nothing more to show on this page."
      : "No transfers yet. Top up your wallet or send one to get started.";

  return (
    <div>
      <TransactionList
        transactions={transactions}
        emptyMessage={error ? undefined : emptyMessage}
      />
      {error ? (
        <p className="py-6 text-center text-sm text-red-600">{error}</p>
      ) : null}
      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-4">
        <p className="text-xs text-zinc-400">
          {loading ? "Loading…" : `Page ${page}`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => void loadPage(page - 1)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasMore || loading}
            onClick={() => void loadPage(page + 1)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}