import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth-layout";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Create account · E-Wallet",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="A wallet is created automatically when you sign up."
    >
      <RegisterForm />
    </AuthLayout>
  );
}