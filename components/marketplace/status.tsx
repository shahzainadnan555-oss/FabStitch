import { cn } from "@/lib/cn";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Label } from "@/components/ui/typography";
import { IconCheck } from "@/components/ui/icon";

/**
 * The shared state vocabulary.
 *
 * Every workflow in the marketplace - RFQ, quote, sample, order, listing,
 * verification - draws its labels and tones from this one map. A single
 * vocabulary is what stops "pending" meaning three different things in three
 * places, and it means a buyer learns the colour language once.
 *
 * Enum values mirror the live API where one exists (`FabricStatus`,
 * `StockStatus`); the workflow states follow the order lifecycle in the
 * OpenAPI's supplier and buyer order endpoints.
 */

export type StatusKey =
  // listing lifecycle - mirrors FabricStatus
  | "draft"
  | "pending_review"
  | "active"
  | "rejected"
  | "suspended"
  | "out_of_stock"
  | "archived"
  // stock - mirrors StockStatus
  | "in_stock"
  | "low_stock"
  | "made_to_order"
  // rfq
  | "rfq_draft"
  | "rfq_open"
  | "rfq_responses"
  | "rfq_closed"
  | "rfq_cancelled"
  // quote
  | "quote_pending"
  | "quote_received"
  | "quote_accepted"
  | "quote_rejected"
  | "quote_expired"
  | "quote_revised"
  // sample
  | "sample_requested"
  | "sample_accepted"
  | "sample_preparing"
  | "sample_shipped"
  | "sample_delivered"
  | "sample_approved"
  | "sample_declined"
  // order
  | "order_pending_payment"
  | "order_paid"
  | "order_confirmed"
  | "order_in_production"
  | "order_ready"
  | "order_shipped"
  | "order_delivered"
  | "order_completed"
  | "order_cancelled"
  | "order_disputed"
  // verification
  | "verified"
  | "unverified"
  | "verification_pending"
  // generic
  | "incomplete"
  | "complete";

type StatusDef = { label: string; tone: BadgeTone };

export const STATUS: Record<StatusKey, StatusDef> = {
  draft: { label: "Draft", tone: "neutral" },
  pending_review: { label: "Pending review", tone: "caution" },
  active: { label: "Published", tone: "verified" },
  rejected: { label: "Rejected", tone: "alert" },
  suspended: { label: "Suspended", tone: "alert" },
  out_of_stock: { label: "Out of stock", tone: "alert" },
  archived: { label: "Archived", tone: "neutral" },

  in_stock: { label: "In stock", tone: "verified" },
  low_stock: { label: "Low stock", tone: "caution" },
  made_to_order: { label: "Made to order", tone: "neutral" },

  rfq_draft: { label: "Draft", tone: "neutral" },
  rfq_open: { label: "Open", tone: "indigo" },
  rfq_responses: { label: "Responses in", tone: "verified" },
  rfq_closed: { label: "Closed", tone: "neutral" },
  rfq_cancelled: { label: "Cancelled", tone: "neutral" },

  quote_pending: { label: "Awaiting quote", tone: "caution" },
  quote_received: { label: "Quote received", tone: "indigo" },
  quote_accepted: { label: "Accepted", tone: "verified" },
  quote_rejected: { label: "Declined", tone: "neutral" },
  quote_expired: { label: "Expired", tone: "alert" },
  quote_revised: { label: "Revised", tone: "caution" },

  sample_requested: { label: "Requested", tone: "caution" },
  sample_accepted: { label: "Accepted", tone: "indigo" },
  sample_preparing: { label: "Preparing", tone: "indigo" },
  sample_shipped: { label: "Shipped", tone: "indigo" },
  sample_delivered: { label: "Delivered", tone: "verified" },
  sample_approved: { label: "Approved", tone: "verified" },
  sample_declined: { label: "Declined", tone: "neutral" },

  order_pending_payment: { label: "Pending payment", tone: "caution" },
  order_paid: { label: "Paid", tone: "indigo" },
  order_confirmed: { label: "Confirmed", tone: "indigo" },
  order_in_production: { label: "In production", tone: "indigo" },
  order_ready: { label: "Ready to ship", tone: "indigo" },
  order_shipped: { label: "Shipped", tone: "indigo" },
  order_delivered: { label: "Delivered", tone: "verified" },
  order_completed: { label: "Completed", tone: "verified" },
  order_cancelled: { label: "Cancelled", tone: "neutral" },
  order_disputed: { label: "Disputed", tone: "alert" },

  verified: { label: "Verified", tone: "verified" },
  unverified: { label: "Unverified", tone: "neutral" },
  verification_pending: { label: "Verification pending", tone: "caution" },

  incomplete: { label: "Incomplete", tone: "caution" },
  complete: { label: "Complete", tone: "verified" },
};

export function StatusPill({
  status,
  className,
}: {
  status: StatusKey;
  className?: string;
}) {
  const def = STATUS[status];
  return (
    <Badge tone={def.tone} className={className}>
      {def.label}
    </Badge>
  );
}

/* ==========================================================================
 Workflow trail
 ========================================================================== */

export const ORDER_TRAIL: StatusKey[] = [
  "order_confirmed",
  "order_in_production",
  "order_ready",
  "order_shipped",
  "order_delivered",
  "order_completed",
];

export const SAMPLE_TRAIL: StatusKey[] = [
  "sample_requested",
  "sample_accepted",
  "sample_preparing",
  "sample_shipped",
  "sample_delivered",
];

/**
 * Horizontal progress through a workflow. Shows position, not just state -
 * "in production" means little without knowing what comes next.
 */
export function WorkflowTrail({
  trail,
  current,
  className,
}: {
  trail: StatusKey[];
  current: StatusKey;
  className?: string;
}) {
  const index = trail.indexOf(current);

  return (
    <ol className={cn("flex flex-wrap gap-y-3", className)}>
      {trail.map((step, i) => {
        const done = index > i;
        const active = index === i;
        return (
          <li
            key={step}
            className="flex min-w-0 flex-1 items-start gap-2.5 pr-3"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[10px]",
                done && "border-verified bg-verified text-white",
                active && "border-indigo bg-indigo text-white",
                !done && !active && "border-rule-2 bg-paper text-ink-4",
              )}
            >
              {done ? <IconCheck width={11} height={11} /> : i + 1}
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-sm",
                  active ? "font-medium text-ink" : "text-ink-3",
                )}
              >
                {STATUS[step].label}
              </span>
              {active ? (
                <Label tone="indigo" className="mt-0.5 block">
                  Current
                </Label>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
