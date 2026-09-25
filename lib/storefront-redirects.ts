import { MATERIALS, USES } from "@/domain/seo/semantic/ontology";

const BEST_FOR_REDIRECTS: Record<string, string> = {
  shirts: "shirts",
  dresses: "dresses",
  activewear: "activewear",
  trousers: "trousers",
  knitwear: "knitwear",
  upholstery: "upholstery",
  bedding: "bedding",
};

/** Map an obsolete application slug to a live Best For path when possible. */
export function bestForPathForApplication(slug: string): string {
  const mapped = BEST_FOR_REDIRECTS[slug.toLowerCase()];
  return mapped ? `/fabrics/best-for/${mapped}/` : "/fabrics/best-for/";
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const FABRIC_GUIDE_REDIRECTS = new Map<string, string>();
for (const material of MATERIALS) {
  const from = `/discover/${slugPart(`${material.id}-fabric-guide`)}/`;
  const skipped = ["cotton", "linen", "silk", "denim"].includes(material.id);
  const to =
    skipped && material.collectionSlug
      ? `/collections/${material.collectionSlug}/`
      : `/discover/${slugPart(`${material.id}-fabric`)}/`;
  FABRIC_GUIDE_REDIRECTS.set(from, to);
}
for (const use of USES) {
  FABRIC_GUIDE_REDIRECTS.set(
    `/discover/${slugPart(`${use.garmentLabel}-fabric-guide`)}/`,
    `/discover/${slugPart(`fabric-for-${use.id}`)}/`,
  );
  FABRIC_GUIDE_REDIRECTS.set(
    `/discover/${slugPart(`buy-${use.garmentLabel}-fabric-online`)}/`,
    `/discover/${slugPart(`fabric-for-${use.id}`)}/`,
  );
}
for (const material of MATERIALS) {
  const skipped = ["cotton", "linen", "silk", "denim"].includes(material.id);
  const materialTarget =
    skipped && material.collectionSlug
      ? `/collections/${material.collectionSlug}/`
      : `/discover/${slugPart(`${material.id}-fabric`)}/`;
  FABRIC_GUIDE_REDIRECTS.set(
    `/discover/${slugPart(`buy-${material.id}-fabric-online`)}/`,
    materialTarget,
  );
  FABRIC_GUIDE_REDIRECTS.set(
    `/discover/${slugPart(`bulk-${material.id}-fabric`)}/`,
    "/wholesale-fabric/",
  );
}

const HELP_REDIRECTS: Record<string, string> = {
  "finding-fabrics": "how-to-find-fabrics",
  searching: "how-search-works",
  filters: "how-filters-work",
  "choosing-quantity": "how-to-submit-an-inquiry",
  "buying-fabric": "how-to-buy-fabric",
  currency: "country-and-currency",
  "change-currency": "country-and-currency",
  "change-country": "country-and-currency",
  onboarding: "account",
  inquiry: "how-to-submit-an-inquiry",
  inquiries: "viewing-my-inquiries",
};

const GUIDE_REDIRECTS: Record<string, string> = {
  "understanding-gsm-in-fabric": "fabric-weight-and-gsm",
  "fabric-gsm": "fabric-weight-and-gsm",
  "woven-fabric": "woven-vs-knit-fabrics",
  "what-is-woven-fabric": "woven-vs-knit-fabrics",
};

/**
 * Attribute hubs that duplicated the ranking education URL for the same intent.
 * Keep the understanding-* page; redirect the thinner attribute twin.
 */
const ATTRIBUTE_EDUCATION_CONSOLIDATIONS: Record<string, string> = {
  "/discover/opaque-fabric/": "/discover/understanding-opaque-fabric/",
  "/discover/flowy-fabric/": "/discover/understanding-flowy-fabric/",
};

const MATERIAL_LANDING_REDIRECTS: Record<string, string> = {
  "/fabrics/cotton-fabric/": "/collections/cotton/",
  "/fabrics/linen-fabric/": "/collections/linen-lightweight/",
  "/fabrics/silk-fabric/": "/collections/silk-sheer/",
  "/fabrics/denim-fabric/": "/collections/denim/",
};

export type StorefrontRedirect = {
  from: string;
  to: string;
  reason: string;
};

export const STOREFRONT_REDIRECT_FAMILIES: readonly StorefrontRedirect[] = [
  {
    from: "/marketplace/fabrics/:slug/",
    to: "/fabrics/:slug/",
    reason: "One public canonical product URL",
  },
  {
    from: "/best-for/:slug?/",
    to: "/fabrics/best-for/:slug?/",
    reason: "Best For lives under the fabrics hierarchy",
  },
  {
    from: "/applications/:slug/",
    to: "/fabrics/best-for/:slug/ or /marketplace/",
    reason: "Applications are now customer Best For pages",
  },
  {
    from: "/search/",
    to: "/marketplace/",
    reason: "Search is a noindex marketplace state",
  },
  {
    from: "/suppliers/, /certifications/, /for/, /countries/, /listings/",
    to: "/marketplace/",
    reason: "Obsolete supplier, buyer and certificate architecture",
  },
  {
    from: "/fabrics/cotton-fabric/, /fabrics/linen-fabric/, /fabrics/silk-fabric/, /fabrics/denim-fabric/",
    to: "/collections/{cotton|linen-lightweight|silk-sheer|denim}/",
    reason:
      "Fibre material intent uses collection hubs to avoid cannibalization",
  },
  {
    from: "/fabrics/marketplace/",
    to: "/marketplace/",
    reason: "Marketplace is not a fabric PDP; catch-all soft-404 must redirect",
  },
  {
    from: "/guides/fabric-gsm/, /guides/woven-fabric/",
    to: "/guides/fabric-weight-and-gsm/, /guides/woven-vs-knit-fabrics/",
    reason: "Preferred research aliases map to existing authoritative guides",
  },
  {
    from: "/discover/{material}-fabric-guide/, /discover/{garment}-fabric-guide/",
    to: "the material, collection, or use page that already covers that topic",
    reason:
      "Guide aliases repeated the same fabric explanation and redirect to the canonical page",
  },
  {
    from: "/discover/opaque-fabric/, /discover/flowy-fabric/",
    to: "/discover/understanding-opaque-fabric/, /discover/understanding-flowy-fabric/",
    reason:
      "Attribute hubs cannibalized ranking education URLs for the same buyer question",
  },
];

/**
 * Canonical storefront redirects only. Every returned path is final: none is
 * itself a source in this function, so the proxy cannot create a chain.
 */
export function storefrontRedirect(pathname: string): string | null {
  const normalized =
    pathname === "/"
      ? pathname
      : `${pathname.replace(/\/{2,}/g, "/").replace(/\/+$/, "")}/`;
  const canonicalCase = normalized.toLowerCase();

  const marketplaceFabric = canonicalCase.match(
    /^\/marketplace\/fabrics\/([^/]+)\/$/,
  );
  if (marketplaceFabric) return `/fabrics/${marketplaceFabric[1]}/`;

  if (canonicalCase === "/fabrics/index/") return "/fabrics/";

  // Soft-404 fabric catch-all: /fabrics/marketplace/ is not a fabric PDP.
  if (canonicalCase === "/fabrics/marketplace/") return "/marketplace/";

  if (MATERIAL_LANDING_REDIRECTS[canonicalCase]) {
    return MATERIAL_LANDING_REDIRECTS[canonicalCase];
  }

  // Legacy Best For hub lived at /best-for/ before the fabrics hierarchy.
  if (canonicalCase === "/best-for/") return "/fabrics/best-for/";
  const legacyBestFor = canonicalCase.match(/^\/best-for\/([^/]+)\/$/);
  if (legacyBestFor) {
    return `/fabrics/best-for/${legacyBestFor[1]}/`;
  }

  if (canonicalCase === "/applications/") return "/fabrics/best-for/";
  const application = canonicalCase.match(/^\/applications\/([^/]+)\/$/);
  if (application) {
    const target = BEST_FOR_REDIRECTS[application[1]];
    return target ? `/fabrics/best-for/${target}/` : "/marketplace/";
  }

  if (canonicalCase === "/search/") return "/marketplace/";

  if (
    canonicalCase === "/oauth/callback/" ||
    canonicalCase === "/auth/google/callback/" ||
    canonicalCase === "/auth/google/success/"
  ) {
    return "/auth/callback/";
  }

  if (canonicalCase === "/guide/" || canonicalCase === "/guides/index/") {
    return "/guides/";
  }
  if (canonicalCase === "/help-center/" || canonicalCase === "/help-centre/") {
    return "/help/";
  }
  if (
    canonicalCase === "/support-center/" ||
    canonicalCase === "/support-centre/"
  ) {
    return "/support/";
  }

  if (ATTRIBUTE_EDUCATION_CONSOLIDATIONS[canonicalCase]) {
    return ATTRIBUTE_EDUCATION_CONSOLIDATIONS[canonicalCase];
  }

  if (FABRIC_GUIDE_REDIRECTS.has(canonicalCase)) {
    return FABRIC_GUIDE_REDIRECTS.get(canonicalCase) ?? null;
  }

  const guide = canonicalCase.match(/^\/guides\/([^/]+)\/$/);
  if (guide && GUIDE_REDIRECTS[guide[1]]) {
    return `/guides/${GUIDE_REDIRECTS[guide[1]]}/`;
  }

  const help = canonicalCase.match(/^\/help\/([^/]+)\/$/);
  if (help && HELP_REDIRECTS[help[1]]) {
    return `/help/${HELP_REDIRECTS[help[1]]}/`;
  }

  const obsoletePrefixes = [
    "/applications/",
    "/buyers/",
    "/for/",
    "/countries/",
    "/listings/",
    "/suppliers/",
    "/certifications/",
    "/verification/",
  ];
  if (
    obsoletePrefixes.some(
      (prefix) => canonicalCase === prefix || canonicalCase.startsWith(prefix),
    )
  ) {
    return "/marketplace/";
  }

  if (canonicalCase !== normalized) return canonicalCase;

  return null;
}
