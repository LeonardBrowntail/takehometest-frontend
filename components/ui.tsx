"use client";

import Link from "next/link";
import { useCallback } from "react";
import type { ReactNode } from "react";
import { Button } from "@base-ui/react/button";
import { Field } from "@base-ui/react/field";
import { Toast } from "@base-ui/react/toast";

const buttonVariants = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition select-none hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 data-disabled:pointer-events-none data-disabled:opacity-60",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition select-none hover:bg-zinc-50 active:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 data-disabled:pointer-events-none data-disabled:opacity-60",
  ghost:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-zinc-600 transition select-none hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 data-disabled:pointer-events-none data-disabled:opacity-60",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export const buttonClasses = buttonVariants;

export function AppButton({
  variant = "primary",
  className = "",
  ...props
}: Button.Props & { variant?: ButtonVariant; className?: string }) {
  return (
    <Button {...props} className={`${buttonVariants[variant]} ${className}`} />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${buttonVariants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-zinc-500">
      <span className="animate-pulse">{label}</span>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

export function StatusPill({ status }: { status: string }) {
  const className = statusStyles[status] ?? "bg-zinc-100 text-zinc-600";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}
    >
      {status}
    </span>
  );
}

const typeStyles: Record<string, string> = {
  deposit: "text-emerald-700",
  transfer: "text-sky-700",
  withdraw: "text-zinc-700",
};

export function TypeBadge({ type }: { type: string }) {
  const className = typeStyles[type] ?? "text-zinc-700";
  return (
    <span className={`text-xs font-bold uppercase tracking-wide ${className}`}>
      {type}
    </span>
  );
}

export interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: number | string;
  step?: number | string;
  hint?: string;
  className?: string;
  validate?: (
    value: unknown,
    formValues: Record<string, unknown>,
  ) =>
    | string
    | void
    | string[]
    | Promise<string | void | string[] | null>
    | null;
}

export function InputField({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  required,
  minLength,
  pattern,
  inputMode,
  min,
  step,
  hint,
  className = "",
  validate,
}: InputFieldProps) {
  return (
    <Field.Root
      name={name}
      validate={validate}
      className={`flex flex-col gap-1.5 ${className}`}
    >
      <Field.Label className="text-sm font-medium text-zinc-700">
        {label}
      </Field.Label>
      <Field.Control
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        pattern={pattern}
        inputMode={inputMode}
        min={min}
        step={step}
        className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 data-invalid:border-red-500 data-invalid:focus:ring-red-500/30"
      />
      {hint ? (
        <Field.Description className="text-xs text-zinc-500">{hint}</Field.Description>
      ) : null}
      <Field.Error className="text-sm text-red-600" />
    </Field.Root>
  );
}

export function useNotify() {
  const toastManager = Toast.useToastManager();
  return useCallback(
    (title: string, description?: string) => {
      toastManager.add({ title, description });
    },
    [toastManager],
  );
}