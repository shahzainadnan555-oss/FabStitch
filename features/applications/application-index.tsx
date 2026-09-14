import Link from "next/link";
import type { Application, ApplicationGroup } from "@/domain/types";
import { getFabric } from "@/domain/taxonomy/fabrics";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/typography";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * "Browse by what you're making".
 *
 * Two densities of the same idea. `ApplicationTileRow` is the homepage entry
 * row - the head of demand, ordered by commercial value. `ApplicationIndex` is
 * the full ruled index, built to stay readable at ninety-odd applications
 * where a card grid would not.
 *
 * Neither is a card grid on purpose: a catalogue index communicates breadth
 * and lets a buyer scan, which is what this section is for.
 */

export function ApplicationTile({
  application,
  compact,
  className,
}: {
  application: Application;
  /**
   * Hero density: name plus one line of orientation. The full tile carries a
   * GSM band as well, which is useful further down the page but adds a second
   * thing to read in the first viewport.
   */
  compact?: boolean;
  className?: string;
}) {
  const fabrics = application.typicalFabrics
    .slice(0, 2)
    .map((slug) => getFabric(slug)?.name)
    .filter(Boolean);

  if (compact) {
    return (
      <Link
        href={`/applications/${application.slug}/`}
        className={cn(
          "group flex items-center justify-between gap-2 border-r border-b border-rule bg-paper px-3.5 py-3",
          "transition-colors duration-150 hover:bg-paper-raised",
          className,
        )}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink group-hover:text-indigo">
            {application.name}
          </span>
          {fabrics.length ? (
            <span className="mt-0.5 block truncate text-xs text-ink-3">
              {fabrics.join(" · ")}
            </span>
          ) : null}
        </span>
        <IconArrowRight
          width={13}
          height={13}
          className="shrink-0 text-ink-4 transition-colors group-hover:text-indigo"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/applications/${application.slug}/`}
      className={cn(
        "group flex flex-col justify-between gap-6 border-r border-b border-rule bg-paper p-4",
        "transition-colors duration-150 hover:bg-paper-raised",
        className,
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-body font-medium text-ink group-hover:text-indigo">
          {application.name}
        </span>
        <IconArrowRight
          width={14}
          height={14}
          className="mt-1 text-ink-4 transition-colors group-hover:text-indigo"
        />
      </span>

      <span className="block">
        {application.gsmRange ? (
          <span className="block font-mono text-label tracking-[0.09em] uppercase text-ink-3">
            {application.gsmRange[0]}-{application.gsmRange[1]} GSM
          </span>
        ) : null}
        {fabrics.length ? (
          <span className="mt-1 block truncate text-xs text-ink-3">
            {fabrics.join(" · ")}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function ApplicationTileRow({
  applications,
  compact,
  className,
}: {
  applications: Application[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 border-t border-l border-rule sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {applications.map((application) => (
        <ApplicationTile
          key={application.slug}
          application={application}
          compact={compact}
        />
      ))}
    </div>
  );
}

/**
 * The full index. One row per group: group name on the left, its applications
 * as inline links, the fabrics they need as trailing metadata - so a buyer who
 * does not know the vocabulary still sees the translation happening.
 */
export function ApplicationIndex({
  groups,
  className,
}: {
  groups: ApplicationGroup[];
  className?: string;
}) {
  return (
    <div className={cn("border-t border-rule", className)}>
      {groups.map((group) => (
        <div
          key={group.slug}
          className="grid gap-x-8 gap-y-3 border-b border-rule py-5 lg:grid-cols-[minmax(0,14rem)_1fr]"
        >
          <h3>
            <Link
              href={`/applications/${group.slug}/`}
              className="group inline-flex items-baseline gap-1.5"
            >
              <Label tone="ink" className="group-hover:text-indigo">
                {group.name}
              </Label>
            </Link>
          </h3>

          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {group.applications.map((application) => (
              <li key={application.slug}>
                <Link
                  href={`/applications/${application.slug}/`}
                  className="text-sm text-ink-2 underline-offset-4 transition-colors hover:text-indigo hover:underline"
                >
                  {application.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
