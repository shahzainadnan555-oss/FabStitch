import type { FabricListing } from "@/domain/types";
import { cn } from "@/lib/cn";

/**
 * Rendered swatch.
 *
 * FabStitch has no product photography and will not fabricate any, so the
 * media slot renders the cloth from what the listing actually declares:
 * its colour, its construction, and how heavy it is.
 *
 * Three layers, which is what makes a fabric photograph read as fabric:
 *
 *   1. Base colour       the shade the supplier states
 *   2. Drape             soft directional light plus a fold, weight-scaled
 *   3. Structure         the weave or knit geometry, at the right scale
 *
 * This is not pretending to be a photograph. It is a rendering of declared
 * data, which is why it can carry a colour and a texture honestly while a
 * generated "photo of this mill's cloth" could not. The moment a supplier
 * uploads a real image, `FabricMedia` shows that instead and this disappears.
 */

export type SwatchStructure =
  | "jersey"
  | "rib"
  | "terry"
  | "fleece"
  | "plain"
  | "twill"
  | "mesh"
  | "sateen"
  | "canvas";

/** Loose for the same reason as `MediaSubject` - see the note there. */
type SwatchSubject = {
  material?: FabricListing["material"] | string | null;
  fabricType?: FabricListing["fabricType"] | string | null;
  construction?: string | null;
  gsm?: { value?: number | null } | null;
  swatchColor?: string | null;
  /** Used only to vary the fold phase, so a grid of swatches is not uniform. */
  slug?: string | null;
};

/** Stable small integer from a string. Deterministic across server and client. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function structureOf(listing: SwatchSubject): SwatchStructure {
  const c = (listing.construction ?? "").toLowerCase();
  const m = (listing.material ?? "").toLowerCase();

  if (c.includes("terry") && !c.includes("french")) return "terry";
  if (c.includes("fleece")) return "fleece";
  if (c.includes("french terry")) return "fleece";
  if (c.includes("rib")) return "rib";
  if (c.includes("mesh")) return "mesh";
  if (c.includes("sateen") || c.includes("satin")) return "sateen";
  if (c.includes("twill") || c.includes("drill") || m === "denim")
    return "twill";
  if (m === "canvas" || c.includes("canvas")) return "canvas";
  if (listing.fabricType === "knitted") return "jersey";
  return "plain";
}

/** Perceived lightness, used to decide whether the texture sits light or dark. */
function luminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const FALLBACK_COLOUR = "#ddd7ca";

/**
 * Pattern geometry. Scale rises with weight: a 500 GSM terry has a visibly
 * coarser surface than a 120 GSM poplin, and the swatch should say so.
 */
function geometry(structure: SwatchStructure, scale: number) {
  const s = (n: number) => n * scale;

  switch (structure) {
    case "jersey":
      return {
        size: s(13),
        node: (
          <>
            <path
              d={`M${s(1.5)} ${s(13)} Q${s(3.25)} ${s(6.5)} ${s(5)} ${s(13)}`}
            />
            <path
              d={`M${s(5)} ${s(13)} Q${s(6.75)} ${s(6.5)} ${s(8.5)} ${s(13)}`}
            />
            <path
              d={`M${s(8.5)} ${s(13)} Q${s(10.25)} ${s(6.5)} ${s(12)} ${s(13)}`}
            />
            <path
              d={`M${s(-0.25)} ${s(6.5)} Q${s(1.5)} 0 ${s(3.25)} ${s(6.5)}`}
            />
            <path d={`M${s(3.25)} ${s(6.5)} Q${s(5)} 0 ${s(6.75)} ${s(6.5)}`} />
            <path
              d={`M${s(6.75)} ${s(6.5)} Q${s(8.5)} 0 ${s(10.25)} ${s(6.5)}`}
            />
            <path
              d={`M${s(10.25)} ${s(6.5)} Q${s(12)} 0 ${s(13.75)} ${s(6.5)}`}
            />
          </>
        ),
      };
    case "rib":
      return {
        size: s(10),
        node: (
          <>
            <path d={`M${s(2.5)} 0 V${s(10)}`} strokeWidth={s(1.1)} />
            <path d={`M${s(7.5)} 0 V${s(10)}`} strokeWidth={s(1.1)} />
          </>
        ),
      };
    case "terry":
      return {
        size: s(12),
        node: (
          <>
            <circle cx={s(3)} cy={s(3)} r={s(2.1)} />
            <circle cx={s(9)} cy={s(9)} r={s(2.1)} />
            <circle cx={s(9)} cy={s(3)} r={s(1.3)} />
            <circle cx={s(3)} cy={s(9)} r={s(1.3)} />
          </>
        ),
      };
    case "fleece":
      return {
        size: s(11),
        node: (
          <>
            <path
              d={`M0 ${s(3)} Q${s(2.75)} ${s(0.5)} ${s(5.5)} ${s(3)} T${s(11)} ${s(3)}`}
            />
            <path
              d={`M0 ${s(8)} Q${s(2.75)} ${s(5.5)} ${s(5.5)} ${s(8)} T${s(11)} ${s(8)}`}
            />
          </>
        ),
      };
    case "twill":
      return {
        size: s(9),
        node: (
          <>
            <path
              d={`M${s(-2)} ${s(2)} L${s(2)} ${s(-2)}`}
              strokeWidth={s(1.5)}
            />
            <path d={`M0 ${s(9)} L${s(9)} 0`} strokeWidth={s(1.5)} />
            <path
              d={`M${s(7)} ${s(11)} L${s(11)} ${s(7)}`}
              strokeWidth={s(1.5)}
            />
          </>
        ),
      };
    case "mesh":
      return {
        size: s(9),
        node: (
          <>
            <circle cx={s(4.5)} cy={s(4.5)} r={s(2.6)} />
          </>
        ),
      };
    case "sateen":
      return {
        size: s(11),
        node: (
          <>
            <path d={`M0 ${s(2.75)} H${s(11)}`} />
            <path d={`M0 ${s(8.25)} H${s(11)}`} />
          </>
        ),
      };
    case "canvas":
      return {
        size: s(10),
        node: (
          <>
            <path d={`M0 ${s(2.5)} H${s(10)}`} strokeWidth={s(1.6)} />
            <path d={`M0 ${s(7.5)} H${s(10)}`} strokeWidth={s(1.6)} />
            <path d={`M${s(2.5)} 0 V${s(10)}`} strokeWidth={s(1.6)} />
            <path d={`M${s(7.5)} 0 V${s(10)}`} strokeWidth={s(1.6)} />
          </>
        ),
      };
    default:
      return {
        size: s(9),
        node: (
          <>
            <path d={`M0 ${s(2.25)} H${s(9)}`} />
            <path d={`M0 ${s(6.75)} H${s(9)}`} />
            <path d={`M${s(2.25)} 0 V${s(9)}`} />
            <path d={`M${s(6.75)} 0 V${s(9)}`} />
          </>
        ),
      };
  }
}

/** Constructions that throw a specular highlight rather than scattering. */
const LUSTROUS = new Set<SwatchStructure>(["sateen", "jersey", "mesh"]);

export function Swatch({
  listing,
  className,
  style,
  children,
}: {
  listing: SwatchSubject;
  className?: string;
  /** Merged over the base colour, for callers that position the swatch. */
  style?: React.CSSProperties;
  /** Overlaid content, e.g. the caption strip. */
  children?: React.ReactNode;
}) {
  const colour = listing.swatchColor ?? FALLBACK_COLOUR;
  const structure = structureOf(listing);
  const light = luminance(colour) > 0.35;

  // Heavier cloth reads coarser, but the range is deliberately narrow: the
  // structure is a texture under the colour, not the subject of the image.
  const gsm = listing.gsm?.value ?? 200;
  const scale = Math.min(2.2, Math.max(1.1, 1.1 + (gsm - 120) / 340));

  const { size, node } = geometry(structure, scale);
  const patternId = `sw-${structure}-${Math.round(scale * 100)}`;

  // Fold rhythm. Heavier cloth falls in broader waves; the phase and angle
  // vary per listing so no two cards in a grid share a silhouette.
  const seed = hash(
    listing.slug ?? `${listing.material}${listing.construction}`,
  );
  const grainId = `gr-${structure}-${seed % 1000}`;
  const angle = 96 + (seed % 22);
  const period = Math.round(150 + gsm * 0.24 + (seed % 40));
  const hi = light ? 0.3 : 0.16;
  const lo = light ? 0.13 : 0.26;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: colour, ...style }}
    >
      {/* Structure. Dark on pale cloth, light on dark cloth, so the weave
          reads at either end of the range. */}
      <svg
        className="absolute inset-0 size-full"
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
              stroke={light ? "#000" : "#fff"}
              // Raised from 0.085/0.11. At card size the structure was so faint
              // that a twill and a jersey looked identical, which defeats the
              // point of drawing the construction at all.
              strokeOpacity={light ? 0.14 : 0.17}
              strokeWidth={Math.max(0.8, scale)}
              strokeLinecap="round"
            >
              {node}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Drape.
          A rhythm of soft parallel folds plus a key light, which is what
          separates a piece of cloth from a colour chip. The fold period scales
          with weight (heavy cloth folds in broader waves than a light poplin)
          and the phase varies per listing, so a grid of swatches does not read
          as one repeated tile.
          Stops are deliberately far apart: a tight stop produces a visible
          seam rather than a fold. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(${angle}deg,` +
              ` rgb(255 255 255 / ${hi}) 0px,` +
              ` rgb(255 255 255 / ${hi * 0.35}) ${Math.round(period * 0.22)}px,` +
              ` rgb(0 0 0 / ${lo * 0.35}) ${Math.round(period * 0.46)}px,` +
              ` rgb(0 0 0 / ${lo}) ${Math.round(period * 0.62)}px,` +
              ` rgb(0 0 0 / ${lo * 0.3}) ${Math.round(period * 0.82)}px,` +
              ` rgb(255 255 255 / ${hi}) ${period}px)`,
            "radial-gradient(115% 85% at 16% 6%, rgb(255 255 255 / 0.26), transparent 64%)",
            "radial-gradient(110% 90% at 92% 98%, rgb(0 0 0 / 0.20), transparent 62%)",
          ].join(","),
        }}
      />

      {/* Fibre grain.
          The layer that separates cloth from a gradient. Real fabric has
          micro-variation at thread scale: fibres catch light unevenly and no
          two square centimetres are identical. `feTurbulence` at fine
          frequency reproduces that cheaply, and at 6-9% opacity it is felt
          rather than seen - large enough to kill the plastic flatness, small
          enough that it never reads as noise or JPEG artefacting. */}
      <svg
        className="absolute inset-0 size-full"
        aria-hidden="true"
        focusable="false"
        style={{ opacity: light ? 0.09 : 0.06, mixBlendMode: "overlay" }}
      >
        <defs>
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={3}
              seed={seed % 100}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Cross-fold.
          A second, slower fold rhythm at a different angle. One repeating
          gradient reads as banding however it is tuned; two at incommensurate
          angles and periods interfere, and the regularity disappears. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            `repeating-linear-gradient(${angle - 58}deg,` +
            ` rgb(255 255 255 / ${hi * 0.3}) 0px,` +
            ` rgb(0 0 0 / ${lo * 0.26}) ${Math.round(period * 0.7)}px,` +
            ` rgb(255 255 255 / ${hi * 0.3}) ${Math.round(period * 1.7)}px)`,
        }}
      />

      {/* Finish.
          Lustre is a property of the cloth, not of the card. A sateen or satin
          throws a specular band; a canvas or a twill scatters and stays matte.
          Rendering both the same way is what made every swatch look like the
          same material in a different colour. */}
      {LUSTROUS.has(structure) ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${angle - 90}deg, transparent 18%, rgb(255 255 255 / ${
              light ? 0.26 : 0.2
            }) 46%, transparent 74%)`,
          }}
        />
      ) : null}

      {/* Edge. Keeps the swatch from floating against a pale card. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.07)" }}
      />

      {children ? <div className="relative size-full">{children}</div> : null}
    </div>
  );
}
