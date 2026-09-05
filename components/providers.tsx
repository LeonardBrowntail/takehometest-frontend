"use client";

import type { ReactNode } from "react";
import { Toast } from "@base-ui/react/toast";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toast.Provider>
        {children}
        <Toast.Portal>
          <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
            <ToastList />
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    </AuthProvider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  if (toasts.length === 0) return null;
  return (
    <>
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className="data-ending-style:opacity-0 data-starting-style:opacity-0 data-starting-style:translate-y-2 transition-[opacity,transform] duration-150 ease-out"
        >
          <Toast.Content className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
            <div className="flex min-w-0 flex-col gap-1">
              <Toast.Title className="text-sm font-semibold text-zinc-900" />
              <Toast.Description className="text-sm text-zinc-500" />
            </div>
            <Toast.Close
              aria-label="Dismiss notification"
              className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100"
            >
              Dismiss
            </Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  );
}