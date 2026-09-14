import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The supplied FabStitch mark: the FS monogram with a stitch line through it.
 *
 * Cropped from the 500x500 export to its own content box (200x201 at 154,104)
 * and kept at 3x, so a 24px render is sharp on a retina screen. Cropping
 * mattered: two fifths of the original frame was transparent padding, which
 * would have rendered the mark at roughly half the size of everything beside
 * it.
 * This is the one canonical standalone brand icon. Wordmarks, auth branding,
 * metadata and installable-app metadata all derive from the same artwork.
 */
export function FabStitchMark({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/media/fabstitch-mark.png"
      alt=""
      width={size}
      height={size}
      priority
      className={cn("shrink-0", className)}
    />
  );
}

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "on-ink";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/*
        The supplied mark on both surfaces - on a light plaque when the surface
        is dark.

        The artwork is two fixed colours: a navy F and a gold S. The dark
        surfaces are `navy-surface` (#141f38) and the F is very nearly that
        colour, so placed directly on the footer the monogram read as a lone
        gold S with a bite out of it. The previous answer was to substitute the
        drawn interlace there, which meant the footer carried a different mark
        from the header - the brand appearing as two things.

        Giving it its own paper chip keeps the real logo on both surfaces
        without touching a pixel of it. Recolouring someone's artwork is still
        not a decision to make silently; standing it on paper is not
        recolouring. A reversed export would let the plaque go away.
      */}
      {tone === "ink" ? (
        <FabStitchMark />
      ) : (
        <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-paper">
          <FabStitchMark size={20} />
        </span>
      )}
      <span
        className={cn(
          "text-[1.0625rem] font-semibold tracking-[-0.02em]",
          tone === "ink" ? "text-ink" : "text-on-ink",
        )}
      >
        FabStitch
      </span>
    </span>
  );
}
