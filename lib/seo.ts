/**
 * Canonical origin shared by metadata, structured data and the sitemap.
 * Production site: https://fabstitch.net
 * Override locally with NEXT_PUBLIC_SITE_URL.
 */
const PRODUCTION_SITE_URL = "https://fabstitch.net";

function configuredSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.origin;
      }
    } catch {
      // Empty or invalid values must not reach metadataBase.
    }
  }
  return PRODUCTION_SITE_URL;
}

export const SITE_URL = configuredSiteUrl();

export function absolute(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
