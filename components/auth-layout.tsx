import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-base font-bold text-white">
              W
            </span>
            <h1 className="mt-4 text-xl font-bold text-zinc-900">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          Mock e-wallet demo &middot; not a production application
        </p>
      </div>
    </main>
  );
}