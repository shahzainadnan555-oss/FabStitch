import Link from "next/link";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import type { MetricValue } from "./types";

const STATUS_TONES: Record<string, BadgeTone> = {
  active: "verified",
  approved: "verified",
  completed: "verified",
  delivered: "verified",
  paid: "verified",
  published: "verified",
  succeeded: "verified",
  verified: "verified",
  cancelled: "alert",
  disabled: "alert",
  failed: "alert",
  rejected: "alert",
  suspended: "alert",
  archived: "neutral",
  draft: "neutral",
  pending: "caution",
  pending_review: "caution",
  new: "caution",
  processing: "indigo",
  in_progress: "indigo",
  contacted: "indigo",
  under_review: "indigo",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={STATUS_TONES[status.toLowerCase()] ?? "neutral"}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}

export function MetricDisplay({ metric }: { metric: MetricValue }) {
  if (
    !metric.available ||
    metric.value === null ||
    metric.value === undefined
  ) {
    return <span className="text-ink-4">Unavailable</span>;
  }
  return <>{metric.value.toLocaleString()}</>;
}

export function DateTime({ value }: { value?: string | null }) {
  if (!value) return <span className="text-ink-4">—</span>;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return <span>{value}</span>;
  return (
    <time dateTime={value} title={parsed.toISOString()}>
      {new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsed)}
    </time>
  );
}

export function Money({
  amount,
  currency,
}: {
  amount?: string | null;
  currency: string;
}) {
  if (amount === null || amount === undefined) {
    return <span className="text-ink-4">Unavailable</span>;
  }
  return (
    <span className="font-mono tabular-nums">
      {amount} {currency}
    </span>
  );
}

export function DefinitionGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid border-t border-l border-rule sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-r border-b border-rule bg-paper-raised px-4 py-3"
        >
          <dt>
            <Label>{item.label}</Label>
          </dt>
          <dd className="mt-1.5 break-words text-sm text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CountList({
  title,
  items,
}: {
  title: string;
  items: { key: string; label?: string | null; count: number }[];
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-rule px-4 py-3">
        <h3 className="text-body font-semibold text-ink">{title}</h3>
      </div>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5 text-sm"
            >
              <span className="text-ink-2">{item.label || item.key}</span>
              <span className="font-mono tabular-nums text-ink">
                {item.count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-4 text-sm text-ink-4">No recorded data.</p>
      )}
    </Panel>
  );
}

export function AdminPager({
  path,
  total,
  limit,
  offset,
  query = {},
}: {
  path: string;
  total: number;
  limit: number;
  offset: number;
  query?: Record<string, string | undefined>;
}) {
  const href = (nextOffset: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    params.set("offset", String(nextOffset));
    return `${path}?${params.toString()}`;
  };

  if (total <= limit && offset === 0) return null;
  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-between gap-3"
    >
      <p className="text-xs text-ink-3">
        {total === 0
          ? "No records"
          : `${offset + 1}–${Math.min(offset + limit, total)} of ${total}`}
      </p>
      <div className="flex gap-2">
        {offset > 0 ? (
          <ButtonLink href={href(Math.max(0, offset - limit))} size="sm">
            Previous
          </ButtonLink>
        ) : null}
        {offset + limit < total ? (
          <ButtonLink href={href(offset + limit)} size="sm">
            Next
          </ButtonLink>
        ) : null}
      </div>
    </nav>
  );
}

export function AdminRecordLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="font-medium text-indigo hover:underline">
      {children}
    </Link>
  );
}
