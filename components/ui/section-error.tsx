"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Section-level failure UI. Keeps the rest of the page mounted.
 */
export function SectionError({
  title,
  description,
  onRetry,
  className,
  children,
}: {
  title: string;
  description?: string;
  onRetry?: () => void | Promise<void>;
  className?: string;
  children?: ReactNode;
}) {
  const [pending, setPending] = useState(false);

  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-alert/25 bg-alert-soft/40 px-4 py-5",
        className,
      )}
    >
      <p className="font-mono text-label tracking-[0.08em] text-alert uppercase">
        Temporarily unavailable
      </p>
      <h2 className="mt-2 text-h3 font-semibold text-ink text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-ink-3 text-pretty">
          {description}
        </p>
      ) : null}
      {children}
      {onRetry ? (
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          disabled={pending}
          onClick={() => {
            if (pending) return;
            setPending(true);
            void Promise.resolve(onRetry()).finally(() => setPending(false));
          }}
        >
          {pending ? "Retrying…" : "Retry"}
        </Button>
      ) : null}
    </div>
  );
}
