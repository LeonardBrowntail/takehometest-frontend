"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Form } from "@base-ui/react/form";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import {
  AppButton,
  ErrorBanner,
  InputField,
} from "@/components/ui";

interface LoginValues {
  identity: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {},
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const justRegistered = searchParams.get("registered") === "1";

  async function handleSubmit(values: LoginValues) {
    setServerErrors({});
    setGeneralError(null);
    setPending(true);
    try {
      await login({ identity: values.identity, password: values.password });
      router.replace("/dashboard");
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      setServerErrors(apiError?.errors ?? {});
      setGeneralError(apiError?.message ?? "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {justRegistered ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Account created. Sign in to continue.
        </div>
      ) : null}
      <ErrorBanner message={generalError} />
      <Form
        errors={serverErrors}
        onFormSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <InputField
          name="identity"
          label="Username, email, or phone"
          autoComplete="username"
          required
          placeholder="alice"
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        <AppButton type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </AppButton>
      </Form>
      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

interface RegisterValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {},
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(values: RegisterValues) {
    setServerErrors({});
    setGeneralError(null);
    setPending(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      router.replace("/login?registered=1");
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      setServerErrors(apiError?.errors ?? {});
      setGeneralError(apiError?.message ?? "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ErrorBanner message={generalError} />
      <Form
        errors={serverErrors}
        onFormSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <InputField
          name="username"
          label="Username"
          autoComplete="username"
          required
          minLength={3}
          pattern="[a-zA-Z0-9_-]+"
          hint="3+ characters, letters, numbers, dashes or underscores."
          placeholder="alice"
        />
        <InputField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          placeholder="alice@example.com"
        />
        <InputField
          name="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          pattern="08\d{8,12}"
          hint="Indonesian mobile number, e.g. 081234567891."
          placeholder="081234567891"
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
          placeholder="••••••••"
        />
        <InputField
          name="password_confirmation"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          validate={(value, values) =>
            String(value) !== String(values.password)
              ? "Passwords do not match."
              : null
          }
          placeholder="••••••••"
        />
        <AppButton type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account…" : "Create account"}
        </AppButton>
      </Form>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}