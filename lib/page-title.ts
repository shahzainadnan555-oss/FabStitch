/**
 * Customer-facing browser tab titles.
 *
 * Global template (see `app/layout.tsx`): `%s | FabStitch`
 * Homepage: absolute title supplied by the caller (no extra `| FabStitch`).
 * Brand-only titles: absolute `FabStitch`.
 */

export const BRAND_NAME = "FabStitch";
export const TITLE_TEMPLATE = `%s | ${BRAND_NAME}`;

/** Exact brand / project labels that must never appear as a page segment. */
const INTERNAL_TITLE =
  /^(?:fab[\s_-]*stitch)(?:[\s_-]*(?:frontend|backend|admin|dev|local|preview|app|\d+))?$/i;

/** Project-style brand with an underscore/hyphen suffix (repo, env, build ids). */
const PROJECT_STYLE_TITLE = /^fab[\s_-]*stitch[\s_-]+[a-z0-9][\w.-]*$/i;

const INTERNAL_FRAGMENT =
  /fab[\s_-]*stitch[\s_-]*(?:frontend|backend|admin|dev|local|preview)/gi;

const BRAND_SUFFIX =
  /\s*[|\-–—]\s*fab[\s_-]*stitch(?:[\s_-]*(?:frontend|backend|admin|dev|local|preview|app|\d+))?$/i;

const HOST_OR_ENV_TITLE =
  /^(?:localhost|127\.0\.0\.1|fastapicloud|vercel|preview)(?:[:/].*)?$/i;

const COLLAPSED_SPACES = /\s+/g;

export function cleanPageTitle(
  raw: string | null | undefined,
  fallback: string = BRAND_NAME,
): string {
  let title = (raw ?? "").replace(COLLAPSED_SPACES, " ").trim();
  if (!title) return fallback;

  title = title.replace(INTERNAL_FRAGMENT, BRAND_NAME).trim();
  title = title.replace(BRAND_SUFFIX, "").trim();
  title = title.replace(COLLAPSED_SPACES, " ").trim();

  const compact = title.replace(/[\s_-]+/g, "");
  if (
    !title ||
    INTERNAL_TITLE.test(title) ||
    PROJECT_STYLE_TITLE.test(title) ||
    HOST_OR_ENV_TITLE.test(title) ||
    /^fabstitch$/i.test(compact)
  ) {
    return fallback;
  }

  return title;
}

/**
 * Next.js metadata title value.
 * Homepage → absolute title as supplied (do not append `| FabStitch`).
 * Brand-only titles → absolute `FabStitch`.
 * Otherwise → segment for the global `%s | FabStitch` template.
 */
export function metadataTitle(
  raw: string | null | undefined,
  options: { absolute?: boolean; fallback?: string } = {},
): string | { absolute: string } {
  const fallback = options.fallback ?? BRAND_NAME;
  const cleaned = cleanPageTitle(raw, fallback);
  if (options.absolute) {
    return { absolute: cleaned || fallback };
  }
  if (cleaned === BRAND_NAME) {
    return { absolute: BRAND_NAME };
  }
  return cleaned;
}
