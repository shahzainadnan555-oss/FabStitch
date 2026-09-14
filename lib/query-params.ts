/**
 * Reading filter values out of a URL, safely.
 *
 * Query parameters are not form input. They are whatever someone typed, whatever
 * an old link still carries, and whatever a crawler decided to follow, so every
 * value here is untrusted and must resolve to something the API will accept.
 *
 * The rule this module exists to keep: **an impossible filter is an empty
 * result, never a failed render.** `?gsm_min=9000` exceeds the API's documented
 * 1-5000 bound and came back 422. On `/search/` that threw after the streamed
 * shell had flushed, so the error boundary never reached the initial HTML and
 * the page was a 200 with full navigation and an empty body. On
 * `/fabrics/cotton/` and `/applications/t-shirts/` - both indexable - it was a
 * hard 500. A crawler following a malformed link got a server error on a
 * canonical path.
 *
 * Clamping is what keeps the answer honest. No cloth is 9000 GSM and none is
 * 5000 GSM either, so both questions have the same true answer - nothing - and
 * the buyer gets the ordinary empty state explaining that.
 *
 * This lived as a private copy in five route files. One copy meant one place to
 * apply the bound.
 */

/** The API's bound on GSM. Mirrored from `/listings` in the live OpenAPI. */
export const GSM_BOUNDS = { min: 1, max: 5000 } as const;

/**
 * A numeric query parameter, held inside what the API will accept.
 *
 * Returns `undefined` for absent or non-numeric input, so the filter is simply
 * not applied - a typo should not narrow a search to nothing without saying so.
 * A number outside the range is clamped rather than dropped, because dropping
 * it would answer a different question than the buyer asked.
 */
export function numericParam(
  value: string | undefined,
  {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
  }: { min?: number; max?: number } = {},
): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.min(Math.max(parsed, min), max);
}

/**
 * Pages are 1-based.
 *
 * `?page=0`, `?page=-3` and `?page=abc` are not errors worth a status code -
 * they are page one. Beyond the last page the API returns an empty set, which
 * the empty state already handles.
 */
export function pageParam(value: string | undefined): number {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}
