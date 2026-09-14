"use client";

import Image from "next/image";
import { useState } from "react";

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

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={/^https?:\/\//i.test(src)}
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
