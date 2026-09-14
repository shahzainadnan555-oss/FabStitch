import type { BuyerCategory, Certification, Country } from "@/domain/types";

/**
 * Buyer, certification and country vocabularies.
 *
 * The twelve buyer categories are the ones named in the research; the
 * subcategory is the commercially important level, because that is how buyers
 * self-describe and how they search ("fabric for hoodie manufacturers", never
 * "garment manufacturer fabric"). Subcategories therefore sit flat at
 * /buyers/{slug}/ - see docs/ARCHITECTURE.md §5.
 *
 * `applications` on each subcategory is the `buyer_application` join that lets
 * a buyer page inherit the whole fabric map without hand-maintained rules.
 */

export const BUYER_CATEGORIES: BuyerCategory[] = [
  {
    id: "buy-fashion-brands",
    name: "Clothing & fashion brands",
    slug: "clothing-fashion-brands",
    summary:
      "Own the product and the customer, usually not a factory. Buy per season, sensitive to hand-feel.",
    subcategories: [
      {
        id: "buy-clothing-brands",
        name: "Clothing brands",
        slug: "clothing-brands",
        category: "clothing-fashion-brands",
        applications: ["t-shirts", "shirts", "dresses", "hoodies"],
      },
      {
        id: "buy-streetwear-brands",
        name: "Streetwear brands",
        slug: "streetwear-brands",
        category: "clothing-fashion-brands",
        applications: ["hoodies", "sweatshirts", "t-shirts", "jackets"],
      },
      {
        id: "buy-modest-wear-brands",
        name: "Modest-wear brands",
        slug: "modest-wear-brands",
        category: "clothing-fashion-brands",
        applications: ["abayas-modest-wear", "dresses"],
      },
    ],
  },
  {
    id: "buy-garment-manufacturers",
    name: "Garment manufacturers",
    slug: "garment-manufacturers",
    summary:
      "Cut and sew to order. Fabric is the largest input cost, bought continuously against a technical specification.",
    subcategories: [
      {
        id: "buy-t-shirt-manufacturers",
        name: "T-shirt manufacturers",
        slug: "t-shirt-manufacturers",
        category: "garment-manufacturers",
        applications: ["t-shirts", "polo-shirts"],
      },
      {
        id: "buy-hoodie-manufacturers",
        name: "Hoodie manufacturers",
        slug: "hoodie-manufacturers",
        category: "garment-manufacturers",
        applications: ["hoodies", "sweatshirts"],
      },
      {
        id: "buy-shirt-manufacturers",
        name: "Shirt manufacturers",
        slug: "shirt-manufacturers",
        category: "garment-manufacturers",
        applications: ["shirts", "blouses"],
      },
      {
        id: "buy-denim-manufacturers",
        name: "Denim manufacturers",
        slug: "denim-manufacturers",
        category: "garment-manufacturers",
        applications: ["jeans", "jackets"],
      },
    ],
  },
  {
    id: "buy-fashion-designers",
    name: "Fashion designers",
    slug: "fashion-designers",
    summary:
      "Small quantities and samples. Low MOQ and swatch availability matter more than price per kilo.",
    subcategories: [
      {
        id: "buy-independent-designers",
        name: "Independent designers",
        slug: "independent-designers",
        category: "fashion-designers",
        applications: ["dresses", "blouses", "skirts"],
      },
      {
        id: "buy-sampling-studios",
        name: "Sampling & prototyping studios",
        slug: "sampling-studios",
        category: "fashion-designers",
        applications: ["t-shirts", "shirts", "dresses"],
      },
    ],
  },
  {
    id: "buy-private-label",
    name: "Private label brands",
    slug: "private-label-brands",
    summary:
      "Produce under their own label. Need repeatable, certified, consistent-lot fabric they can re-order without variation.",
    subcategories: [
      {
        id: "buy-marketplace-sellers",
        name: "Marketplace sellers",
        slug: "marketplace-sellers",
        category: "private-label-brands",
        applications: ["t-shirts", "hoodies", "loungewear"],
      },
      {
        id: "buy-promotional-apparel",
        name: "Promotional apparel",
        slug: "promotional-apparel",
        category: "private-label-brands",
        applications: ["t-shirts", "polo-shirts", "caps-headwear"],
      },
    ],
  },
  {
    id: "buy-sportswear",
    name: "Sportswear & activewear brands",
    slug: "sportswear-activewear-brands",
    summary:
      "Performance is the product. Buy on measurable properties - stretch, recovery, moisture management, UV, weight.",
    subcategories: [
      {
        id: "buy-activewear-brands",
        name: "Activewear brands",
        slug: "activewear-brands",
        category: "sportswear-activewear-brands",
        applications: ["activewear", "yoga-wear"],
      },
      {
        id: "buy-swimwear-brands",
        name: "Swimwear brands",
        slug: "swimwear-brands",
        category: "sportswear-activewear-brands",
        applications: ["swimwear"],
      },
      {
        id: "buy-team-kit",
        name: "Team & club kit",
        slug: "team-club-kit",
        category: "sportswear-activewear-brands",
        applications: ["sportswear", "cycling-apparel"],
      },
    ],
  },
  {
    id: "buy-uniform-workwear",
    name: "Uniform & workwear manufacturers",
    slug: "uniform-workwear-manufacturers",
    summary:
      "Tender-based, long contracts. Durability, colour fastness and compliance outrank fashion entirely.",
    subcategories: [
      {
        id: "buy-school-uniform-makers",
        name: "School uniform manufacturers",
        slug: "school-uniform-manufacturers",
        category: "uniform-workwear-manufacturers",
        applications: ["school-uniforms", "shirts", "trousers"],
      },
      {
        id: "buy-healthcare-uniform-makers",
        name: "Healthcare & scrub manufacturers",
        slug: "healthcare-scrub-manufacturers",
        category: "uniform-workwear-manufacturers",
        applications: ["scrubs", "uniforms"],
      },
      {
        id: "buy-industrial-workwear",
        name: "Industrial workwear manufacturers",
        slug: "industrial-workwear-manufacturers",
        category: "uniform-workwear-manufacturers",
        applications: ["workwear", "coveralls", "hi-vis"],
      },
      {
        id: "buy-hospitality-uniform",
        name: "Hospitality & chef wear",
        slug: "hospitality-chef-wear",
        category: "uniform-workwear-manufacturers",
        applications: ["chef-wear", "uniforms"],
      },
    ],
  },
  {
    id: "buy-home-textile",
    name: "Home textile manufacturers",
    slug: "home-textile-manufacturers",
    summary:
      "Bedding, bath, kitchen and table linen. Width capability, thread count and wash durability drive selection.",
    subcategories: [
      {
        id: "buy-bedding-manufacturers",
        name: "Bedding manufacturers",
        slug: "bedding-manufacturers",
        category: "home-textile-manufacturers",
        applications: ["bedding"],
      },
      {
        id: "buy-towel-manufacturers",
        name: "Towel & bathrobe manufacturers",
        slug: "towel-bathrobe-manufacturers",
        category: "home-textile-manufacturers",
        applications: ["towels", "bathrobes"],
      },
      {
        id: "buy-hotel-linen",
        name: "Hotel & hospitality linen suppliers",
        slug: "hotel-linen-suppliers",
        category: "home-textile-manufacturers",
        applications: ["bedding", "towels", "table-linen"],
      },
    ],
  },
  {
    id: "buy-furniture-upholstery",
    name: "Furniture & upholstery manufacturers",
    slug: "furniture-upholstery-manufacturers",
    summary:
      "Buy heavyweight fabric rated for abrasion, fire retardancy and rub count.",
    subcategories: [
      {
        id: "buy-sofa-seating",
        name: "Sofa & seating manufacturers",
        slug: "sofa-seating-manufacturers",
        category: "furniture-upholstery-manufacturers",
        applications: ["sofas", "upholstery"],
      },
      {
        id: "buy-contract-furniture",
        name: "Contract & hospitality furniture",
        slug: "contract-hospitality-furniture",
        category: "furniture-upholstery-manufacturers",
        applications: ["upholstery", "cushions"],
      },
    ],
  },
  {
    id: "buy-bags-accessories",
    name: "Bags & accessories manufacturers",
    slug: "bags-accessories-manufacturers",
    summary:
      "Heavy canvas, coated polyester, ripstop nylon and lining. Coating and denier lead the decision.",
    subcategories: [
      {
        id: "buy-backpack-manufacturers",
        name: "Backpack & luggage manufacturers",
        slug: "backpack-luggage-manufacturers",
        category: "bags-accessories-manufacturers",
        applications: ["backpacks", "luggage", "bags"],
      },
      {
        id: "buy-cap-headwear",
        name: "Cap & headwear manufacturers",
        slug: "cap-headwear-manufacturers",
        category: "bags-accessories-manufacturers",
        applications: ["caps-headwear"],
      },
    ],
  },
  {
    id: "buy-wholesalers",
    name: "Textile wholesalers & distributors",
    slug: "textile-wholesalers-distributors",
    summary:
      "Buy to resell. Broad and deep rather than to a single specification; price-first at container scale.",
    subcategories: [
      {
        id: "buy-fabric-wholesalers",
        name: "Fabric wholesalers",
        slug: "fabric-wholesalers",
        category: "textile-wholesalers-distributors",
        applications: ["t-shirts", "shirts", "jeans"],
      },
      {
        id: "buy-stock-lot-traders",
        name: "Stock-lot & surplus traders",
        slug: "stock-lot-surplus-traders",
        category: "textile-wholesalers-distributors",
        applications: ["t-shirts", "dresses"],
      },
    ],
  },
  {
    id: "buy-buying-houses",
    name: "Buying houses & sourcing companies",
    slug: "buying-houses-sourcing-companies",
    summary:
      "Act for overseas retailers. Compare many suppliers per enquiry and value comparable structured data above all else.",
    subcategories: [
      {
        id: "buy-buying-house",
        name: "Buying houses",
        slug: "buying-houses",
        category: "buying-houses-sourcing-companies",
        applications: ["t-shirts", "shirts", "trousers", "dresses"],
      },
      {
        id: "buy-sourcing-agents",
        name: "Sourcing agents",
        slug: "sourcing-agents",
        category: "buying-houses-sourcing-companies",
        applications: ["t-shirts", "uniforms", "bedding"],
      },
    ],
  },
  {
    id: "buy-technical-textiles",
    name: "Industrial & technical textile companies",
    slug: "industrial-technical-textiles",
    summary:
      "Buy against engineering specifications and test standards. Certification is mandatory and qualification cycles are long.",
    subcategories: [
      {
        id: "buy-ppe-manufacturers",
        name: "PPE & protective clothing",
        slug: "ppe-protective-clothing",
        category: "industrial-technical-textiles",
        applications: ["ppe", "coveralls", "hi-vis"],
      },
      {
        id: "buy-automotive-textile",
        name: "Automotive interiors",
        slug: "automotive-interiors",
        category: "industrial-technical-textiles",
        applications: ["automotive-textiles"],
      },
      {
        id: "buy-medical-textile",
        name: "Medical & surgical textiles",
        slug: "medical-surgical-textiles",
        category: "industrial-technical-textiles",
        applications: ["medical-textiles"],
      },
    ],
  },
];

export const BUYER_SUBCATEGORIES = BUYER_CATEGORIES.flatMap(
  (c) => c.subcategories,
);

/**
 * Certification slugs this site used to serve, and the record each one is now.
 *
 * The backend `Certification` table is the authority on identity: it holds
 * `bci` and `oeko-tex-100`, those slugs carry the listing associations (65 and
 * 415 respectively), and the gate publishes `IndexablePage` rows for them. This
 * module had invented its own spellings - `better-cotton` and
 * `oeko-tex-standard-100` - which produced two URLs per certificate, each
 * canonicalising to itself.
 *
 * The cost was not only duplication. `CERT_BY_SLUG` in
 * `domain/taxonomy/relations.ts` is keyed on these slugs and is used to filter
 * the "certifications in these results" panel, so a backend slug that had no
 * local twin was silently dropped: `/fabrics/cotton/` offered six
 * certifications in its facet and linked two.
 *
 * The slugs above now match the backend. This map keeps the retired spellings
 * resolvable - `proxy.ts` 308s them to the canonical URL - so any link already
 * pointing at one still lands on the right page.
 */
export const CERTIFICATION_ALIASES: Record<string, string> = {
  "better-cotton": "bci",
  "oeko-tex-standard-100": "oeko-tex-100",
};

/**
 * Certifications. `covers` states what the certificate actually proves -
 * FabStitch never overstates a claim, and never shows a verification badge
 * before the certificate number, scope and validity have been checked.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert-oeko-tex-100",
    name: "OEKO-TEX Standard 100",
    slug: "oeko-tex-100",
    abbreviation: "OEKO-TEX 100",
    covers: "Textiles tested for harmful substances at every component level.",
  },
  {
    id: "cert-gots",
    name: "Global Organic Textile Standard",
    slug: "gots",
    abbreviation: "GOTS",
    covers:
      "Organic fibre content plus processing and social criteria across the supply chain.",
  },
  {
    id: "cert-grs",
    name: "Global Recycled Standard",
    slug: "grs",
    abbreviation: "GRS",
    covers:
      "Recycled content with chain-of-custody, plus social and environmental criteria.",
  },
  {
    id: "cert-rcs",
    name: "Recycled Claim Standard",
    slug: "rcs",
    abbreviation: "RCS",
    covers: "Recycled content and chain of custody only.",
  },
  {
    id: "cert-bci",
    name: "Better Cotton",
    slug: "bci",
    abbreviation: "BCI",
    covers: "Cotton sourced under Better Cotton chain-of-custody rules.",
  },
  {
    id: "cert-bluesign",
    name: "bluesign",
    slug: "bluesign",
    abbreviation: "bluesign",
    covers: "Safer chemistry and responsible resource use in production.",
  },
  {
    id: "cert-reach",
    name: "REACH",
    slug: "reach",
    abbreviation: "REACH",
    covers: "EU regulation on registration and restriction of chemicals.",
  },
];

/**
 * Sourcing origins. `knownFor` is included only where the country genuinely
 * carries a commercial reputation for a fabric - the research is explicit that
 * a country page must not be the fabric page with a place name swapped in.
 */
export const COUNTRIES: Country[] = [
  { code: "PK", name: "Pakistan", knownFor: "Cotton knits, denim, towelling" },
  {
    code: "TR",
    name: "Türkiye",
    knownFor: "Jersey, towelling, short lead times",
  },
  { code: "IN", name: "India", knownFor: "Cotton, viscose, prints" },
  { code: "BD", name: "Bangladesh", knownFor: "High-volume knits" },
  {
    code: "CN",
    name: "China",
    knownFor: "Technical synthetics, coated fabrics",
  },
  { code: "PT", name: "Portugal", knownFor: "Premium jersey, short runs" },
  { code: "VN", name: "Vietnam", knownFor: "Performance knits, outerwear" },
  { code: "IT", name: "Italy", knownFor: "Suiting, luxury wovens" },
  { code: "EG", name: "Egypt", knownFor: "Extra-long staple cotton" },
  { code: "ID", name: "Indonesia" },
  {
    code: "TW",
    name: "Taiwan",
    knownFor: "Functional and recycled synthetics",
  },
  { code: "KR", name: "South Korea" },
];

export const COUNTRY_LOOKUP: { term: string; code: string; name: string }[] =
  COUNTRIES.flatMap((c) => {
    const terms = [c.name.toLowerCase()];
    if (c.code === "TR") terms.push("turkey", "turkiye");
    if (c.code === "KR") terms.push("korea");
    if (c.code === "GB") terms.push("uk", "united kingdom");
    return terms.map((term) => ({ term, code: c.code, name: c.name }));
  }).sort((a, b) => b.term.length - a.term.length);

/* ==========================================================================
   Country URLs
   ========================================================================== */

/**
 * A country's URL slug.
 *
 * This expression - `name.toLowerCase().replace(/\W+/g, "-")` - was written out
 * by hand in seven separate files: the route, the sitemap, the gate, the
 * opportunity generator, the nav, the link graph and the health report. Seven
 * copies of a slug function is seven chances for the sitemap and the page to
 * disagree about which URL a country has, which is a defect this project has
 * already shipped once.
 *
 * Accented names are transliterated before slugging, so "Türkiye" becomes
 * `turkiye` - the same slug the backend stores.
 *
 * This used to strip non-ASCII characters instead, producing `t-rkiye`. The
 * result was a country page that 200'd on two URLs, canonicalised to the one
 * the backend had never heard of, and reported "0 fabric suppliers" for a
 * country with four - because the lookup was by a slug no record carried.
 *
 * `NFD` splits a letter from its accent and the range strip removes the
 * accent, which is what `slugify` does server-side.
 */
export function countrySlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\W+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The canonical path for a country's marketplace page. */
export function countryPath(country: Country): string {
  return `/countries/${countrySlug(country.name)}/`;
}

/** Resolves a URL slug back to a country, or undefined if it is not one. */
export function findCountryBySlug(slug: string): Country | undefined {
  return COUNTRIES.find((country) => countrySlug(country.name) === slug);
}

/** Every country slug, for redirects and route disambiguation. */
export const COUNTRY_SLUGS: ReadonlySet<string> = new Set(
  COUNTRIES.map((country) => countrySlug(country.name)),
);
