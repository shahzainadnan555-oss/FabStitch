import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "./typography";

/**
 * Structural primitives.
 *
 * FabStitch builds structure from rules and a shared gutter rather than from
 * floating cards - see docs/DECISIONS.md R6. `Container` fixes the measure,
 * `Band` fixes the vertical rhythm, `SectionHeader` fixes how every section
 * announces itself.
 */

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
}: {
  as?: ElementType;
  size?: "default" | "wide";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "fs-gutter mx-auto w-full",
        size === "default" ? "max-w-[1280px]" : "max-w-[1440px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A full-width horizontal band. `tone` swaps the surface; the top rule is what
 * separates one band from the next. Bands never carry elevation: only cards do.
 */
export function Band({
  as: Tag = "section",
  tone = "paper",
  divide = true,
  density = "default",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  tone?: "paper" | "sunk" | "ink";
  divide?: boolean;
  density?: "tight" | "default" | "loose";
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}) {
  return (
    <Tag
      className={cn(
        tone === "paper" && "bg-paper text-ink",
        tone === "sunk" && "bg-paper-sunk text-ink",
        tone === "ink" && "bg-ink-surface text-on-ink",
        divide &&
          (tone === "ink"
            ? "border-t border-rule-on-ink"
            : "border-t border-rule"),
        density === "tight" && "py-10 sm:py-12",
        density === "default" && "py-14 sm:py-18 lg:py-22",
        density === "loose" && "py-18 sm:py-24 lg:py-28",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * The standard section opener: a mono eyebrow above a heading, with an
 * optional trailing action on the same baseline.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  headingId,
  tone = "paper",
  className,
}: {
  /**
   * Rationed deliberately: at most one per three sections on a page. A label
   * above every heading produces the templated rhythm that reads as
   * AI-generated, and the section's position on the page already categorises
   * it. Default to omitting this.
   */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  headingId?: string;
  tone?: "paper" | "ink";
  className?: string;
}) {
  return (
    <header className={cn("mb-8 sm:mb-10", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[52ch]">
          {eyebrow ? (
            <Label tone={tone === "ink" ? "on-ink" : "indigo"}>{eyebrow}</Label>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "text-h2 font-semibold text-balance",
              eyebrow && "mt-3",
              tone === "ink" && "text-on-ink",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "mt-3 text-body text-pretty",
                tone === "ink" ? "text-on-ink-2" : "text-ink-3",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

/**
 * A bordered surface. The border does the definition, the tinted shadow only
 * does the separation, so a panel still reads as a framed region on a sheet
 * rather than a floating tile (docs/DECISIONS.md R11).
 */
export function Panel({
  as: Tag = "div",
  tone = "raised",
  className,
  children,
}: {
  as?: ElementType;
  tone?: "raised" | "paper" | "sunk" | "ink";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "fs-card rounded-md border",
        tone === "raised" && "border-rule-2 bg-paper-raised",
        tone === "paper" && "border-rule-2 bg-paper",
        tone === "sunk" && "border-rule-2 bg-paper-sunk",
        tone === "ink" && "border-rule-on-ink bg-ink-surface text-on-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
