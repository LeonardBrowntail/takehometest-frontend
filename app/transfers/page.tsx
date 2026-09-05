import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { TransfersPage } from "@/components/transfers";

export const metadata: Metadata = {
  title: "Transfers · E-Wallet",
};

export default function TransfersRoute() {
  return (
    <AuthGuard>
      <TransfersPage />
    </AuthGuard>
  );
}