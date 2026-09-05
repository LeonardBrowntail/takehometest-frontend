import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardPage } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard · E-Wallet",
};

export default function DashboardRoute() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}