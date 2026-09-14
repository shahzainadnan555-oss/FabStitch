import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Typographic primitives.
 *
 * Heading *level* and heading *size* are separate props on purpose: the
 * document outline has to stay logical for screen readers and for the
 * programmatic-SEO templates, while the visual scale follows the layout.
 * Never pick an `h`-level to get a font size.
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = "display" | "h2" | "h3";

const HEADING_SIZE: Record<HeadingSize, string> = {
  // No weight here on purpose: `--text-display--font-weight` carries it, so
  // the two display headlines cannot drift apart again.
  display: "text-display text-balance",
  h2: "text-h2 font-semibold text-balance",
  h3: "text-h3 font-semibold",
};

export function Heading({
  level,
  size,
  className,
  children,
  id,
}: {
  level: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const Tag = `h${level}` as ElementType;
  const resolved: HeadingSize =
    size ?? (level === 1 ? "display" : level === 2 ? "h2" : "h3");

  return (
    <Tag id={id} className={cn(HEADING_SIZE[resolved], className)}>
      {children}
    </Tag>
  );
}

/**
 * Uppercase mono micro-label - the spec-sheet vernacular used for every field
 * name, section eyebrow and table header across FabStitch.
 */
export function Label({
  as: Tag = "span",
  tone = "muted",
  className,
  children,
}: {
  as?: ElementType;
  tone?: "muted" | "ink" | "indigo" | "gold" | "on-ink";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "font-mono text-label font-medium uppercase",
        tone === "muted" && "text-ink-3",
        tone === "ink" && "text-ink",
        tone === "indigo" && "text-indigo",
        // The warm half of the brand, for the label on a commercial figure.
        // `gold-ink` rather than `gold`: the logo colour is a 3:1 value, which
        // is a rule or a mark, never type.
        tone === "gold" && "text-gold-ink",
        tone === "on-ink" && "text-on-ink-2",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lead({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-lead text-ink-2 text-pretty", className)}>
      {children}
    </p>
  );
}

export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("max-w-[68ch] text-body text-ink-2 text-pretty", className)}
    >
      {children}
    </div>
  );
}

/**
 * A numeric value. Always mono, always tabular - so two listings compare
 * digit-against-digit down a column.
 */
export function Numeric({
  value,
  unit,
  className,
}: {
  value: ReactNode;
  unit?: string;
  className?: string;
}) {
  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {value}
      {unit ? <span className="ml-1 text-ink-3">{unit}</span> : null}
    </span>
  );
}
