import type { FabricListing } from "@/domain/types";
import { cn } from "@/lib/cn";
import { Swatch } from "./swatch";
import { Label } from "@/components/ui/typography";
import { IconSwatch } from "@/components/ui/icon";
import { ResilientFabricImage } from "./resilient-fabric-image";

/**
 * Fabric media.
 *
 * One slot, two sources. When a supplier has uploaded photography the image
 * renders; when they have not, a swatch rendered from the listing's own colour
 * and construction does (see swatch.tsx). Both are the
 * same shape and the same aspect ratio, so a results grid never goes ragged
 * as inventory fills in.
 *
 * FabStitch does not fabricate photography of a specific mill's cloth, so the
 * diagram is the honest default rather than a grey placeholder. It is also
 * genuinely useful: a buyer scanning a grid can tell a jersey from a twill.
 *
 * Server component on purpose. Only the gallery needs state, and it lives in
 * fabric-gallery.tsx so a results page of 9 cards ships no JavaScript for
 * media.
 */

export type MediaAsset = {
  src: string;
  alt: string;
  /** What this frame shows. Drives the thumbnail caption. */
  kind?: "flat" | "drape" | "macro" | "application";
};

/**
 * What the media component needs to draw something.
 *
 * Deliberately looser than `FabricListing`. Everything downstream lowercases
 * `material` and `construction` and compares them as free text, and the only
 * use of `fabricType` is one equality check - so requiring the domain enums
 * bought no safety and shut out the curated fabric record, whose specification
 * arrives from the API as plain strings. A listing still satisfies this, so no
 * existing caller changes.
 */
export type MediaSubject = {
  material?: FabricListing["material"] | string | null;
  fabricType?: FabricListing["fabricType"] | string | null;
  construction?: string | null;
  gsm?: { value?: number | null } | null;
  swatchColor?: string | null;
  slug?: string | null;
};

const ASPECT = {
  "4/3": "aspect-4/3",
  "16/7": "aspect-[16/7]",
  "1/1": "aspect-square",
  "3/2": "aspect-3/2",
  /** Browse-grid media, per the reference mockups. */
  "2/1": "aspect-2/1",
} as const;

export function MediaCaption({ listing }: { listing: MediaSubject }) {
  return (
    <span className="flex items-center gap-1.5">
      <IconSwatch width={12} height={12} className="text-ink-4" />
      <Label>
        {listing.construction
          ? `${listing.material} / ${listing.construction}`
          : listing.material}
      </Label>
    </span>
  );
}

export function FabricMedia({
  listing,
  asset,
  aspect = "4/3",
  className,
  showLabel = true,
  priority,
  sizes = "(min-width: 1280px) 26rem, (min-width: 640px) 45vw, 92vw",
}: {
  listing: MediaSubject;
  asset?: MediaAsset;
  aspect?: keyof typeof ASPECT;
  className?: string;
  showLabel?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const caption = showLabel ? <MediaCaption listing={listing} /> : undefined;

  if (asset) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-paper-sunk",
          ASPECT[aspect],
          className,
        )}
      >
        <ResilientFabricImage
          src={asset.src}
          alt={asset.alt}
          priority={priority}
          sizes={sizes}
          className="object-cover"
          fallback={
            <Swatch listing={listing} className="absolute inset-0 size-full" />
          }
        />
        {caption ? (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-surface/75 to-transparent px-3 py-2">
            <span className="[&_*]:text-on-ink-2">{caption}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Swatch listing={listing} className={cn(ASPECT[aspect], className)}>
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 to-transparent px-3 py-2">
          <span className="[&_*]:text-white/85">{caption}</span>
        </div>
      ) : null}
    </Swatch>
  );
}
