"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui";
import { TopUpDialog, TransferDialog } from "@/components/wallet-actions";
import { TransactionHistory } from "@/components/transaction-list";

export function TransfersPage() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const refresh = useCallback(() => setRefreshSignal((signal) => signal + 1), []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Transfers</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your deposit and transfer history.
          </p>
        </div>
        <div className="flex gap-2">
          <TopUpDialog onCompleted={refresh} />
          <TransferDialog triggerLabel="New transfer" onCompleted={refresh} />
        </div>
      </header>

      <Card>
        <TransactionHistory refreshSignal={refreshSignal} />
      </Card>
    </div>
  );
}