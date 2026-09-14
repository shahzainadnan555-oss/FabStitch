import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/typography";
import { ButtonLink } from "@/components/ui/button";
import {
  IconArrowRight,
  IconTrendDown,
  IconTrendUp,
} from "@/components/ui/icon";

/**
 * Workspace building blocks.
 *
 * Shared by buyer, supplier and admin so the three workspaces stay one product
 * rather than three dashboards that drifted apart.
 *
 * `WorkQueue` deliberately leads with an **empty state that names the next
 * action**. A new account genuinely has no RFQs, and inventing some to make a
 * screenshot look busy would be exactly the fabricated marketplace activity
 * this project forbids (docs/DECISIONS.md R7).
 */

export function WorkspaceSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("px-4 py-6 sm:px-6", className)}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-h3 font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-ink-3">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * A queue of work. Renders rows when there are any, and a purposeful empty
 * state when there are not.
 */
export function WorkQueue({
  emptyTitle,
  emptyBody,
  cta,
  rows,
}: {
  emptyTitle: string;
  emptyBody: string;
  cta: { label: string; href: string };
  rows?: ReactNode;
}) {
  if (rows) {
    return (
      <div className="overflow-hidden rounded-md border border-rule-2 bg-paper-raised">
        {rows}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-dashed border-rule-2 bg-paper-raised px-5 py-8 text-center">
      <p className="text-body font-medium text-ink">{emptyTitle}</p>
      <p className="mx-auto mt-1.5 max-w-[52ch] text-sm text-ink-3 text-pretty">
        {emptyBody}
      </p>
      <ButtonLink
        href={cta.href}
        variant="primary"
        className="mt-4"
        trailing={<IconArrowRight width={14} height={14} />}
      >
        {cta.label}
      </ButtonLink>
    </div>
  );
}

/**
 * Summary figures. Values are passed in - this component never computes or
 * invents a number, and renders an em dash where there is nothing to show.
 */
export function MetricRow({
  metrics,
  className,
}: {
  metrics: { label: string; value: ReactNode; href?: string }[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 border-t border-l border-rule-2 lg:grid-cols-4",
        className,
      )}
    >
      {metrics.map((metric) => {
        const body = (
          <>
            <dt>
              <Label>{metric.label}</Label>
            </dt>
            <dd className="mt-1.5 font-mono text-h3 tabular-nums text-ink">
              {metric.value}
            </dd>
          </>
        );
        return (
          <div
            key={metric.label}
            className="border-r border-b border-rule-2 bg-paper-raised"
          >
            {metric.href ? (
              <Link
                href={metric.href}
                className="block px-4 py-3.5 transition-colors hover:bg-paper-sunk"
              >
                {body}
              </Link>
            ) : (
              <div className="px-4 py-3.5">{body}</div>
            )}
          </div>
        );
      })}
    </dl>
  );
}

/** Generic workspace list table with consistent empty handling. */
export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: ReactNode[][];
  empty: { title: string; body: string; cta?: { label: string; href: string } };
}) {
  if (!rows.length) {
    return (
      <div className="rounded-md border border-dashed border-rule-2 bg-paper-raised px-5 py-10 text-center">
        <p className="text-body font-medium text-ink">{empty.title}</p>
        <p className="mx-auto mt-1.5 max-w-[52ch] text-sm text-ink-3 text-pretty">
          {empty.body}
        </p>
        {empty.cta ? (
          <ButtonLink href={empty.cta.href} variant="primary" className="mt-4">
            {empty.cta.label}
          </ButtonLink>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-rule-2 bg-paper-raised">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-rule-2 bg-paper-sunk px-3 py-2.5 font-mono text-label uppercase tracking-[0.09em] text-ink-3"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border-b border-rule px-3 py-2.5 text-sm text-ink-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Metric tile.
 *
 * The reference mockups pair each figure with an icon medallion and a
 * period-over-period delta. The medallion is reproduced; the delta is not
 * invented. When no account is connected the value reads as absent and the
 * caption names the period it would cover, which is honest and still fills the
 * same visual slot.
 */
export function MetricTile({
  label,
  href,
  period,
  value,
  delta,
  Icon,
}: {
  label: string;
  href: string;
  /** "Last 30 days", "Month to date". Always shown, so the figure is scoped. */
  period: string;
  /** Formatted figure. Omit when there is no account and none exists. */
  value?: string;
  /** Percentage change. Only ever passed a number the data layer returned. */
  delta?: number;
  Icon: ComponentType<{ width?: number; height?: number; className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="fs-card fs-card-interactive flex items-start gap-3.5 rounded-lg border border-rule-2 bg-paper-raised px-4 py-4"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
        <Icon width={17} height={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-ink-3">{label}</span>
        <span
          className={cn(
            "mt-1 block font-mono text-h2 tabular-nums",
            value ? "text-ink" : "text-ink-4",
          )}
        >
          {value ?? "No data"}
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-xs">
          {typeof delta === "number" ? (
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                delta >= 0 ? "text-verified" : "text-alert",
              )}
            >
              {delta >= 0 ? (
                <IconTrendUp width={12} height={12} />
              ) : (
                <IconTrendDown width={12} height={12} />
              )}
              {Math.abs(delta)}%
            </span>
          ) : null}
          <span className="text-ink-4">{period}</span>
        </span>
      </span>
    </Link>
  );
}
