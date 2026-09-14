import Link from "next/link";
import { cn } from "@/lib/cn";
import type { RelatedLink } from "@/domain/taxonomy/relations";
import { Label } from "@/components/ui/typography";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * Related entities.
 *
 * Every marketplace page ends by pointing at the things next to it in the
 * graph. The links come from `domain/taxonomy/relations.ts`, never from the
 * page - a template that hand-writes its own related links goes stale the
 * moment the taxonomy changes, and no two pages end up agreeing.
 *
 * Two densities. `rule` is the default: a ruled index, which is how a trade
 * catalogue lists things and which stays readable at twenty items. `chip` is
 * for short sets where the label is the whole content - certifications,
 * origins - and a full row each would be wasteful.
 */
export function RelatedLinks({
  title,
  links,
  variant = "rule",
  columns = 2,
  className,
}: {
  title: string;
  links: RelatedLink[];
  variant?: "rule" | "chip";
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const eligibleLinks = links;
  if (!eligibleLinks.length) return null;

  return (
    <section className={cn(className)}>
      <Label>{title}</Label>

      {variant === "chip" ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {eligibleLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-baseline gap-1.5 rounded-sm border border-rule-2 bg-paper-raised px-2.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-indigo hover:text-indigo"
              >
                {link.label}
                {link.hint ? (
                  <span className="font-mono text-xs tabular-nums text-ink-4">
                    {link.hint}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={cn(
            "mt-2.5 grid border-t border-rule-2",
            columns === 3
              ? "sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
              : columns === 2
                ? "sm:grid-cols-2 sm:gap-x-8"
                : "",
          )}
        >
          {eligibleLinks.map((link) => (
            <li key={link.href} className="border-b border-rule-2">
              <Link href={link.href} className="group block py-3">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-ink group-hover:text-indigo">
                    {link.label}
                  </span>
                  <IconArrowRight
                    width={13}
                    height={13}
                    className="shrink-0 text-ink-4 transition-colors group-hover:text-indigo"
                  />
                </span>
                {link.hint ? (
                  <span className="mt-0.5 block text-xs text-ink-3 text-pretty">
                    {link.hint}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * The block that closes a marketplace page.
 *
 * Groups several relation sets under one rule so the page ends with a clear
 * "where next" rather than four competing sections.
 */
export function RelatedPanel({
  groups,
  className,
}: {
  groups: {
    title: string;
    links: RelatedLink[];
    variant?: "rule" | "chip";
  }[];
  className?: string;
}) {
  const populated = groups
    .map((group) => ({
      ...group,
      links: group.links,
    }))
    .filter((group) => group.links.length > 0);
  if (!populated.length) return null;

  return (
    <div className={cn("border-t border-rule pt-8", className)}>
      <div
        className={cn(
          "grid gap-x-10 gap-y-8",
          populated.length > 1 ? "lg:grid-cols-2" : "",
        )}
      >
        {populated.map((group) => (
          <RelatedLinks
            key={group.title}
            title={group.title}
            links={group.links}
            variant={group.variant}
            columns={1}
          />
        ))}
      </div>
    </div>
  );
}
