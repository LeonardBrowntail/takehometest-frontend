import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth-layout";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign in · E-Wallet",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your wallet"
      subtitle="Access your balance, history, and transfers."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}