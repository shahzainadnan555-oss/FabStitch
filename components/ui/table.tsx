import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "./typography";

/**
 * Data-presentation primitives.
 *
 * Tables are a first-class surface here, not an afterthought: a sourcing
 * manager compares listings in columns. Wrapper handles overflow so a wide
 * specification table scrolls inside itself instead of breaking the page.
 */

export function TableFrame({
  caption,
  className,
  children,
}: {
  /** Visually hidden by default - screen readers still get the summary. */
  caption?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-md border border-rule-2 bg-paper-raised",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function Th({
  className,
  children,
  scope = "col",
  ...rest
}: {
  className?: string;
  children: ReactNode;
  scope?: "col" | "row";
  colSpan?: number;
}) {
  return (
    <th
      scope={scope}
      className={cn(
        "border-b border-rule-2 bg-paper-sunk px-3 py-2.5",
        "font-mono text-label font-medium uppercase text-ink-3",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  className,
  children,
  numeric,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  /** Right-aligns and applies tabular figures for column-wise comparison. */
  numeric?: boolean;
  colSpan?: number;
}) {
  return (
    <td
      className={cn(
        "border-b border-rule px-3 py-2.5 text-sm text-ink-2",
        numeric && "text-right font-mono tabular-nums text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export type SpecRow = {
  label: string;
  value: ReactNode;
  /** Marks a value the buyer should verify with the supplier before ordering. */
  note?: string;
};

/**
 * The specification block that appears on every listing, in a fixed field
 * order so two listings read the same way top to bottom. `columns` controls
 * density: 1 on mobile, 2-3 where there is room.
 */
export function SpecGrid({
  rows,
  columns = 2,
  className,
}: {
  rows: SpecRow[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid border-t border-l border-rule",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-r border-b border-rule px-3 py-2.5"
        >
          <dt>
            <Label>{row.label}</Label>
          </dt>
          <dd className="mt-1.5 text-sm text-ink">
            {row.value}
            {row.note ? (
              <span className="mt-0.5 block text-xs text-ink-3">
                {row.note}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A compact inline spec strip for cards and list rows - the four or five
 * values a buyer scans before deciding to open a listing at all.
 */
export function SpecStrip({
  items,
  className,
}: {
  items: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt>
            <Label>{item.label}</Label>
          </dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
