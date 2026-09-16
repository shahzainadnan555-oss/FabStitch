/**
 * Query parameters that should not affect indexability.
 * Marketing/tracking params must not force noindex on otherwise clean URLs.
 */
const TRACKING_QUERY_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
  "ref",
  "referrer",
  "source",
  "campaign",
  "_ga",
  "_gl",
  "gad_source",
  "gad_campaignid",
]);

function normalizeQueryKey(key: string): string {
  return key.trim().toLowerCase();
}

export function isTrackingQueryKey(key: string): boolean {
  return TRACKING_QUERY_KEYS.has(normalizeQueryKey(key));
}

/**
 * True when the request has SEO-relevant query state (filters, search, pagination).
 * Tracking-only query strings return false.
 */
export function hasIndexAffectingSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): boolean {
  if (searchParams instanceof URLSearchParams) {
    for (const key of searchParams.keys()) {
      if (!isTrackingQueryKey(key)) return true;
    }
    return false;
  }

  return Object.entries(searchParams).some(([key, value]) => {
    if (value === undefined) return false;
    return !isTrackingQueryKey(key);
  });
}
