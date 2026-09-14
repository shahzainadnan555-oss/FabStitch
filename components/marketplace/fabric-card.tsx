import type { ReactNode } from "react";
import Link from "next/link";
import type { BuyerFabricListing } from "@/features/discovery/buyer-view";
import type { CustomerCatalogFabric } from "@/repositories/customer-catalog";
import { formatCatalogMeasurement } from "@/lib/customer-catalog-presentation";
import { cn } from "@/lib/cn";
import {
  formatGsm,
  formatGsmAsOz,
  formatLeadTime,
  formatMoq,
  formatPriceBand,
  formatWidth,
  QUANTITY_UNIT_LABEL,
} from "@/lib/units";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/typography";
import { FabricMedia } from "./fabric-media";
import { CompareToggle } from "./compare";
import { GatedAction } from "@/features/auth/gated-action";
import { IconArrowRight, IconHeart } from "@/components/ui/icon";

/**
 * The fabric listing card.
 *
 * Built so a buyer can shortlist without opening the listing: composition,
 * weight, width, MOQ, price band, lead time and origin are all
 * on the face of it, in the same fixed order on every card so a column of
 * cards reads down as well as across (docs/ARCHITECTURE.md §8).
 *
 * Every numeric is mono and tabular for exactly that reason.
 */

const STOCK_LABEL: Record<BuyerFabricListing["stockStatus"], string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  made_to_order: "Made to order",
  out_of_stock: "Out of stock",
};

const STOCK_TONE = {
  in_stock: "verified",
  low_stock: "caution",
  made_to_order: "neutral",
  out_of_stock: "alert",
} as const;

export function FabricCard({
  listing,
  action,
  className,
}: {
  listing: BuyerFabricListing;
  /** Interactive control (e.g. compare toggle). Sits above the stretched link. */
  action?: ReactNode;
  className?: string;
}) {
  const href = `/listings/${listing.slug}/`;

  return (
    <article
      data-catalog-card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-rule-2 bg-paper-raised",
        "fs-card fs-card-interactive focus-within:border-indigo hover:border-indigo",
        className,
      )}
    >
      {/* Supplier photography when it exists, the construction drawn when it
          does not. Same slot, same aspect, so the grid never goes ragged. */}
      <FabricMedia
        listing={listing}
        showLabel={false}
        className="border-b border-rule-2"
      />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-h3 font-semibold text-balance">
            {/* Stretched link: the whole card is the target, but only the
 title is in the tab order. */}
            <Link href={href} className="after:absolute after:inset-0">
              {listing.name}
            </Link>
          </h3>
          {listing.isSpecimen ? (
            <Badge tone="caution">Illustrative</Badge>
          ) : (
            <Badge tone={STOCK_TONE[listing.stockStatus]}>
              {STOCK_LABEL[listing.stockStatus]}
            </Badge>
          )}
        </div>

        <p className="mt-2 text-sm text-ink-3">{listing.composition}</p>

        {/* The four values that decide whether this is worth opening. */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-rule pt-4">
          <div>
            <dt>
              <Label>Weight</Label>
            </dt>
            <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
              {listing.gsm ? formatGsm(listing.gsm) : "-"}
              {listing.gsm ? (
                <span className="mt-0.5 block text-xs font-normal text-ink-4">
                  {formatGsmAsOz(listing.gsm)}
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt>
              <Label>Width</Label>
            </dt>
            <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
              {listing.width ? formatWidth(listing.width) : "-"}
            </dd>
          </div>
          <div>
            <dt>
              <Label>MOQ</Label>
            </dt>
            <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
              {formatMoq(listing.moq)}
            </dd>
          </div>
          <div>
            <dt>
              <Label>Lead time</Label>
            </dt>
            <dd className="mt-1 font-mono text-sm tabular-nums text-ink">
              {formatLeadTime(listing.leadTimeDays)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-rule pt-4">
          {listing.sample.available ? (
            <Badge tone="neutral">
              {listing.sample.swatchFree ? "Free swatch" : "Sample available"}
            </Badge>
          ) : null}
          {action ? <span className="ml-auto">{action}</span> : null}
        </div>

        {/* Origin and price sit last: the commercial close. */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-rule pt-4">
          <div className="min-w-0">
            <Label>Origin</Label>
            <p className="mt-1 font-mono text-sm text-ink">
              {listing.countryOfOrigin || "On request"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {/* The one number a sourcing decision turns on, so it is the one
                that carries the warm half of the brand. Gold on the label, not
                the figure: #b88840 is a 3:1 colour, fine for a 11px mono
                caption and not for the value itself. */}
            <Label tone="gold">Price</Label>
            <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-ink">
              {formatPriceBand(listing.price)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Catalogue card.
 *
 * The browse-grid form: wide media, name, composition, a compact spec row, the
 * supplier, then the commercial line. It carries less than `FabricCard` on
 * purpose - this is the density a buyer scans four-across, and the full spec
 * sheet is one click away.
 *
 * It used to render weight, width and construction as three unlabelled chips.
 * Three problems with that, all of them named in the project rules: it is the
 * "pill soup" the design language forbids; `72"` on its own does not say
 * *width*, so the buyer has to infer which number is which; and MOQ - the one
 * figure that decides whether a listing is orderable at all, and which the
 * product rules require to be visible - was not on the card. The spec row is
 * the specification-sheet vernacular the rest of the system already uses:
 * mono micro-label above a tabular value.
 *
 * Same data shape and same media component as `FabricCard`, so the two stay in
 * step rather than drifting into two card implementations.
 */
export function CatalogCard({
  listing,
  saveHref,
  className,
}: {
  listing: BuyerFabricListing;
  /** Where the save control goes. Saving needs an account, so this is a link. */
  saveHref: string;
  className?: string;
}) {
  const href = `/listings/${listing.slug}/`;

  // Three columns, fixed order, always rendered. A missing value shows an em
  // dash rather than collapsing the column - a card whose fields move around
  // cannot be scanned down a grid, which is the whole point of it.
  //
  // Compact forms deliberately. The full `formatGsm`/`formatWidth` output
  // carries the mill tolerance and both unit systems ("180 GSM ±5%",
  // "72″ / 183 cm"), which is right on the listing page and far too wide for a
  // column roughly eighty pixels across - it truncated to "180 GSM ±…". The
  // precision is one click away; the browse card's job is to be scannable.
  //
  // "per colour" is the exception and is kept in full: a 500 kg minimum and a
  // 500 kg minimum *per colourway* are different commitments, and abbreviating
  // that would misstate the order a buyer is being asked to place.
  const specs: { label: string; value: string }[] = [
    {
      label: "Weight",
      value: listing.gsm ? `${listing.gsm.value} GSM` : "—",
    },
    {
      label: "Width",
      value: listing.width
        ? `${Math.round(listing.width.value)}${listing.width.unit === "cm" ? " cm" : "″"}`
        : "—",
    },
    {
      label: "MOQ",
      value: `${listing.moq.value.toLocaleString("en")} ${QUANTITY_UNIT_LABEL[listing.moq.unit]}${
        listing.moq.perColour ? " / colour" : ""
      }`,
    },
  ];

  return (
    <article
      className={cn(
        // `rounded-sm`, not `rounded-lg`: the design language caps radius at
        // 4px, and a softly rounded card is one of the shapes it calls out as
        // reading generic.
        "group relative flex flex-col overflow-hidden rounded-sm border border-rule-2 bg-paper-raised",
        "fs-card fs-card-interactive focus-within:border-indigo hover:border-indigo",
        className,
      )}
    >
      <FabricMedia
        listing={listing}
        showLabel={false}
        aspect="2/1"
        sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 92vw"
        className="border-b border-rule-2"
      />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Clamped to two lines and reserving both, so the spec row starts
              at the same height on every card in the row. Titles of uneven
              length were pushing the price line out of alignment across the
              grid, which is what made a row of these look unfinished. */}
          <h3 className="line-clamp-2 min-h-[2.6em] text-[0.9375rem] leading-[1.3] font-semibold text-ink">
            <Link href={href} className="after:absolute after:inset-0">
              {listing.name}
            </Link>
          </h3>
          {/* Save sits with the title, not floating on the photograph. A white
              circle over the media is the generic e-commerce treatment the
              design rules reject, and it covered the cloth it sat on. */}
          <GatedAction
            href={saveHref}
            intent="save_fabric"
            className="relative z-10 -mt-0.5 -mr-1 grid size-7 shrink-0 place-items-center rounded-xs text-ink-4 transition-colors hover:bg-indigo-soft hover:text-indigo focus-visible:text-indigo"
          >
            <span className="sr-only">Save {listing.name}</span>
            <IconHeart width={15} height={15} />
          </GatedAction>
        </div>

        <p className="mt-1 truncate text-xs text-ink-3">
          {listing.composition}
        </p>

        {/* The specification, labelled. Mono and tabular so weights and widths
            line up down a column when the grid is scanned vertically. */}
        <dl className="mt-3 grid grid-cols-3 gap-x-3 border-t border-rule pt-3">
          {specs.map((spec) => (
            <div key={spec.label} className="min-w-0">
              <dt>
                <Label>{spec.label}</Label>
              </dt>
              {/* Wraps rather than truncates: a clipped specification is
                  worse than a two-line one. */}
              <dd className="mt-1 font-mono text-xs leading-tight tabular-nums text-ink">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-rule pt-3">
          <Label>Origin</Label>
          <span className="font-mono text-xs text-ink-2">
            {listing.countryOfOrigin || "On request"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-rule pt-3">
          <div className="min-w-0">
            <Label tone="gold">Price</Label>
            <p className="mt-1 truncate font-mono text-sm font-semibold tabular-nums text-ink">
              {formatPriceBand(listing.price)}
            </p>
          </div>
          <span className="relative z-10 shrink-0">
            <CompareToggle id={listing.id} label={listing.name} />
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Card grid. Kept here so every listing surface spaces identically.
 *
 * `rule` welds the cards into one hairline grid, which suits the dense
 * `FabricCard`. `catalog` separates them, which is what the browse grid in the
 * reference mockups does and what `CatalogCard`'s own border expects.
 */
export function FabricCardGrid({
  children,
  variant = "rule",
  className,
}: {
  children: ReactNode;
  variant?: "rule" | "catalog";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 [&>*]:relative",
        variant === "rule"
          ? "gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3"
          : "gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Compact row form of the same record, for comparison and dense result views. */
export function FabricRowLink({ listing }: { listing: BuyerFabricListing }) {
  return (
    <Link
      href={`/listings/${listing.slug}/`}
      className="group flex items-center justify-between gap-4 border-b border-rule px-1 py-3 transition-colors hover:bg-paper-sunk"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">
          {listing.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-ink-3">
          {listing.composition}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-4">
        <span className="font-mono text-sm tabular-nums text-ink-2">
          {listing.gsm ? `${listing.gsm.value} GSM` : "-"}
        </span>
        <span className="font-mono text-sm tabular-nums text-ink-2">
          {formatMoq(listing.moq)}
        </span>
        <IconArrowRight className="text-ink-4 transition-colors group-hover:text-indigo" />
      </span>
    </Link>
  );
}

/**
 * The curated fabric card.
 *
 * This is the marketplace grid's unit: a kind of cloth FabStitch has published,
 * not one supplier's offer of it. The difference decides what may appear on the
 * face of it - a fabric has no single price, MOQ or lead time, because those
 * belong to whoever is offering it, so the card carries the specification and
 * the *real* supply behind it and sends the buyer to the fabric page to see who
 * can make it.
 *
 * Deliberately the same media component, spec-row grammar and border treatment
 * as `CatalogCard`, so a fabric grid and a listing grid read as the same
 * product rather than two designs that happen to share a palette.
 */
export function FabricCatalogueCard({
  fabric,
  className,
  priority,
}: {
  fabric: CustomerCatalogFabric;
  className?: string;
  priority?: boolean;
}) {
  const href = `/fabrics/${fabric.slug}/`;
  const primaryMeasurement = fabric.measurements[0];
  const gsm = fabric.measurements.find((item) => item.unit === "gsm");
  const asset = fabric.media.src
    ? { src: fabric.media.src, alt: fabric.media.alt ?? fabric.name }
    : undefined;

  const specs: { label: string; value: string }[] = [
    {
      label: "Weight",
      value: primaryMeasurement
        ? formatCatalogMeasurement(primaryMeasurement)
        : "Not stated",
    },
    {
      label: "Construction",
      value: fabric.construction[0] ?? "Not stated",
    },
    {
      label: "Season",
      value: fabric.seasons.join(" / ") || "Core",
    },
  ];

  return (
    <article
      data-fabric-id={fabric.id}
      data-fabric-slug={fabric.slug}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-rule-2 bg-paper-raised",
        "fs-card fs-card-interactive focus-within:border-indigo hover:-translate-y-1 hover:border-indigo hover:shadow-card-hover",
        className,
      )}
    >
      <FabricMedia
        listing={{
          material: fabric.composition[0] ?? fabric.family.label,
          fabricType: fabric.name,
          construction: fabric.construction[0],
          gsm: gsm ? { value: gsm.exact ?? gsm.min ?? gsm.max } : undefined,
          slug: fabric.slug,
        }}
        asset={asset}
        showLabel={false}
        aspect="4/3"
        priority={priority}
        sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 92vw"
        className="overflow-hidden border-b border-rule-2 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[var(--ease-out-quart)] group-hover:[&_img]:scale-[1.045]"
      />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-h-5 items-center justify-between gap-2">
          <p className="font-mono text-label text-gold-ink uppercase">
            {fabric.collection.label}
          </p>
          {fabric.fabstitchVerified ? (
            <Badge tone="verified">FabStitch Verified</Badge>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-[1.05rem] leading-[1.25] font-semibold tracking-[-0.015em] text-ink">
          <Link
            href={href}
            prefetch={priority ? null : false}
            className="after:absolute after:inset-0"
          >
            {fabric.name}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[2.9em] text-sm text-ink-3">
          {fabric.characteristics.slice(0, 2).join(" · ") ||
            fabric.composition.join(" / ") ||
            fabric.construction[0] ||
            fabric.family.label}
        </p>

        <dl className="mt-3 grid grid-cols-3 gap-x-3 border-t border-rule pt-3">
          {specs.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt>
                <Label>{item.label}</Label>
              </dt>
              <dd className="mt-1 font-mono text-xs leading-tight tabular-nums text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex min-h-12 flex-wrap content-start gap-1.5 border-t border-rule pt-3">
          {fabric.bestFor.slice(0, 2).map((application) => (
            <span
              key={application.slug}
              className="rounded-xs bg-indigo-wash px-2 py-1 text-xs font-medium text-indigo"
            >
              Best for {application.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-rule pt-4">
          <div className="min-w-0">
            <Label tone="ink">Family</Label>
            <p className="mt-1 line-clamp-1 text-xs font-medium text-ink">
              {fabric.family.label}
            </p>
          </div>
          <span className="relative z-10 flex shrink-0 items-center gap-2">
            <CompareToggle id={fabric.slug} label={fabric.name} />
            <span className="hidden items-center gap-1.5 text-sm font-semibold text-indigo sm:inline-flex">
              Explore
              <IconArrowRight
                width={13}
                height={13}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
