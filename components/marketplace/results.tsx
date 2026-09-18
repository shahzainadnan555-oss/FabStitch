import Link from "next/link";
import type { FabricListing } from "@/domain/types";
import {
  toBuyerFabricListings,
  type BuyerFabricListing,
} from "@/features/discovery/buyer-view";
import { cn } from "@/lib/cn";
import { FabricCard } from "./fabric-card";
import { FabricMedia } from "./fabric-media";
import { formatGsm, formatLeadTime, formatPriceBand } from "@/lib/units";

import { CompareToggle } from "./compare";
import { CatalogTransitionLink } from "./catalog-navigation";
import { EmptyState } from "@/components/ui/state";
import { ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@/components/ui/icon";

/**
 * Result surfaces shared by every discovery page.
 *
 * `ListingGrid` is the only place listings are laid out, so card spacing,
 * comparison affordances and the illustrative-data notice stay identical
 * across fabric categories, applications, buyer pages, supplier profiles and
 * search.
 */

/**
 * States plainly that the records below are not live inventory.
 *
 * Required by docs/DECISIONS.md R7. Rendered wherever fixture-backed records
 * appear - a buyer must never mistake an example for stock they can order.
 */
export function FixtureNotice({ className }: { className?: string }) {
  void className;
  return null;
}

export function ListingGrid({
  listings,
  view = "grid",
  className,
  heading,
}: {
  listings: FabricListing[];
  /** Table view exists because comparing twenty MOQs down a column beats
   *  comparing twenty cards. Both read the same records. */
  view?: "grid" | "table";
  className?: string;
  /**
   * Names the results region for assistive technology.
   *
   * Each card titles itself with an `h3`, so without a region heading the
   * outline jumped straight from the page `h1` to `h3` and a screen-reader
   * user navigating by heading lost the level that says "these are the
   * listings". Visually hidden - the heading is already obvious on screen from
   * the layout and the result count.
   */
  heading?: string;
}) {
  const buyerListings = toBuyerFabricListings(listings);
  const regionHeading = <h2 className="sr-only">{heading ?? "Listings"}</h2>;

  if (view === "table") {
    return (
      <>
        {regionHeading}
        <ListingTable
          listings={buyerListings}
          className={cn("hidden lg:block", className)}
        />
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden",
            className,
          )}
        >
          {buyerListings.map((listing) => (
            <FabricCard
              key={listing.id}
              listing={listing}
              action={<CompareToggle id={listing.slug} label={listing.name} />}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {regionHeading}
      {buyerListings.map((listing) => (
        <FabricCard
          key={listing.id}
          listing={listing}
          action={<CompareToggle id={listing.slug} label={listing.name} />}
        />
      ))}
    </div>
  );
}

/** Column widths for the fixed-layout comparison table, in order. */
const COLUMN_WIDTHS = [
  "auto",
  "6.5rem",
  "5.25rem",
  "8rem",
  "6rem",
  "9.5rem",
  "6rem",
];

const TABLE_COLUMNS = [
  "Fabric",
  "Weight",
  "Width",
  "MOQ",
  "Lead time",
  "Price",
  "",
];

/**
 * Comparison table.
 *
 * Same records, aligned in columns so a sourcing manager can scan one
 * attribute down twenty rows. Numerics stay mono and tabular, which is the
 * entire reason this view is worth having.
 */
function ListingTable({
  listings,
  className,
}: {
  listings: BuyerFabricListing[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fs-card overflow-x-auto rounded-md border border-rule-2 bg-paper-raised",
        className,
      )}
    >
      {/* Fixed layout with no minimum width.
          Auto layout lets the table's intrinsic width escape its scroll
          container and scroll the whole page sideways (measured: 244px at
          1280). Fixed layout also keeps columns aligned from one page of
          results to the next, which is the point of this view. Long values
          truncate with a title rather than forcing a column open. */}
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Matching fabric listings</caption>
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {TABLE_COLUMNS.map((column, index) => (
              <th
                key={column || `action-${index}`}
                scope="col"
                className="border-b border-rule-2 bg-paper-sunk px-3 py-2.5 font-mono text-label uppercase tracking-[0.09em] text-ink-3 whitespace-nowrap"
              >
                {column || <span className="sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-paper-sunk">
              <th
                scope="row"
                className="border-b border-rule px-3 py-2.5 font-normal"
              >
                <span className="flex items-center gap-2.5">
                  <FabricMedia
                    listing={listing}
                    showLabel={false}
                    aspect="1/1"
                    className="w-9 shrink-0 rounded-xs"
                  />
                  <span className="min-w-0">
                    <Link
                      href="/marketplace/"
                      className="block max-w-[22ch] truncate text-sm font-medium text-ink hover:text-indigo"
                    >
                      {listing.name}
                    </Link>
                    <span className="mt-0.5 block text-xs text-ink-3">
                      {listing.countryOfOrigin || "Origin on request"}
                    </span>
                  </span>
                </span>
              </th>
              <td className="border-b border-rule px-3 py-2.5 font-mono text-sm tabular-nums text-ink whitespace-nowrap">
                {listing.gsm ? formatGsm(listing.gsm) : "-"}
              </td>
              <td className="border-b border-rule px-3 py-2.5 font-mono text-sm tabular-nums text-ink-2 whitespace-nowrap">
                {listing.width
                  ? `${Math.round(listing.width.value)}${listing.width.unit === "cm" ? " cm" : "\u2033"}`
                  : "-"}
              </td>
              <td className="border-b border-rule px-3 py-2.5 font-mono text-sm tabular-nums text-ink whitespace-nowrap">
                {listing.moq.value.toLocaleString("en")} {listing.moq.unit}
                {listing.moq.perColour ? (
                  <span className="block text-xs text-ink-4">per colour</span>
                ) : null}
              </td>
              <td className="border-b border-rule px-3 py-2.5 font-mono text-sm tabular-nums text-ink-2 whitespace-nowrap">
                {formatLeadTime(listing.leadTimeDays)}
              </td>
              <td className="border-b border-rule px-3 py-2.5 font-mono text-sm tabular-nums font-medium text-ink whitespace-nowrap">
                {formatPriceBand(listing.price)}
              </td>
              <td className="border-b border-rule px-3 py-2.5">
                <CompareToggle id={listing.slug} label={listing.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Zero-result state.
 *
 * The research is explicit that search must never dead-end: relax the least
 * critical constraint, say so, and always offer to post the requirement to
 * suppliers instead.
 */
/**
 * The empty result.
 *
 * Two distinct situations, one component. A *filtered* search returning
 * nothing means "loosen a constraint"; a valid taxonomy page with no supply
 * behind it means "nothing here yet, here is where to go instead". The second
 * is not a failure - a category with zero listings is a real sourcing gap, and
 * saying so plainly beats an apologetic search message that does not apply.
 *
 * `actions` is the navigation an empty page owes the reader: without it the
 * page is a dead end, which is the one thing the brief forbids.
 */
export function NoResults({
  suggestions,
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  /** Concrete alternatives, e.g. "8 listings at 190 GSM". */
  suggestions?: { label: string; href: string }[];
  title?: string;
  description?: string;
  eyebrow?: string;
  /** Where to go from here. Rendered alongside the RFQ call to action. */
  actions?: { label: string; href: string }[];
  className?: string;
}) {
  const onward = actions ?? suggestions;
  return (
    <EmptyState
      className={className}
      eyebrow={eyebrow ?? "No matches"}
      title={title ?? "Nothing matches every constraint yet."}
      description={
        description ??
        "Loosen the tightest filter - usually weight, construction or MOQ - or describe the requirement and let FabStitch source it."
      }
      alternatives={
        onward?.length ? (
          <div className="rounded-sm border border-rule-2 bg-paper-raised p-3">
            <Label>{actions ? "Where to next" : "Try instead"}</Label>
            <ul className="mt-2 space-y-1.5">
              {onward.map((suggestion) => (
                <li key={suggestion.href}>
                  <Link
                    href={suggestion.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo hover:underline"
                  >
                    {suggestion.label}
                    <IconArrowRight width={12} height={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : undefined
      }
      action={
        <ButtonLink
          href="/marketplace/"
          variant="primary"
          trailing={<IconArrowRight width={14} height={14} />}
        >
          Clear filters
        </ButtonLink>
      }
    />
  );
}

/** Crawlable pagination - every page needs a real `<a href>`. */
export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (key === "page" || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const window = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-5"
    >
      <span className="font-mono text-label uppercase tracking-[0.09em] text-ink-3">
        Page {page} of {pages}
      </span>
      <ul className="flex items-center gap-1">
        {page > 1 ? (
          <li>
            <Link href={href(page - 1)} className={pageLink(false)} rel="prev">
              Previous
            </Link>
          </li>
        ) : null}
        {window.map((n, index) => (
          <li key={n} className="flex items-center gap-1">
            {index > 0 && n - window[index - 1] > 1 ? (
              <span aria-hidden="true" className="px-1 text-ink-4">
                …
              </span>
            ) : null}
            <Link
              href={href(n)}
              aria-current={n === page ? "page" : undefined}
              className={pageLink(n === page)}
            >
              {n}
            </Link>
          </li>
        ))}
        {page < pages ? (
          <li>
            <Link href={href(page + 1)} className={pageLink(false)} rel="next">
              Next
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

function pageLink(active: boolean): string {
  return cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 font-mono text-xs tabular-nums transition-colors",
    active
      ? "border-indigo bg-indigo text-white"
      : "border-border bg-transparent text-ink-2 hover:border-ink-3 hover:bg-paper-raised hover:text-ink",
  );
}

export function CatalogCursorPagination({
  nextCursor,
  hasMore,
  currentCursor,
  pageSize,
  basePath,
  searchParams,
  pageSizes = [12, 24, 48],
  defaultPageSize,
}: {
  nextCursor: string | null;
  hasMore: boolean;
  currentCursor?: string;
  pageSize: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
  pageSizes?: number[];
  defaultPageSize?: number;
}) {
  const omittedPageSize = defaultPageSize ?? pageSizes[0];
  const href = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value))
        value.forEach((item) => params.append(key, item));
      else params.set(key, value);
    }
    params.delete("page");
    for (const [key, value] of Object.entries(patch)) {
      params.delete(key);
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  if (!currentCursor && !hasMore && pageSizes.length <= 1) return null;

  const pageLink =
    "inline-flex h-10 items-center gap-1.5 rounded-sm px-1.5 text-sm tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";
  const sizeLink =
    "grid h-9 min-w-9 place-items-center rounded-sm px-2 font-mono text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {currentCursor || hasMore ? (
        <nav
          aria-label="Catalog pages"
          className="flex items-center justify-center gap-7 sm:justify-start"
        >
          {currentCursor ? (
            <CatalogTransitionLink
              href={href({ cursor: null })}
              rel="prev"
              className={cn(pageLink, "text-ink-2 hover:text-ink")}
            >
              <span aria-hidden="true">‹</span>
              Previous
            </CatalogTransitionLink>
          ) : (
            <span className={cn(pageLink, "cursor-default text-ink-4")}>
              <span aria-hidden="true">‹</span>
              Previous
            </span>
          )}
          {hasMore && nextCursor ? (
            <CatalogTransitionLink
              href={href({ cursor: nextCursor })}
              rel="next"
              className={cn(pageLink, "text-ink hover:text-indigo")}
            >
              Next
              <span aria-hidden="true">›</span>
            </CatalogTransitionLink>
          ) : (
            <span className={cn(pageLink, "cursor-default text-ink-4")}>
              Next
              <span aria-hidden="true">›</span>
              <span className="sr-only">End of results</span>
            </span>
          )}
        </nav>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div
        role="group"
        aria-label="Results per page"
        className="flex items-center justify-center gap-3.5 sm:justify-end"
      >
        <span className="font-mono text-label tracking-[0.14em] text-ink-4 uppercase">
          Show
        </span>
        <div className="flex items-center gap-1">
          {pageSizes
            .filter((size) => size <= 48)
            .map((size) => (
              <CatalogTransitionLink
                key={size}
                href={href({
                  cursor: null,
                  page_size: size === omittedPageSize ? null : String(size),
                })}
                ariaCurrent={size === pageSize ? "true" : undefined}
                ariaLabel={`Show ${size} results`}
                className={cn(
                  sizeLink,
                  size === pageSize
                    ? "bg-paper-sunk font-medium text-ink"
                    : "text-ink-3 hover:text-ink",
                )}
              >
                {size}
              </CatalogTransitionLink>
            ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Catalogue pagination.
 *
 * The reference mockups put a numbered pill group under the grid with a
 * page-size control beside it. Distinct from `Pagination` above, which is the
 * marketplace's SEO-facing form: that one states "Page 2 of 9" for a crawler
 * and keeps prev/next `rel` hints, this one is a browse control.
 */
export function CatalogPagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
  pageSizes = [12, 24, 48],
  defaultPageSize,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
  pageSizes?: number[];
  defaultPageSize?: number;
}) {
  const omittedPageSize = defaultPageSize ?? pageSizes[0];
  const pages = Math.ceil(total / pageSize);

  const href = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else params.set(key, value);
    }
    for (const [key, value] of Object.entries(patch)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  // First, last and the immediate neighbours. Everything else collapses.
  const window = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );

  const step =
    "grid h-8 min-w-8 place-items-center rounded-md px-2 font-mono text-sm tabular-nums transition-colors";

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
      {pages > 1 ? (
        <nav
          aria-label="Pagination"
          className="flex items-center gap-1 rounded-lg border border-rule-2 bg-paper-raised p-1"
        >
          {page > 1 ? (
            <Link
              href={href({ page: page - 1 === 1 ? null : String(page - 1) })}
              rel="prev"
              className={cn(step, "text-ink-2 hover:bg-paper-sunk")}
            >
              <span className="sr-only">Previous page</span>
              <IconChevronLeft width={14} height={14} />
            </Link>
          ) : (
            <span className={cn(step, "text-ink-4")} aria-hidden="true">
              <IconChevronLeft width={14} height={14} />
            </span>
          )}

          {window.map((n, index) => (
            <span key={n} className="flex items-center gap-1">
              {index > 0 && n - window[index - 1] > 1 ? (
                <span aria-hidden="true" className="px-1 text-ink-4">
                  …
                </span>
              ) : null}
              <Link
                href={href({ page: n === 1 ? null : String(n) })}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  step,
                  n === page
                    ? "bg-indigo font-medium text-white"
                    : "text-ink-2 hover:bg-paper-sunk",
                )}
              >
                {n}
              </Link>
            </span>
          ))}

          {page < pages ? (
            <Link
              href={href({ page: String(page + 1) })}
              rel="next"
              className={cn(step, "text-ink-2 hover:bg-paper-sunk")}
            >
              <span className="sr-only">Next page</span>
              <IconChevronRight width={14} height={14} />
            </Link>
          ) : (
            <span className={cn(step, "text-ink-4")} aria-hidden="true">
              <IconChevronRight width={14} height={14} />
            </span>
          )}
        </nav>
      ) : null}

      {/* Page size. Real links, so it works without JavaScript. */}
      <div className="flex items-center gap-1 rounded-lg border border-rule-2 bg-paper-raised p-1">
        <span className="px-2 font-mono text-label uppercase text-ink-3">
          Show
        </span>
        {pageSizes.map((size) => (
          <Link
            key={size}
            href={href({
              page: null,
              page_size: size === omittedPageSize ? null : String(size),
            })}
            aria-current={size === pageSize ? "true" : undefined}
            className={cn(
              step,
              size === pageSize
                ? "bg-paper-sunk font-medium text-ink"
                : "text-ink-3 hover:bg-paper-sunk hover:text-ink",
            )}
          >
            {size}
          </Link>
        ))}
      </div>
    </div>
  );
}
