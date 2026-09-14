import type { FabricListing } from "@/domain/types";
import { cn } from "@/lib/cn";

/**
 * Construction diagram.
 *
 * FabStitch has no product photography and will not fabricate any, so the
 * media slot on a listing draws **the structure of the cloth itself** - the
 * loop rows of a knit, the over-under of a plain weave, the diagonal of a
 * twill, the pile of a terry.
 *
 * This is deliberately not decoration: a buyer scanning a grid can tell a
 * jersey from a twill at a glance, which is exactly what a swatch book is for.
 * It is also honest - it depicts what the specification says, nothing more.
 */

type Structure =
  "knit" | "rib" | "terry" | "plain" | "twill" | "mesh" | "sateen";

function structureOf(listing: {
  fabricType: FabricListing["fabricType"];
  construction?: string;
  material?: string;
}): Structure {
  const c = (listing.construction ?? "").toLowerCase();
  const m = (listing.material ?? "").toLowerCase();

  if (c.includes("terry") || c.includes("fleece")) return "terry";
  if (c.includes("rib")) return "rib";
  if (c.includes("mesh")) return "mesh";
  if (c.includes("sateen") || c.includes("satin")) return "sateen";
  if (c.includes("twill") || c.includes("drill") || m === "denim")
    return "twill";
  if (listing.fabricType === "knitted") return "knit";
  return "plain";
}

/** Pattern geometry per structure. Tiled at 16 units. */
function pattern(structure: Structure): {
  id: string;
  content: React.ReactNode;
  size: number;
} {
  switch (structure) {
    case "knit":
      // Interlocking loops - the V-column face of a single jersey.
      return {
        id: "knit",
        size: 16,
        content: (
          <>
            <path d="M2 16 Q4 8 6 16 M6 16 Q8 8 10 16 M10 16 Q12 8 14 16" />
            <path d="M2 8 Q4 0 6 8 M6 8 Q8 0 10 8 M10 8 Q12 0 14 8" />
          </>
        ),
      };
    case "rib":
      return {
        id: "rib",
        size: 12,
        content: (
          <>
            <path d="M3 0 V12 M9 0 V12" />
            <path d="M0 4 H12 M0 8 H12" strokeOpacity="0.35" />
          </>
        ),
      };
    case "terry":
      // Pile loops standing off the ground weave.
      return {
        id: "terry",
        size: 14,
        content: (
          <>
            <circle cx="4" cy="4" r="2.4" />
            <circle cx="11" cy="11" r="2.4" />
            <path d="M0 7.5 H14 M0 0.5 H14" strokeOpacity="0.3" />
          </>
        ),
      };
    case "mesh":
      return {
        id: "mesh",
        size: 12,
        content: (
          <>
            <circle cx="6" cy="6" r="3.6" />
            <path d="M0 0 H12 M0 12 H12" strokeOpacity="0.3" />
          </>
        ),
      };
    case "twill":
      // The defining diagonal rib.
      return {
        id: "twill",
        size: 12,
        content: (
          <>
            <path d="M-3 3 L3 -3 M0 12 L12 0 M9 15 L15 9" strokeWidth="2.2" />
            <path d="M-1 7 L7 -1 M4 14 L14 4" strokeOpacity="0.35" />
          </>
        ),
      };
    case "sateen":
      return {
        id: "sateen",
        size: 14,
        content: (
          <>
            <path d="M0 3.5 H14 M0 10.5 H14" />
            <path d="M3.5 0 V14 M10.5 0 V14" strokeOpacity="0.2" />
          </>
        ),
      };
    default:
      // Plain weave: warp and weft crossing one over one.
      return {
        id: "plain",
        size: 12,
        content: (
          <>
            <path d="M0 3 H12 M0 9 H12" />
            <path d="M3 0 V12 M9 0 V12" />
          </>
        ),
      };
  }
}

export function WeaveMark({
  listing,
  className,
  label,
}: {
  listing: {
    fabricType: FabricListing["fabricType"];
    construction?: string;
    material?: string;
  };
  className?: string;
  /** Rendered along the bottom edge, in the spec-sheet label style. */
  label?: React.ReactNode;
}) {
  const structure = structureOf(listing);
  const { id, content, size } = pattern(structure);
  // Unique per structure *and* per instance-free - the same structure can
  // safely share one pattern id within a document.
  const patternId = `weave-${id}`;

  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden bg-paper-sunk",
        className,
      )}
    >
      <svg
        className="absolute inset-0 size-full text-ink"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id={patternId}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.22"
            >
              {content}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {label ? (
        <div className="relative w-full bg-linear-to-t from-paper-sunk to-transparent px-3 py-2">
          {label}
        </div>
      ) : null}
    </div>
  );
}

export { structureOf };
