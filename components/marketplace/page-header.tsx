import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";
import { Heading, Label } from "@/components/ui/typography";

/**
 * The masthead every marketplace page opens with.
 *
 * Enforces the four questions from the quality bar in one component, so no
 * page can quietly skip one:
 *
 * Where am I? → breadcrumbs
 * Why am I here? → eyebrow + title
 * What can I do? → primary action, singular and visually dominant
 * What's here? → the `meta` strip (counts, ranges, origins)
 *
 * `intro` is capped by measure rather than by word count: category pages must
 * lead with orientation, not with 800 words of education before the inventory.
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  meta,
  action,
  secondaryAction,
  aside,
  className,
}: {
  crumbs?: Crumb[];
  /**
   * Optional, and usually omitted. An uppercase micro-label above every
   * headline is the single most templated rhythm in AI-built sites, and on a
   * page that already carries breadcrumbs it repeats what the breadcrumbs just
   * said. Use it only where there are no breadcrumbs and the page family is
   * not otherwise obvious.
   */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Short factual pairs - counts, GSM ranges, origins. Never marketing. */
  meta?: { label: string; value: ReactNode }[];
  action?: ReactNode;
  secondaryAction?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-rule bg-paper", className)}>
      <Container className="py-7 sm:py-9">
        {crumbs?.length ? (
          <Breadcrumbs items={crumbs} className="mb-5" />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            {eyebrow ? <Label tone="indigo">{eyebrow}</Label> : null}
            <Heading
              level={1}
              size="h2"
              className={cn("max-w-[24ch]", eyebrow && "mt-2.5")}
            >
              {title}
            </Heading>
            {intro ? (
              <p className="mt-3 max-w-[68ch] text-body text-ink-2 text-pretty">
                {intro}
              </p>
            ) : null}
          </div>

          {action || secondaryAction ? (
            <div className="flex flex-wrap items-center gap-2">
              {action}
              {secondaryAction}
            </div>
          ) : null}
        </div>

        {meta?.length ? (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt>
                  <Label>{item.label}</Label>
                </dt>
                <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {aside ? <div className="mt-6">{aside}</div> : null}
      </Container>
    </section>
  );
}
