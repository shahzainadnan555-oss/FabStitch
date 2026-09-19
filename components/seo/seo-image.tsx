"use client";

import Image from "next/image";
import { imageCopy } from "@/domain/seo/image-assets";

/**
 * Content image. Alt, title, width, and height always come from the image
 * catalog, or from a filename fallback when the file is not registered.
 * Pass decorative for images that must stay alt="" with no title.
 */
export function SeoImage({
  src,
  alt,
  title,
  sizes = "(min-width: 768px) 52rem, 100vw",
  priority = false,
  className = "absolute inset-0 h-full w-full object-cover",
  decorative = false,
}: {
  src: string;
  alt?: string;
  title?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  decorative?: boolean;
}) {
  const copy = imageCopy(src, alt);
  if (decorative) {
    return (
      <Image
        src={src}
        alt=""
        width={copy.width}
        height={copy.height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={copy.alt}
      title={title?.trim() || copy.title}
      width={copy.width}
      height={copy.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
