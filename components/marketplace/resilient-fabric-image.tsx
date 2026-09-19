"use client";

import Image from "next/image";
import { useState } from "react";
import { imageAsset } from "@/domain/seo/image-assets";

export function ResilientFabricImage({
  src,
  alt,
  sizes,
  priority,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return fallback;

  const known = imageAsset(src);
  const remote = /^https?:\/\//i.test(src);
  return (
    <Image
      src={src}
      alt={known?.alt || alt}
      width={known?.width ?? 1600}
      height={known?.height ?? 1200}
      unoptimized={remote}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
