"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import type { Order } from "@/lib/api/types";
import { Button } from "@/components/ui/button";

type CancelOrderRequest = components["schemas"]["CancelOrderRequest"];

export function CustomerOrderActions({
  orderNumber,
  status,
}: {
  orderNumber: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const canCancel = status === "draft" || status === "pending";

  if (!canCancel) {
    return (
      <p className="text-sm text-ink-3">
        This order can no longer be cancelled from the customer account.
      </p>
    );
  }

  function cancel() {
    setError(null);
    startTransition(async () => {
      try {
        const body: CancelOrderRequest = reason.trim()
          ? { reason: reason.trim() }
          : {};
        await api.post<Order, CancelOrderRequest>(
          `/orders/${encodeURIComponent(orderNumber)}/cancel`,
          { body },
        );
        setConfirming(false);
        setReason("");
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof ApiError
            ? caught
            : new ApiError({
                status: 0,
                code: "request_failed",
                message: "FabStitch could not cancel this order.",
              }),
        );
      }
    });
  }

  if (!confirming) {
    return (
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => setConfirming(true)}
      >
        Cancel order
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-label font-medium uppercase text-ink-3">
          Cancellation reason (optional)
        </span>
        <textarea
          value={reason}
          maxLength={512}
          onChange={(event) => {
            setReason(event.target.value);
            setError(null);
          }}
          rows={3}
          className="w-full resize-y rounded-sm border border-border bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-indigo focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" disabled={pending} onClick={cancel}>
          {pending ? "Cancelling…" : "Confirm cancellation"}
        </Button>
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setReason("");
            setError(null);
          }}
        >
          Keep order
        </Button>
      </div>
      {error ? (
        <div role="alert" className="text-sm text-alert">
          <p>{error.message}</p>
          {error.requestId ? (
            <p className="mt-1 font-mono text-label">
              Request {error.requestId}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
