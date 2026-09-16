import type { BuyerFabricListing } from "@/features/discovery/buyer-view";
import type { CustomerCatalogFabric } from "@/repositories/customer-catalog";
import { absolute, SITE_URL } from "@/lib/seo";

/**
 * Structured data, emitted only where the record genuinely supports it.
 *
 * The rule this file exists to keep: **schema.org describes what is true, not
 * what would rank well.** A category page is not a `Product`. A listing with no
 * price does not get an `Offer` with a zero in it. Nothing here invents a
 * rating, a review count or an availability the marketplace has not been told.
 *
 * `BreadcrumbList` already ships from `components/ui/breadcrumbs.tsx` on every
 * page that has a trail; this adds the two types the data can honestly carry.
 */

/** Serialise once, server-side, from our own records - never user input. */
function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * The marketplace itself. Emitted once, in the root layout.
 *
 * Deliberately minimal: legal name, the canonical URL and the logo. No
 * `foundingDate`, `numberOfEmployees`, `address` or `sameAs` social profiles,
 * because none of those are recorded anywhere and inventing them here is
 * exactly the kind of decorative structured data that gets a site penalised.
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FabStitch",
        url: SITE_URL,
        logo: absolute("/media/fabstitch-mark.png"),
        description:
          "A fabric storefront for discovering materials by properties and intended use — then inquiring with confidence.",
      }}
    />
  );
}

/**
 * The site and its search box. Emitted once, on the homepage only.
 *
 * `SearchAction` points at the live marketplace search URL template
 * (`/marketplace/?q=`) — the same destination the site search uses.
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "FabStitch",
        url: SITE_URL,
        description:
          "Discover FabStitch fabrics by material, construction, and intended use.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absolute("/marketplace/?q={search_term_string}"),
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function CollectionPageJsonLd({
  name,
  description,
  path,
  items = [],
}: {
  name: string;
  description: string;
  path: string;
  items?: {
    name: string;
    path: string;
    image?: string;
  }[];
}) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url: absolute(path),
        ...(items.length
          ? {
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: absolute(item.path),
                  name: item.name,
                  ...(item.image
                    ? {
                        image: item.image.startsWith("http")
                          ? item.image
                          : absolute(item.image),
                      }
                    : {}),
                })),
              },
            }
          : {}),
      }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  path,
  image,
  author,
  publishedAt,
  updatedAt,
}: {
  headline: string;
  description?: string | null;
  path: string;
  image?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
}) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        mainEntityOfPage: absolute(path),
        ...(description ? { description } : {}),
        ...(image
          ? {
              image: image.startsWith("http") ? image : absolute(image),
            }
          : {}),
        ...(author ? { author: { "@type": "Person", name: author } } : {}),
        ...(publishedAt ? { datePublished: publishedAt } : {}),
        ...(updatedAt ? { dateModified: updatedAt } : {}),
        publisher: {
          "@type": "Organization",
          name: "FabStitch",
          url: SITE_URL,
          logo: absolute("/media/fabstitch-mark.png"),
        },
      }}
    />
  );
}

/** Availability, mapped from the stock status the supplier actually set. */
const AVAILABILITY: Record<BuyerFabricListing["stockStatus"], string> = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  made_to_order: "https://schema.org/MadeToOrder",
  out_of_stock: "https://schema.org/OutOfStock",
};

/**
 * One supplier's offer of one cloth.
 *
 * This is the only page in the marketplace that is a `Product`: a listing is
 * the atomic unit a buyer can transact on. Fabric, category, application and
 * buyer pages are collections and are marked as nothing.
 *
 * Three deliberate omissions:
 *
 * - **No `offers` block without a price.** MOQ and lead time are known for
 *   every listing; price is not. An `Offer` carrying `price: 0` would be a
 *   false claim about what this cloth costs, and "price on application" is a
 *   real state in this trade.
 * - **No `aggregateRating` or `review`.** FabStitch has no reviews. Emitting
 *   an empty or invented rating is the single most common structured-data
 *   fabrication and it is worth naming here so nobody adds it later.
 * - **No `sku`/`gtin`.** A fabric listing has neither.
 */
export function ListingProductJsonLd({
  listing,
  path,
}: {
  listing: BuyerFabricListing;
  path: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.name,
    url: absolute(path),
    category: listing.composition,
    ...(listing.imageUrl
      ? {
          image: listing.imageUrl.startsWith("http")
            ? listing.imageUrl
            : absolute(listing.imageUrl),
        }
      : {}),
    brand: {
      "@type": "Organization",
      name: "FabStitch",
    },
    ...(listing.countryOfOrigin
      ? { countryOfOrigin: listing.countryOfOrigin }
      : {}),
  };

  // Only when a real band exists. `highPrice` is omitted rather than repeated
  // when the supplier quoted a single figure.
  if (listing.price) {
    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: listing.price.currency,
      lowPrice: listing.price.min,
      ...(listing.price.max && listing.price.max !== listing.price.min
        ? { highPrice: listing.price.max }
        : {}),
      availability: AVAILABILITY[listing.stockStatus],
      seller: {
        "@type": "Organization",
        name: "FabStitch",
      },
    };
  }

  return <JsonLd schema={schema} />;
}

/**
 * One FabStitch-owned catalog product.
 *
 * The 2027 reference currently supports discovery data but not a sellable
 * offer, so this deliberately has no `offers`, rating, review, SKU or
 * availability. Those fields can be added only when the product's commercial
 * record supplies them.
 */
export function CatalogProductJsonLd({
  fabric,
  description,
}: {
  fabric: CustomerCatalogFabric;
  description: string;
}) {
  const image =
    fabric.media.status === "final" && fabric.media.src
      ? fabric.media.src.startsWith("http")
        ? fabric.media.src
        : absolute(fabric.media.src)
      : undefined;
  const properties = [
    fabric.composition.length
      ? { name: "Composition", value: fabric.composition.join(" / ") }
      : null,
    fabric.construction.length
      ? { name: "Construction", value: fabric.construction.join(", ") }
      : null,
    fabric.measurements.length
      ? {
          name: "Measurement",
          value: fabric.measurements
            .map((item) => {
              const value =
                item.exact ??
                (item.min !== undefined && item.max !== undefined
                  ? `${item.min}–${item.max}`
                  : (item.min ?? item.max));
              return `${value} ${item.unit}`;
            })
            .join(", "),
        }
      : null,
  ].filter((item): item is { name: string; value: string } => item !== null);

  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: fabric.name,
        url: absolute(`/fabrics/${fabric.slug}/`),
        description,
        category: fabric.collection.label,
        ...(image ? { image } : {}),
        ...(fabric.composition.length
          ? { material: fabric.composition.join(" / ") }
          : {}),
        brand: { "@type": "Brand", name: "FabStitch" },
        ...(properties.length
          ? {
              additionalProperty: properties.map((property) => ({
                "@type": "PropertyValue",
                ...property,
              })),
            }
          : {}),
      }}
    />
  );
}

/**
 * Questions and answers a page genuinely carries.
 *
 * Emitted only from real `FaqEntry` records — the ones an editor wrote against
 * an entity or a guide. It is never generated from headings, never padded to
 * reach a count, and returns nothing when there are no FAQs, because a
 * `FAQPage` with one invented question on it is worse than none: it is a
 * structured claim that the page answers something it does not.
 *
 * Answers are emitted verbatim. Truncating them to a snippet would put a
 * different answer in the markup from the one on the page, which is the
 * mismatch the guidelines single out.
 */
export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const usable = faqs.filter(
    (faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0,
  );
  if (!usable.length) return null;

  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: usable.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}
