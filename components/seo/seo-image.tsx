"use client";

import Image from "next/image";
import { imageAsset } from "@/domain/seo/image-assets";

/**
 * Content image with the file's own alt text, intrinsic dimensions, and srcset.
 * Does not set a title attribute.
 */
export function SeoImage({
  src,
  alt,
  sizes = "(min-width: 768px) 52rem, 100vw",
  priority = false,
  className = "absolute inset-0 h-full w-full object-cover",
}: {
  src: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const asset = imageAsset(src);
  return (
    <Image
      src={src}
      alt={asset?.alt ?? alt ?? "Fabric photograph"}
      width={asset?.width ?? 1600}
      height={asset?.height ?? 1200}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
