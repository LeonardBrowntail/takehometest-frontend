"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Form } from "@base-ui/react/form";
import { ApiError } from "@/lib/api";
import { topUp, transfer } from "@/lib/wallet";
import {
  AppButton,
  buttonClasses,
  ErrorBanner,
  InputField,
  useNotify,
  type ButtonVariant,
} from "@/components/ui";

export function TopUpDialog({
  onCompleted,
  triggerLabel = "Top up",
  variant = "primary",
}: {
  onCompleted?: () => void;
  triggerLabel?: string;
  variant?: ButtonVariant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();

  async function handleSubmit(values: { amount: string }) {
    setPending(true);
    setError(null);
    try {
      await topUp(values.amount);
      notify("Deposited", "Your balance has been topped up.");
      setOpen(false);
      onCompleted?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Top up failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={<AppButton variant={variant}>{triggerLabel}</AppButton>}
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold text-zinc-900">
              Top up your wallet
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-500">
              Add funds to your wallet balance. Minimum amount is 1.00.
            </Dialog.Description>
          </div>
          <div className="flex flex-col gap-4">
            <ErrorBanner message={error} />
            <Form
              onFormSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <InputField
                name="amount"
                label="Amount (IDR)"
                type="number"
                inputMode="decimal"
                min={1}
                step="0.01"
                required
                placeholder="50.00"
              />
              <div className="flex justify-end gap-3">
                <Dialog.Close className={buttonClasses.secondary}>
                  Cancel
                </Dialog.Close>
                <AppButton type="submit" disabled={pending}>
                  {pending ? "Processing…" : "Add funds"}
                </AppButton>
              </div>
            </Form>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function TransferDialog({
  onCompleted,
  triggerLabel = "Transfer",
  variant = "secondary",
}: {
  onCompleted?: () => void;
  triggerLabel?: string;
  variant?: ButtonVariant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();

  async function handleSubmit(values: { destination_id: string; amount: string }) {
    setPending(true);
    setError(null);
    try {
      await transfer(values.destination_id, values.amount);
      notify("Transfer sent", `IDR ${values.amount} was transferred.`);
      setOpen(false);
      onCompleted?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Transfer failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={<AppButton variant={variant}>{triggerLabel}</AppButton>}
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold text-zinc-900">
              Transfer to another wallet
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-500">
              Send funds to a wallet&apos;s UUID. Minimum amount is 1.00.
            </Dialog.Description>
          </div>
          <div className="flex flex-col gap-4">
            <ErrorBanner message={error} />
            <Form
              onFormSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <InputField
                name="destination_id"
                label="Destination wallet ID (UUID)"
                required
                pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
                hint="Paste the recipient wallet's UUID."
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
              <InputField
                name="amount"
                label="Amount (IDR)"
                type="number"
                inputMode="decimal"
                min={1}
                step="0.01"
                required
                placeholder="25.50"
              />
              <div className="flex justify-end gap-3">
                <Dialog.Close className={buttonClasses.secondary}>
                  Cancel
                </Dialog.Close>
                <AppButton type="submit" disabled={pending}>
                  {pending ? "Processing…" : "Send transfer"}
                </AppButton>
              </div>
            </Form>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}