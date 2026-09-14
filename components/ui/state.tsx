import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "./typography";

/**
 * Loading, empty, error and alert states.
 *
 * These exist in the design system from day one rather than being invented per
 * screen - a marketplace whose backend answers in seconds shows loading states
 * constantly, and zero-result states are a product surface in their own right
 * (see docs/ARCHITECTURE.md §10: search must never dead-end).
 */

export function Skeleton({
  className,
  /** Announced to assistive tech by the region that owns it, not by each bar. */
  ...rest
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse rounded-xs bg-rule/70", className)}
      {...rest}
    />
  );
}

/** Wraps a loading region so screen readers hear one message, not fifty bars. */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/**
 * Empty state. `action` and `alternatives` are separate because the research
 * is explicit that a zero-result view must relax a constraint and say so -
 * never just apologise.
 */
export function EmptyState({
  eyebrow = "No results",
  title,
  description,
  action,
  alternatives,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** Concrete next options, e.g. "8 results at 190 GSM in Portugal". */
  alternatives?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-rule-2 bg-paper px-6 py-12 text-center",
        className,
      )}
    >
      <Label>{eyebrow}</Label>
      <p className="mt-3 text-h3 font-semibold text-ink text-balance">
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-2 max-w-[52ch] text-sm text-ink-3 text-pretty">
          {description}
        </p>
      ) : null}
      {alternatives ? (
        <div className="mx-auto mt-6 max-w-[52ch] text-left">
          {alternatives}
        </div>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function Alert({
  tone = "neutral",
  title,
  children,
  className,
}: {
  tone?: "neutral" | "caution" | "alert" | "verified";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "alert" ? "alert" : undefined}
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        tone === "neutral" && "border-rule-2 bg-paper-sunk text-ink-2",
        tone === "caution" && "border-caution/25 bg-caution-soft text-caution",
        tone === "alert" && "border-alert/25 bg-alert-soft text-alert",
        tone === "verified" &&
          "border-verified/25 bg-verified-soft text-verified",
        className,
      )}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={cn(title && "mt-1")}>{children}</div>
    </div>
  );
}
