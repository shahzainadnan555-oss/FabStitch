import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Hand-authored icon set.
 *
 * No icon library: every installed design skill bans the Lucide/Feather look,
 * and a marketplace this size does not need a dependency for fourteen glyphs.
 * All icons share a 16-unit grid and a 1.25 stroke so they sit optically level
 * with 13-15px text.
 *
 * Icons are decorative by default (`aria-hidden`). Pass a `title` only when the
 * icon is the sole carrier of meaning - otherwise label the control instead.
 */

type IconProps = SVGProps<SVGSVGElement> & {
  /** Accessible name. Omit for decorative icons sitting beside real text. */
  title?: string;
};

function Svg({ title, className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="7.25" cy="7.25" r="4.25" />
      <path d="M10.5 10.5 13.5 13.5" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 8h10.5" />
      <path d="M9.5 4.25 13.25 8 9.5 11.75" />
    </Svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.75 6 8 10.25 12.25 6" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3.75 10.25 8 6 12.25" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4 12 12M12 4 4 12" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8.5 6.25 11.75 13 5" />
    </Svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.25 4.25h11.5M2.25 8h11.5M2.25 11.75h11.5" />
    </Svg>
  );
}

/** Verification mark - a check inside a seal, used only on verified suppliers. */
export function IconVerified(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.75 9.9 3.1l2.3.16.6 2.24 1.45 1.8-1.45 1.8-.6 2.24-2.3.16L8 14.25 6.1 12.9l-2.3-.16-.6-2.24L1.75 8.7 3.2 6.9l.6-2.24 2.3-.16Z" />
      <path d="M5.6 8.15 7.3 9.85 10.6 6.5" />
    </Svg>
  );
}

/** Swatch / material sample. */
export function IconSwatch(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="0.75" />
      <path d="M2.25 6.1h11.5M2.25 9.9h11.5M6.1 2.25v11.5M9.9 2.25v11.5" />
    </Svg>
  );
}

/** Document / specification sheet. */
export function IconDocument(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.25 1.75h5.5l4 4v8.5h-9.5z" />
      <path d="M8.75 1.75v4h4" />
      <path d="M5.5 9h5M5.5 11.25h3.25" />
    </Svg>
  );
}

/** Factory / mill - the supplier glyph. */
export function IconMill(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M1.75 14.25V7l3.5 2V7l3.5 2V7l3.5 2V4.25h1.75" />
      <path d="M1.75 14.25h12.5" />
      <path d="M4.5 14.25v-2.5M8 14.25v-2.5M11.5 14.25v-2.5" />
    </Svg>
  );
}

/** Scale / quantity - used for MOQ and volume affordances. */
export function IconQuantity(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.25 4.75 8 2.25l5.75 2.5v6.5L8 13.75 2.25 11.25z" />
      <path d="M2.25 4.75 8 7.25l5.75-2.5M8 7.25v6.5" />
    </Svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 3.75h12M4.25 8h7.5M6.5 12.25h3" />
    </Svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 3.25H3.25v9.5h9.5V9.5" />
      <path d="M9.25 2.75h4v4M13.25 2.75 7.75 8.25" />
    </Svg>
  );
}

/** Result layout: grid of swatches. */
export function IconGrid(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.25" y="2.25" width="5" height="5" rx="0.5" />
      <rect x="8.75" y="2.25" width="5" height="5" rx="0.5" />
      <rect x="2.25" y="8.75" width="5" height="5" rx="0.5" />
      <rect x="8.75" y="8.75" width="5" height="5" rx="0.5" />
    </Svg>
  );
}

/** Result layout: comparison rows. */
export function IconRows(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.25 4H13.75M2.25 8H13.75M2.25 12H13.75" />
      <path d="M5.25 2.5v11" strokeOpacity="0.45" />
    </Svg>
  );
}

/** Shield. Used for privacy and data-handling statements. */
export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.75 13.25 3.6v4.15c0 3.05-2.1 5.4-5.25 6.5-3.15-1.1-5.25-3.45-5.25-6.5V3.6Z" />
      <path d="M5.9 8.05 7.4 9.55 10.3 6.6" />
    </Svg>
  );
}

/** Globe. Used for cross-border sourcing reach. */
export function IconGlobe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M1.9 6.15h12.2M1.9 9.85h12.2" />
      <path d="M8 1.75c1.7 1.7 2.55 3.78 2.55 6.25S9.7 12.55 8 14.25c-1.7-1.7-2.55-3.78-2.55-6.25S6.3 3.45 8 1.75Z" />
    </Svg>
  );
}

/** Eye. Reveals an obscured value. */
export function IconEye(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M1.75 8S4.3 3.9 8 3.9 14.25 8 14.25 8 11.7 12.1 8 12.1 1.75 8 1.75 8Z" />
      <circle cx="8" cy="8" r="1.9" />
    </Svg>
  );
}

/** Eye, struck through. Hides a revealed value. */
export function IconEyeOff(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.35 4.2A6.6 6.6 0 0 1 8 3.9c3.7 0 6.25 4.1 6.25 4.1a12.5 12.5 0 0 1-2.16 2.62" />
      <path d="M3.86 5.34A12.6 12.6 0 0 0 1.75 8S4.3 12.1 8 12.1c.83 0 1.6-.2 2.3-.53" />
      <path d="m6.66 6.66a1.9 1.9 0 0 0 2.68 2.68" />
      <path d="M2.6 2.6 13.4 13.4" />
    </Svg>
  );
}

/* --- Workspace rail ------------------------------------------------------ */

export function IconHome(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.25 6.9 8 2.25l5.75 4.65v6.35a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75Z" />
      <path d="M6.25 14v-4h3.5v4" />
    </Svg>
  );
}

/** Compass. Discovery, as distinct from a keyword search. */
export function IconCompass(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="m10.6 5.4-1.35 3.85L5.4 10.6l1.35-3.85Z" />
    </Svg>
  );
}

/** Two panels side by side. Comparison. */
export function IconCompare(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1.9" y="3.4" width="5" height="9.2" rx="0.9" />
      <rect x="9.1" y="5.2" width="5" height="7.4" rx="0.9" />
    </Svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 13.4 3.2 8.75a2.9 2.9 0 0 1 0-4.15 3 3 0 0 1 4.24 0L8 5.15l.56-.55a3 3 0 0 1 4.24 0 2.9 2.9 0 0 1 0 4.15Z" />
    </Svg>
  );
}

export function IconBookmark(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.75 2.5h8.5v11l-4.25-2.9-4.25 2.9Z" />
    </Svg>
  );
}

/** Boards. Grouped sourcing projects. */
export function IconBoards(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1.9" y="2.4" width="12.2" height="11.2" rx="1.1" />
      <path d="M6.1 2.4v11.2M1.9 6.5h4.2" />
    </Svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.4 2.4h6.3l2.9 2.9v8.3H3.4Z" />
      <path d="M9.5 2.5v3h3" />
      <path d="M5.9 9.4h4.2M5.9 11.5h2.6" />
    </Svg>
  );
}

export function IconSample(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.4 1.9v4.3L3.1 12.1a1.2 1.2 0 0 0 1.05 1.8h7.7a1.2 1.2 0 0 0 1.05-1.8L9.6 6.2V1.9Z" />
      <path d="M5.6 1.9h4.8M4.4 9.5h7.2" />
    </Svg>
  );
}

export function IconBox(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.9 13.6 4.7v6.6L8 14.1 2.4 11.3V4.7Z" />
      <path d="M2.4 4.7 8 7.5l5.6-2.8M8 7.5v6.6" />
    </Svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M1.9 4.1h7.2v6.6H1.9Z" />
      <path d="M9.1 6.4h2.6l2.4 2.3v2h-5Z" />
      <circle cx="4.6" cy="11.9" r="1.35" />
      <circle cx="11.2" cy="11.9" r="1.35" />
    </Svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13.6 9.5a1.4 1.4 0 0 1-1.4 1.4H5.2L2.4 13.6V3.8a1.4 1.4 0 0 1 1.4-1.4h8.4a1.4 1.4 0 0 1 1.4 1.4Z" />
    </Svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12.1 6.7a4.1 4.1 0 1 0-8.2 0c0 4.1-1.6 5.2-1.6 5.2h11.4s-1.6-1.1-1.6-5.2Z" />
      <path d="M9.2 13.9a1.4 1.4 0 0 1-2.4 0" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6.1" cy="5.4" r="2.4" />
      <path d="M1.9 13.4a4.3 4.3 0 0 1 8.4 0" />
      <path d="M10.6 3.4a2.4 2.4 0 0 1 0 4.6M11.4 9.8a4.3 4.3 0 0 1 2.7 3.6" />
    </Svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8" r="2.15" />
      <path d="M12.9 9.9a1 1 0 0 0 .2 1.1l.05.05a1.25 1.25 0 1 1-1.75 1.75l-.05-.05a1 1 0 0 0-1.65.7v.14a1.2 1.2 0 1 1-2.4 0v-.07a1 1 0 0 0-1.72-.66l-.05.05a1.25 1.25 0 1 1-1.75-1.75l.05-.05a1 1 0 0 0-.7-1.65h-.14a1.2 1.2 0 1 1 0-2.4h.07a1 1 0 0 0 .66-1.72l-.05-.05a1.25 1.25 0 1 1 1.75-1.75l.05.05a1 1 0 0 0 1.65-.7v-.14a1.2 1.2 0 1 1 2.4 0v.07a1 1 0 0 0 1.72.66l.05-.05a1.25 1.25 0 1 1 1.75 1.75l-.05.05a1 1 0 0 0 .7 1.65h.14a1.2 1.2 0 1 1 0 2.4h-.07a1 1 0 0 0-.91.62Z" />
    </Svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.6 13.7V3.1a.8.8 0 0 1 .8-.8h5.1a.8.8 0 0 1 .8.8v10.6" />
      <path d="M9.3 6.6h3.3a.8.8 0 0 1 .8.8v6.3" />
      <path d="M1.6 13.7h12.8M5 5.2h1.9M5 7.7h1.9M5 10.2h1.9M11 9.1h.9M11 11.4h.9" />
    </Svg>
  );
}

/** Headset. Support, in the rail's help card. */
export function IconSupport(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.9 9.6V8a5.1 5.1 0 0 1 10.2 0v1.6" />
      <rect x="1.7" y="8.9" width="2.6" height="4" rx="1.1" />
      <rect x="11.7" y="8.9" width="2.6" height="4" rx="1.1" />
      <path d="M13 12.9a1.8 1.8 0 0 1-1.8 1.8H8.7" />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3.25v9.5M3.25 8h9.5" />
    </Svg>
  );
}

/** Overflow menu. */
export function IconMore(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="3.4" cy="8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="8" r="0.85" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 3.75 5.75 8 10 12.25" />
    </Svg>
  );
}

/** Trend arrows for period-over-period deltas. */
export function IconTrendUp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 11.5 6.4 7.8l2.3 2.3 4.5-4.6" />
      <path d="M9.8 5.5h3.4v3.4" />
    </Svg>
  );
}

export function IconTrendDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 4.5 6.4 8.2l2.3-2.3 4.5 4.6" />
      <path d="M9.8 10.5h3.4V7.1" />
    </Svg>
  );
}

/* --- Product tiles -------------------------------------------------------
   Line-art garments for the "start with what you're making" row. Drawn on the
   same 16-unit grid as the rest of the set so they sit optically level with a
   label, and kept to outlines so a row of nine reads as one family rather than
   nine illustrations. */

export function IconTshirt(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.9 2.1 3 3.4 1.9 6.2l1.9.8v6.9h8.4V7l1.9-.8L13 3.4l-2.9-1.3Z" />
      <path d="M5.9 2.1a2.1 2.1 0 0 0 4.2 0" />
    </Svg>
  );
}

export function IconShirt(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.8 2.1 3 3.4 2 6.1l1.7.7v7.1h8.6V6.8l1.7-.7-1-2.7-2.8-1.3Z" />
      <path d="M5.8 2.1 8 4.5l2.2-2.4M8 4.5v9.4" />
    </Svg>
  );
}

/**
 * The four garment tiles the homepage renders that had no icon.
 *
 * `PRODUCT_ICONS` covered five of the nine applications the row shows, and
 * `ProductTile` renders nothing when a slug is missing — so underwear,
 * sportswear, blouses and polo shirts each drew an empty bordered square with a
 * caption under it. Same 16x16 grid, same 1.25 stroke, same construction as the
 * garments already here, so the row reads as one set rather than two.
 */
export function IconUnderwear(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.6 4.6h10.8l-.6 4.1a3.2 3.2 0 0 1-2 2.6l-.4.2-1.5-3-1.5 3-.4-.2a3.2 3.2 0 0 1-2-2.6L2.6 4.6Z" />
      <path d="M2.6 4.6h10.8" />
    </Svg>
  );
}

export function IconSportswear(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 2.2 3.1 3.5l-1 2.6 1.8.8v6.9h8.2V6.9l1.8-.8-1-2.6L10 2.2Z" />
      <path d="M6 2.2 8 4l2-1.8" />
      <path d="M6.3 7.4h3.4M8 5.7v3.4" />
    </Svg>
  );
}

export function IconBlouse(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.9 2.2 3.2 3.6 2.3 6.2l1.6.7v6.9h8.2V6.9l1.6-.7-.9-2.6-2.7-1.4Z" />
      <path d="M5.9 2.2 8 4.8l2.1-2.6" />
      <path d="M8 6.6v5.2" />
    </Svg>
  );
}

export function IconPolo(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.9 2.2 3.1 3.5l-1 2.7 1.8.8v6.7h8.2V7l1.8-.8-1-2.7-2.8-1.3Z" />
      <path d="M5.9 2.2 8 4.4l2.1-2.2" />
      <path d="M7 3.5v3.1h2V3.9" />
    </Svg>
  );
}

export function IconHoodie(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.7 2.4 2.6 3.9 1.7 6.6l1.9.8v6.5h8.8V7.4l1.9-.8-.9-2.7-3.1-1.5Z" />
      <path d="M5.7 2.4a2.4 2.4 0 0 0 4.6 0" />
      <path d="M6.6 7.6v2.5M9.4 7.6v2.5" />
    </Svg>
  );
}

export function IconUniform(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.7 2.1 2.7 3.5 1.8 6.3l1.8.8v6.8h8.8V7.1l1.8-.8-.9-2.8-3-1.4Z" />
      <path d="M5.7 2.1 8 5l2.3-2.9" />
      <path d="M10.6 9.1h1.9M10.6 11h1.9" />
    </Svg>
  );
}

export function IconActivewear(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 2.2 3.1 3.6 2.1 6.3l1.8.8v6.7h8.2V7.1l1.8-.8-1-2.7L10 2.2Z" />
      <path d="M6 2.2 8 4l2-1.8" />
      <path d="m5.2 13.8 2-5.4 1.9 2.6 1.7-3.6" />
    </Svg>
  );
}

export function IconDress(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 2.1 4.2 3.3l.8 3-1 1.4-1.2 6.2h10.4l-1.2-6.2-1-1.4.8-3L10 2.1Z" />
      <path d="M6 2.1 8 3.7l2-1.6M5 6.3h6" />
    </Svg>
  );
}

export function IconBedding(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M1.8 12.9V5.4a1.1 1.1 0 0 1 1.1-1.1h10.2a1.1 1.1 0 0 1 1.1 1.1v7.5" />
      <path d="M1.8 9.6h12.4" />
      <path d="M4.4 7.4a1.1 1.1 0 0 1 1.1-1.1h2.2a1.1 1.1 0 0 1 1.1 1.1v2.2H4.4Z" />
    </Svg>
  );
}

export function IconUpholstery(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.6 8.1V5.2a1.2 1.2 0 0 1 1.2-1.2h8.4a1.2 1.2 0 0 1 1.2 1.2v2.9" />
      <path d="M1.7 9.3a1.2 1.2 0 0 1 2.4 0v1.9h7.8V9.3a1.2 1.2 0 0 1 2.4 0v3.5H1.7Z" />
      <path d="M4.1 12.8v1.1M11.9 12.8v1.1" />
    </Svg>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.9 5.2h10.2l-.9 8.7H3.8Z" />
      <path d="M5.6 6.7V4.4a2.4 2.4 0 0 1 4.8 0v2.3" />
    </Svg>
  );
}

/** Envelope. The email route into authentication. */
export function IconEnvelope(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1.9" y="3.4" width="12.2" height="9.2" rx="1.2" />
      <path d="m2.4 4.4 5.6 4 5.6-4" />
    </Svg>
  );
}

/** Padlock, closed. Confidentiality rather than verification. */
export function IconLock(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.1" y="7" width="9.8" height="7" rx="1.3" />
      <path d="M5.4 7V5.1a2.6 2.6 0 0 1 5.2 0V7" />
      <path d="M8 9.7v1.7" />
    </Svg>
  );
}
