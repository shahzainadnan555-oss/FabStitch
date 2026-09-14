"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { INITIAL_ADMIN_ACTION_STATE, type AdminActionState } from "./types";

type AdminServerAction = (
  previous: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

export function AdminActionForm({
  action,
  submitLabel,
  pendingLabel = "Submitting…",
  children,
  className,
  danger,
}: {
  action: AdminServerAction;
  submitLabel: string;
  pendingLabel?: string;
  children?: React.ReactNode;
  className?: string;
  danger?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ADMIN_ACTION_STATE,
  );

  return (
    <form action={formAction} className={cn("space-y-3", className)}>
      {children}
      <Button
        type="submit"
        size="sm"
        variant={danger ? "secondary" : "primary"}
        disabled={pending}
        className={
          danger ? "border-alert text-alert hover:border-alert" : undefined
        }
      >
        {pending ? pendingLabel : submitLabel}
      </Button>
      {state.status !== "idle" ? (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "text-xs",
            state.status === "error" ? "text-alert" : "text-verified",
          )}
        >
          <p>{state.message}</p>
          {state.requestId ? (
            <p className="mt-1 font-mono">Request ID: {state.requestId}</p>
          ) : null}
          {state.href ? (
            <Link
              href={state.href}
              className="mt-1 inline-block font-medium underline"
            >
              {state.linkLabel ?? "Open record"}
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
