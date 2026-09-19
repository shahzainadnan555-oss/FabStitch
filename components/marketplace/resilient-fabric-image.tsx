"use client";

import Image from "next/image";
import { useState } from "react";
import { imageCopy } from "@/domain/seo/image-assets";

export function ResilientFabricImage({
  src,
  alt,
  title,
  sizes,
  priority,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  title?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return fallback;

  const copy = imageCopy(src, alt);
  const remote = /^https?:\/\//i.test(src);
  return (
    <Image
      src={src}
      alt={copy.alt}
      title={title?.trim() || copy.title}
      width={copy.width}
      height={copy.height}
      unoptimized={remote}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
