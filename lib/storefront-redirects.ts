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
    from: "/guide/, /help-center/, /support-center/",
    to: "/guides/, /help/, /support/",
    reason: "Canonical Guides, Help and Support routes",
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
