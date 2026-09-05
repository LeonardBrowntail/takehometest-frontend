"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppButton, LinkButton } from "@/components/ui";

const authLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transfers", label: "Transfers" },
];

export function SiteNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const displayName = user?.attributes.username ?? user?.attributes.email ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-lg font-bold text-zinc-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            W
          </span>
          E-Wallet
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <nav className="mr-2 flex items-center gap-1">
                {authLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/dashboard" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <span className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pr-3 pl-1 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {displayName.charAt(0).toUpperCase() || "?"}
                </span>
                <span className="max-w-40 truncate text-sm font-medium text-zinc-700">
                  {displayName}
                </span>
              </span>
              <AppButton variant="ghost" onClick={handleLogout}>
                Log out
              </AppButton>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Sign in
              </Link>
              <LinkButton href="/register" className="h-9">
                Create account
              </LinkButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}