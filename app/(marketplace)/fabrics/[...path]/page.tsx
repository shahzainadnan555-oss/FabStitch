import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import {
  CatalogCursorPagination,
  NoResults,
} from "@/components/marketplace/results";
import { CatalogLoadError } from "@/components/marketplace/catalog-load-error";
import { GSM_BOUNDS, numericParam } from "@/lib/query-params";
import {
  getCustomerCatalogFabric,
  listCustomerCatalog,
} from "@/repositories/customer-catalog";
import { FabricCatalogueCard } from "@/components/marketplace/fabric-card";
import { CatalogFabricPage } from "./fabric-detail";
import {
  fabricSeoDescription,
  hasSeoQueryState,
  registeredStorefrontMetadata,
} from "@/lib/storefront-metadata";
import {
  ancestry,
  buildCanonical,
  childrenOf,
  gsmBandsFor,
  resolveFabricPath,
} from "@/domain/taxonomy/resolve";
import {
  FABRIC_FAMILIES,
  FABRIC_NODES,
  fabricsInFamily,
  fabricsWithTag,
} from "@/domain/taxonomy/fabrics";
import { formatGsm } from "@/lib/units";
import type { Crumb } from "@/components/ui/breadcrumbs";
import { fabricFamilyH1, fabricH1 } from "@/domain/seo/headings";
import {
  applicationsForFabricTree,
  siblingFabrics,
} from "@/domain/taxonomy/relations";
import {
  BestFor,
  FabricExperienceHero,
  RelatedFabricTiles,
} from "@/components/marketplace/fabric-experience";
import { LANDING_MEDIA } from "@/components/landing/media";

/**
 * Fabric category template.
 *
 * One component serving four page families - fabric, fabric × construction,
 * fabric × GSM, fabric × country - resolved from the path. This is what lets
 * the SEO architecture scale by adding data rather than components.
 *
 * Approved matching fabrics sit above the long-form explanation so discovery
 * remains useful without exposing legacy listing or supplier records.
 */

type Props = PageProps<"/fabrics/[...path]">;

/**
 * A catalogue fabric addressed by its own slug.
 *
 * The taxonomy resolver knows the local tree; the approved catalogue has
 * product slugs that are not tree paths. A single segment
 * the tree does not recognise is therefore looked up as a fabric before the
 * route gives up — which is what makes every catalogue record reachable
 * instead of 404.
 */
async function catalogueFabric(path: string[]) {
  if (path.length !== 1) return null;
  try {
    return await getCustomerCatalogFabric(path[0]);
  } catch {
    // Transient API failures must not collapse the route into a full-page
    // crash for an otherwise valid fabric slug.
    return "unavailable" as const;
  }
}

export function generateStaticParams() {
  const paths = [
    ...FABRIC_FAMILIES.map((family) => [family.slug]),
    ...FABRIC_NODES.map((node) =>
      buildCanonical(node)
        .replace(/^\/fabrics\/|\/$/g, "")
        .split("/"),
    ),
  ];
  return [...new Map(paths.map((path) => [path.join("/"), { path }])).values()];
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ path }, query] = await Promise.all([params, searchParams]);
  const detail = await catalogueFabric(path);
  if (detail === "unavailable") {
    return registeredStorefrontMetadata(`/fabrics/${path[0]}/`, {
      title: "Fabric",
      index: false,
    });
  }
  if (detail) {
    const { fabric } = detail;
    return registeredStorefrontMetadata(`/fabrics/${fabric.slug}/`, {
      title: fabric.seo?.title || fabric.name,
      description: fabricSeoDescription(fabric),
      image: fabric.media.src,
      index: !hasSeoQueryState(query),
    });
  }

  const route = resolveFabricPath(path);
  if (!route) {
    return {
      title: "Fabric not found",
      robots: { index: false, follow: true },
    };
  }

  // An alias is a URL that resolves to a page whose canonical is somewhere
  // else: `/fabrics/knits/pakistan/` and `/fabrics/cotton/cotton/` both render
  // but neither is the page's own address. A `rel=canonical` alone leaves them
  // returning 200 and claiming to be indexable, so a crawler must resolve the
  // duplicate rather than being told outright. Aliases are never indexable, no
  // matter how much supply sits behind the page they point at.
  // Metadata is generated from the entity and gated on real supply, so a page
  // the gate held back says `noindex` in its own head rather than relying on
  // the sitemap to hide it - a crawler following an internal link would
  // otherwise index it anyway.
  // The backend publication record is the only path that can opt the clean URL
  // into indexing. Missing records and query variants remain conservative.
  return registeredStorefrontMetadata(route.canonical, {
    title: `${route.title} fabrics`,
    description: `Explore source-backed ${route.title.toLowerCase()} fabric directions, specifications and uses in the approved FabStitch 2027 collection.`,
    index: !hasSeoQueryState(query),
  });
}

export default async function FabricCategoryPage({
  params,
  searchParams,
}: Props) {
  const { path } = await params;
  const detail = await catalogueFabric(path);
  if (detail === "unavailable") {
    return (
      <CatalogLoadError
        title="Unable to load this fabric right now."
        description="We're having trouble connecting. Try again in a moment."
      />
    );
  }
  if (detail) return <CatalogFabricPage detail={detail} />;

  const route = resolveFabricPath(path);
  if (!route) notFound();
  const requestedPath = `/fabrics/${path.join("/")}/`;
  if (requestedPath !== route.canonical) redirect(route.canonical);

  const query = await searchParams;

  // Certification URLs are retained as historical aliases, but certificates
  // are no longer part of buyer-facing discovery.
  if (route.certification) {
    redirect(
      route.node
        ? buildCanonical(route.node, route.gsm, route.countryCode)
        : "/marketplace/",
    );
  }

  // Material guides may only surface source-backed FabStitch fabrics. They
  // never read the legacy listing repository, even when an environment is
  // configured for API or fixture data.
  let results;
  let catalogFailed = false;
  try {
    results = await listCustomerCatalog({
      q:
        single(query.q) ??
        route.node?.name ??
        route.family?.name ??
        route.title,
      weightMin:
        route.gsm ??
        numericParam(
          single(query.weight_min) ?? single(query.gsm_min),
          GSM_BOUNDS,
        ),
      weightMax:
        route.gsm ??
        numericParam(
          single(query.weight_max) ?? single(query.gsm_max),
          GSM_BOUNDS,
        ),
      cursor: single(query.cursor),
      limit: numericParam(single(query.page_size), { min: 1, max: 48 }) ?? 12,
    });
  } catch {
    catalogFailed = true;
  }

  if (catalogFailed || !results) {
    return <CatalogLoadError title="Unable to load fabrics right now." />;
  }

  const crumbs = buildCrumbs(route);
  const children = route.node ? childrenOf(route.node.slug) : [];
  const familyMembers =
    route.kind === "family" && route.family
      ? fabricsInFamily(route.family.slug)
      : [];
  const propertyMembers =
    route.kind === "property" && route.property
      ? fabricsWithTag(route.property.slug)
      : [];
  const siblings = [...children, ...familyMembers, ...propertyMembers];
  const bands = route.node && !route.gsm ? gsmBandsFor(route.node) : [];

  // The H1 states what the page sells, not just what the entity is called.
  // Only the unqualified family and fabric pages take the pattern: once a
  // certification, origin or weight band is in the route, `route.title`
  // already carries that qualifier and wrapping it again reads as
  // "Wholesale GOTS cotton 140-180 GSM fabric from Türkiye fabric".
  //
  // A *root* node is a material category, not a cloth: "cotton", "denim" and
  // "linen" have no parent in the tree, and they list a whole material the way
  // a family does. They take the family pattern ("Wholesale cotton fabric")
  // rather than the cloth pattern, which read as the bare entity name plus a
  // noun. Nodes with a parent are specific cloths and keep "Cotton jersey
  // fabric", where a "Wholesale" prefix would overclaim a single construction.
  const qualified = Boolean(route.certification || route.gsm);
  const rootNode = route.kind === "node" && !route.node?.parentSlug;
  const heading = qualified
    ? route.title
    : route.kind === "family" || rootNode
      ? fabricFamilyH1(route.title)
      : route.kind === "node"
        ? fabricH1(route.title)
        : route.title;

  const bestFor = route.node ? applicationsForFabricTree(route.node.slug) : [];
  const relatedFabrics = route.node ? siblingFabrics(route.node.slug, 6) : [];
  const heroAttributes = [
    ...(route.node?.constructionClass
      ? [{ label: "Construction", value: route.node.constructionClass }]
      : []),
    ...(route.node?.gsmRange
      ? [
          {
            label: "Typical weight",
            value: `${route.node.gsmRange[0]}–${route.node.gsmRange[1]} GSM`,
          },
        ]
      : []),
    {
      label: "Published fabrics",
      value: results.total,
    },
  ];

  return (
    <>
      <FabricExperienceHero
        crumbs={crumbs}
        eyebrow={
          route.kind === "property" ? "Fabric property" : "Material guide"
        }
        title={heading}
        description={introFor(route)}
        image={imageForRoute(route)}
        imageAlt={`${route.title} fabric texture`}
        attributes={heroAttributes}
        actionHref={`/marketplace/?${marketplaceSeed(route)}`}
        actionLabel="Explore available fabrics"
      />

      <Container className="py-8">
        <BestFor items={bestFor} className="mb-10" />

        {/* Variations first: a buyer who knows they want the 180 GSM version
 should not have to use filters to get there. */}
        {siblings.length || bands.length ? (
          <section className="mb-8">
            <Label>
              {route.node ? "Popular variations" : "Fabrics in this group"}
            </Label>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {siblings.map((child) => (
                <li key={child.slug}>
                  <Link
                    href={`/fabrics/${ancestry(child)
                      .map((n) => n.slug)
                      .join("/")}/`}
                    className="inline-flex items-center rounded-sm border border-rule-2 bg-paper-raised px-2.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-indigo hover:text-indigo"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
              {bands.map((band) => (
                <li key={band}>
                  <Link
                    href={
                      route.node
                        ? buildCanonical(
                            route.node,
                            band,
                            route.countryCode,
                            route.certification?.slug,
                          )
                        : `${route.canonical}${band}-gsm/`
                    }
                    className="inline-flex items-center rounded-sm border border-rule-2 bg-paper px-2.5 py-1.5 font-mono text-xs tabular-nums text-ink-2 transition-colors hover:border-indigo hover:text-indigo"
                  >
                    {band} GSM
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="approved-fabrics-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label tone="ink">Published catalog</Label>
              <h2
                id="approved-fabrics-heading"
                className="mt-2 text-h2 font-semibold text-ink"
              >
                {!results.totalKnown
                  ? "Fabrics in this direction"
                  : `${results.total} ${
                      results.total === 1 ? "fabric" : "fabrics"
                    } in this direction`}
              </h2>
            </div>
            <Link
              href={`/marketplace/?${marketplaceSeed(route)}`}
              className="text-sm font-semibold text-indigo hover:underline"
            >
              Refine in marketplace
            </Link>
          </div>

          <div className="mt-5">
            {results.items.length ? (
              <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
                {results.items.map((fabric) => (
                  <FabricCatalogueCard key={fabric.id} fabric={fabric} />
                ))}
              </div>
            ) : (
              <NoResults
                title="No published fabric matches this direction"
                description="This material guide remains available, but there are no matching public catalog records right now."
                actions={suggestionsFor(route)}
              />
            )}
          </div>
          <CatalogCursorPagination
            currentCursor={single(query.cursor)}
            nextCursor={results.nextCursor}
            hasMore={results.hasMore}
            pageSize={results.pageSize}
            basePath={route.canonical}
            searchParams={query}
            pageSizes={[12, 24, 48]}
          />
        </section>

        <RelatedFabricTiles items={relatedFabrics} className="mt-10" />
      </Container>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function imageForRoute(route: FabricRouteLike): string | undefined {
  const identity = [
    route.node?.slug,
    route.node?.parentSlug,
    route.family?.slug,
    route.property?.slug,
  ].join(" ");

  if (identity.includes("denim")) return LANDING_MEDIA.denim;
  if (identity.includes("linen")) return LANDING_MEDIA.linen;
  if (identity.includes("canvas")) return LANDING_MEDIA.canvas;
  if (identity.includes("poplin")) return LANDING_MEDIA.poplin;
  if (identity.includes("twill")) return LANDING_MEDIA.twill;
  if (identity.includes("performance") || identity.includes("polyester"))
    return LANDING_MEDIA.performance;
  if (identity.includes("fleece")) return LANDING_MEDIA.fleece;
  if (identity.includes("jersey")) return LANDING_MEDIA.jersey;
  if (identity.includes("knit")) return LANDING_MEDIA.knit;
  if (identity.includes("cotton")) return LANDING_MEDIA.cotton;
  return undefined;
}

function marketplaceSeed(route: FabricRouteLike): string {
  const params = new URLSearchParams();
  if (route.node) params.set("q", route.node.name);
  else if (route.family) params.set("family", route.family.slug);
  else if (route.property) params.set("q", route.property.name);
  if (route.gsm) {
    params.set("weight_min", String(route.gsm));
    params.set("weight_max", String(route.gsm));
  }
  if (route.countryCode) params.set("country", route.countryCode);
  return params.toString();
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type FabricRouteLike = NonNullable<ReturnType<typeof resolveFabricPath>>;

function buildCrumbs(route: FabricRouteLike): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Fabrics", href: "/fabrics/" }];

  if (route.node) {
    const chain = ancestry(route.node);
    chain.forEach((node, index) => {
      crumbs.push({
        label: node.name,
        href: `/fabrics/${chain
          .slice(0, index + 1)
          .map((n) => n.slug)
          .join("/")}/`,
      });
    });
  } else if (route.family) {
    crumbs.push({
      label: route.family.name,
      href: `/fabrics/${route.family.slug}/`,
    });
  } else if (route.property) {
    crumbs.push({ label: route.property.name });
  }

  if (route.gsm) crumbs.push({ label: `${route.gsm} GSM` });
  if (route.certification)
    crumbs.push({ label: route.certification.abbreviation });
  if (route.countryName) crumbs.push({ label: route.countryName });

  return crumbs;
}

function introFor(route: FabricRouteLike): string {
  if (route.certification) {
    return "This historical URL redirects to the current fabric guide.";
  }
  if (route.gsm && route.node) {
    return `${route.gsm} GSM ${route.node.name.toLowerCase()} fabric direction, matched within mill tolerance so ${formatGsm({ value: route.gsm, tolerancePct: 5 })} still returns close weights. Only source-backed 2027 fabrics are shown.`;
  }
  if (route.node) return route.node.summary;
  if (route.family) return route.family.summary;
  if (route.property) {
    return `Fabrics across the catalogue carrying this property, from every material family.`;
  }
  return "";
}

function suggestionsFor(
  route: FabricRouteLike,
): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  if (route.gsm && route.node) {
    out.push({
      label: `All ${route.node.name.toLowerCase()} at any weight`,
      href: `/fabrics/${ancestry(route.node)
        .map((n) => n.slug)
        .join("/")}/`,
    });
  }
  if (route.certification && route.node) {
    out.push({
      label: `${route.node.name} without a certification filter`,
      href: `/fabrics/${ancestry(route.node)
        .map((n) => n.slug)
        .join("/")}/`,
    });
  }
  if (route.countryName && route.node) {
    out.push({
      label: `${route.node.name} from any origin`,
      href: `/fabrics/${ancestry(route.node)
        .map((n) => n.slug)
        .join("/")}/`,
    });
  }
  out.push({ label: "Browse every fabric family", href: "/fabrics/" });
  return out;
}
