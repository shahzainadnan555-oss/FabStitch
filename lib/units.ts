import type { Gsm, Moq, PriceBand, Width } from "@/domain/types";

/**
 * Unit conversion and formatting.
 *
 * The research is explicit that buyers in different regions think in different
 * units and abandon a page that speaks the wrong one, so FabStitch stores a
 * canonical value and always shows both readings. This module is the single
 * place those conversions happen.
 */

/** 1 oz/yd² = 33.906 g/m². */
const GSM_PER_OZ = 33.906;
const CM_PER_INCH = 2.54;

export function gsmToOz(gsm: number): number {
  return gsm / GSM_PER_OZ;
}

export function ozToGsm(oz: number): number {
  return oz * GSM_PER_OZ;
}

export function inchToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

/**
 * Linear metres obtainable from one kilogram, derived from GSM and width.
 * The conversion a buyer thinking in metres needs when inventory is priced by
 * the kilo.
 */
export function metresPerKg(gsm: number, widthCm: number): number {
  const gramsPerMetre = (gsm * widthCm) / 100;
  return 1000 / gramsPerMetre;
}

function round(value: number, places = 0): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/* ==========================================================================
 Formatting - every function returns a display string, never a number.
 ========================================================================== */

export function formatGsm(gsm: Gsm): string {
  const tolerance = gsm.tolerancePct ? ` ±${gsm.tolerancePct}%` : "";
  return `${gsm.value} GSM${tolerance}`;
}

/** The secondary reading shown beneath a GSM value for oz-thinking buyers. */
export function formatGsmAsOz(gsm: Gsm): string {
  return `${round(gsmToOz(gsm.value), 1)} oz/yd²`;
}

export function formatWidth(width: Width): string {
  const primary =
    width.unit === "cm" ? `${round(width.value)} cm` : `${round(width.value)}″`;
  const secondary =
    width.unit === "cm"
      ? `${round(cmToInch(width.value))}″`
      : `${round(inchToCm(width.value))} cm`;
  const type = width.type === "tubular" ? " tubular" : "";
  return `${primary} / ${secondary}${type}`;
}

/** Display label per quantity unit. Exported so cards can compose their own
 *  compact forms without re-declaring the vocabulary. */
export const QUANTITY_UNIT_LABEL: Record<Moq["unit"], string> = {
  kg: "kg",
  m: "m",
  yard: "yd",
  piece: "pcs",
  roll: "rolls",
};

export function formatMoq(moq: Moq): string {
  const base = `${moq.value.toLocaleString("en")} ${QUANTITY_UNIT_LABEL[moq.unit]}`;
  return moq.perColour ? `${base} per colour` : base;
}

/**
 * The smallest minimum order across a set of listings, formatted with its own
 * unit.
 *
 * Two things this exists to stop. First, `moqRange[0]` is a bare number: "MOQ
 * from 150" does not say 150 of what, and kilograms and metres are not
 * comparable quantities. Second, taking `items[0].moq` and labelling it
 * "lowest" is simply wrong unless the results happen to be sorted by MOQ.
 *
 * Units are still mixed across a result set, so the comparison is approximate
 * - but the number that gets displayed always carries the unit it was measured
 * in, which is the part a buyer acts on.
 */
export function lowestMoq(
  listings: { moq?: Moq | null }[],
): string | undefined {
  let best: Moq | undefined;
  for (const listing of listings) {
    if (!listing.moq) continue;
    if (!best || listing.moq.value < best.value) best = listing.moq;
  }
  return best ? formatMoq(best) : undefined;
}

export function formatPriceBand(price: PriceBand | null | undefined): string {
  if (!price) return "Price on request";
  const unit = QUANTITY_UNIT_LABEL[price.unit];
  const range =
    price.max && price.max !== price.min
      ? `${price.min.toFixed(2)}-${price.max.toFixed(2)}`
      : price.min.toFixed(2);
  return `${price.currency} ${range} / ${unit}`;
}

export function formatLeadTime(days: [number, number] | undefined): string {
  if (!days) return "On request";
  const [min, max] = days;
  return min === max ? `${min} days` : `${min}-${max} days`;
}

/**
 * Tolerance window for a GSM search. Mills work to tolerance, so an
 * exact-match result set looks empty when it is not - a search for 180 has to
 * surface 171-189 and say so.
 */
export function gsmTolerance(
  value: number,
  tolerancePct = 5,
): [number, number] {
  const delta = (value * tolerancePct) / 100;
  return [Math.floor(value - delta), Math.ceil(value + delta)];
}
