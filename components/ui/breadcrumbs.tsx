import Link from "next/link";
import { cn } from "@/lib/cn";
import { absolute } from "@/lib/seo";
import { IconChevronRight } from "./icon";

/**
 * Breadcrumbs.
 *
 * Answers "where am I?" - the first of the four questions every page in this
 * marketplace has to answer. Also emits `BreadcrumbList` structured data,
 * which the research requires on every hierarchical page.
 */

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absolute(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <script
        type="application/ld+json"
        // Serialised server-side from our own taxonomy - no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {item.href && !last ? (
                <Link
                  href={item.href}
                  prefetch={false}
                  className="font-mono text-label uppercase tracking-[0.09em] text-ink-3 transition-colors hover:text-indigo"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="font-mono text-label uppercase tracking-[0.09em] text-ink"
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <IconChevronRight
                  width={11}
                  height={11}
                  className="text-ink-4"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
