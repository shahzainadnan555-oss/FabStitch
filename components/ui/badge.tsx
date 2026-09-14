import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconVerified } from "./icon";

export type BadgeTone =
  "neutral" | "indigo" | "verified" | "caution" | "alert" | "on-ink";

const TONE: Record<BadgeTone, string> = {
  neutral: "border-rule-2 bg-paper-sunk text-ink-2",
  indigo: "border-indigo/25 bg-indigo-soft text-indigo",
  verified: "border-verified/25 bg-verified-soft text-verified",
  caution: "border-caution/25 bg-caution-soft text-caution",
  alert: "border-alert/25 bg-alert-soft text-alert",
  "on-ink": "border-rule-on-ink bg-ink-surface-2 text-on-ink-2",
};

/**
 * A status marker. Square, mono, uppercase - reads as a stamp on a document
 * rather than a pill. Never used for decoration; a badge always carries state.
 */
export function Badge({
  tone = "neutral",
  leading,
  className,
  children,
}: {
  tone?: BadgeTone;
  leading?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-1.5 py-0.5",
        "font-mono text-label font-medium uppercase whitespace-nowrap",
        TONE[tone],
        className,
      )}
    >
      {leading}
      {children}
    </span>
  );
}

/**
 * Supplier verification state. Split out from `Badge` because it carries a
 * compliance meaning that must never be applied loosely - an unverified
 * supplier says so explicitly rather than showing nothing.
 */
export function VerificationMark({
  verified,
  className,
}: {
  verified: boolean;
  className?: string;
}) {
  if (!verified) {
    return (
      <Badge tone="neutral" className={className}>
        Unverified
      </Badge>
    );
  }

  return (
    <Badge
      tone="verified"
      leading={<IconVerified width={11} height={11} />}
      className={className}
    >
      Verified
    </Badge>
  );
}

/**
 * A removable facet chip. This is what a parsed search query decomposes into,
 * so the buyer can see exactly what FabStitch understood and unpick it.
 */
export function Chip({
  facet,
  value,
  onRemove,
  removeLabel,
}: {
  facet: string;
  value: string;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <span className="inline-flex items-center rounded-xs border border-rule-2 bg-paper-raised">
      <span className="border-r border-rule px-1.5 py-1 font-mono text-label font-medium uppercase text-ink-3">
        {facet}
      </span>
      <span className="px-2 py-1 text-xs font-medium text-ink">{value}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="mr-0.5 grid size-5 place-items-center rounded-xs text-ink-3 transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          <span className="sr-only">
            {removeLabel ?? `Remove ${facet} ${value}`}
          </span>
          <svg
            viewBox="0 0 16 16"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 4 12 12M12 4 4 12" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
