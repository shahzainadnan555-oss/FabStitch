import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Server-rendered motion wrappers.
 *
 * The previous versions hydrated one IntersectionObserver per reveal and a
 * pointer listener for decorative fabric movement. The visual treatment is
 * now CSS-only, so content is present immediately, reduced-motion remains
 * respected by the stylesheet and public pages ship no JavaScript for these
 * decorations.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      style={{ "--fs-reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn("fs-scroll-reveal", className)}
    >
      {children}
    </div>
  );
}

export function PointerFabric({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("fs-pointer-fabric", className)}>{children}</div>;
}
