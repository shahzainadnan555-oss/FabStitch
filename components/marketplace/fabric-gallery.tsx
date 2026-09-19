"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SeoImage } from "@/components/seo/seo-image";
import {
  FabricMedia,
  type MediaAsset,
  type MediaSubject,
} from "./fabric-media";
import { Label } from "@/components/ui/typography";

/**
 * Listing gallery.
 *
 * Main frame plus thumbnails. With no assets it falls back to the single
 * construction diagram rather than showing an empty carousel, and with one
 * asset it drops the thumbnail strip, because a lone thumbnail reads as a bug.
 *
 * The frame kinds mirror what the listing creation flow asks suppliers to
 * upload: flat, draped, and macro weave detail.
 */

const KIND_LABEL: Record<NonNullable<MediaAsset["kind"]>, string> = {
  flat: "Flat",
  drape: "Draped",
  macro: "Weave detail",
  application: "In use",
};

export function FabricGallery({
  listing,
  assets = [],
  className,
}: {
  listing: MediaSubject;
  assets?: MediaAsset[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const current = assets[active];

  return (
    <div className={className}>
      <FabricMedia
        listing={listing}
        asset={current}
        aspect="16/7"
        priority
        sizes="(min-width: 1024px) 44rem, 92vw"
        className="rounded-md border border-rule-2"
      />

      {assets.length > 1 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {assets.map((asset, index) => (
            <li key={asset.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                className={cn(
                  "block overflow-hidden rounded-sm border p-0 transition-colors",
                  index === active
                    ? "border-indigo"
                    : "border-rule-2 hover:border-ink-3",
                )}
              >
                <span className="relative block size-16">
                  <SeoImage
                    src={asset.src}
                    alt={asset.alt || KIND_LABEL[asset.kind ?? "flat"]}
                    sizes="4rem"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </span>
                <span className="block border-t border-rule bg-paper px-1.5 py-1">
                  <Label>
                    {asset.kind ? KIND_LABEL[asset.kind] : `View ${index + 1}`}
                  </Label>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
