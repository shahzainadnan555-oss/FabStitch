"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/features/notifications/actions";

/**
 * The two read-state controls, kept apart from the feed so the feed itself
 * stays a server component and never ships the whole list to the browser.
 *
 * Read state is **real**: `Notification.read_at` is a stored timestamp and both
 * buttons call named backend endpoints. There is no "mark unread" here because
 * the backend has no such operation, and a button that only changed the colour
 * of a row would be inventing a state the marketplace does not keep.
 */

function useAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: () => Promise<{ status: string; message?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.status === "error") {
        setError(result.message ?? "That did not go through.");
      } else {
        router.refresh();
      }
    });
  };

  return { pending, error, run };
}

export function MarkRead({ id }: { id: string }) {
  const { pending, error, run } = useAction();
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() => run(() => markNotificationRead(id))}
      >
        Mark read
      </Button>
      {error ? (
        <span role="alert" className="text-label text-alert">
          {error}
        </span>
      ) : null}
    </>
  );
}

export function MarkAllRead() {
  const { pending, error, run } = useAction();
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() => run(() => markAllNotificationsRead())}
      >
        {pending ? "Working…" : "Mark all read"}
      </Button>
      {error ? (
        <span role="alert" className="text-sm text-alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
