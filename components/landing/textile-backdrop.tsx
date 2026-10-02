import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Decorative textile atmosphere.
 *
 * Implemented as a CSS background so crawl tools do not treat it as a content
 * image missing alt text or width/height attributes. The layer is aria-hidden.
 */
export function TextileBackdrop({
  src,
  placement = "right",
  opacity = 0.08,
  className,
  objectPosition = "center",
}: {
  src: string;
  placement?: "left" | "right" | "bottom" | "full";
  opacity?: number;
  className?: string;
  objectPosition?: string;
}) {
  return (
    <div
      aria-hidden
      data-placement={placement}
      className={cn(
        "fs-textile-environment pointer-events-none absolute overflow-hidden",
        placement === "left" && "inset-y-0 -left-[8%] w-[58%]",
        placement === "right" && "inset-y-0 -right-[8%] w-[58%]",
        placement === "bottom" && "inset-x-0 bottom-0 h-[68%]",
        placement === "full" && "inset-0",
        className,
      )}
      style={
        {
          "--fs-textile-opacity": opacity,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: objectPosition,
          backgroundRepeat: "no-repeat",
          opacity,
        } as CSSProperties
      }
    />
  );
}
