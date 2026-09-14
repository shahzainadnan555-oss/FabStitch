import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

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
      style={{ "--fs-textile-opacity": opacity } as CSSProperties}
    >
      <Image
        src={src}
        alt=""
        fill
        loading="lazy"
        sizes={
          placement === "full" || placement === "bottom" ? "100vw" : "58vw"
        }
        className="fs-textile-breathe object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
