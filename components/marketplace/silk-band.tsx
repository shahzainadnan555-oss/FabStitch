import { cn } from "@/lib/cn";

/**
 * One decorative video element, rendered without hydration.
 *
 * The former crossfade used two copies of the same 2 MB source and a
 * requestAnimationFrame loop for the lifetime of the page. A native muted loop
 * keeps the moving treatment while halving video elements and removing the
 * continuous JavaScript work. The poster keeps the section complete when
 * autoplay or reduced-data settings prevent playback.
 */
export function SilkVideo({ className }: { className?: string }) {
  return (
    <video
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      src="/media/silk-hero.mp4"
      poster="/media/hero-navy-jersey.jpg"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
