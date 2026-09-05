"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getTransactions, getWallet } from "@/lib/wallet";
import { formatMoney, shortId } from "@/lib/money";
import { useAuth } from "@/lib/auth-context";
import type { TransactionResource, WalletResource } from "@/lib/types";
import {
  Card,
  ErrorBanner,
  Loader,
  StatusPill,
} from "@/components/ui";
import { TopUpDialog, TransferDialog } from "@/components/wallet-actions";
import { TransactionList } from "@/components/transaction-list";

export function DashboardPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletResource | null>(null);
  const [recent, setRecent] = useState<TransactionResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function refresh() {
    setRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    let cancelled = false;

    getWallet()
      .then((result) => {
        if (!cancelled) {
          setWallet(result.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load wallet.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getTransactions(1)
      .then((result) => {
        if (!cancelled) setRecent(result.slice(0, 5));
      })
      .catch(() => {
        // recent activity is non-critical; wallet error already surfaced above
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const username = user?.attributes.username ?? "there";

  if (loading && wallet === null) {
    return <Loader label="Loading your wallet…" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back, {username}. Here is your wallet.
        </p>
      </header>

      <ErrorBanner message={error} />

      {wallet ? (
        <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Current balance</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              {formatMoney(wallet.attributes.balance)}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
              <span>Wallet {shortId(wallet.id)}</span>
              <StatusPill status={wallet.attributes.status} />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <TopUpDialog onCompleted={refresh} />
            <TransferDialog onCompleted={refresh} />
          </div>
        </Card>
      ) : null}

      <Card className="p-0 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 p-6 pb-2 sm:p-6 sm:pb-2">
          <h2 className="text-base font-semibold text-zinc-900">
            Recent activity
          </h2>
          <Link
            href="/transfers"
            className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            See all transfers
          </Link>
        </div>
        <div className="px-6 pb-6">
          <TransactionList
            transactions={recent}
            emptyMessage="No activity yet. Top up your wallet to get started."
          />
        </div>
      </Card>
    </div>
  );
}