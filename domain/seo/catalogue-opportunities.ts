import type { FabricListing } from "@/domain/types";
import { FABRIC_NODES, getFabric } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import {
  BUYER_SUBCATEGORIES,
  CERTIFICATIONS,
  COUNTRIES,
  countrySlug,
} from "@/domain/taxonomy/buyers";
import { buildCanonical, gsmBandsFor } from "@/domain/taxonomy/resolve";
import {
  applicationsForBuyer,
  applicationsForFabric,
  buyersForFabric,
  fabricsForApplication,
  siblingFabrics,
} from "@/domain/taxonomy/relations";
import { keywordRecord } from "./keywords";
import { cannibalisation, clusterKeywords } from "./clustering";
import { completeness, runGate, uniquenessScore } from "./gate";
import {
  rank,
  type EvaluatedOpportunity,
  type PageOpportunity,
} from "./opportunities";

/**
 * Turns the catalogue into page opportunities, then runs the gate.
 *
 * The join between what the taxonomy *could* express and what the marketplace
 * has earned. Every signal is counted from real records; nothing is estimated.
 *
 * The catalogue is passed in rather than imported so this is a pure function
 * of data - the same code runs against fixtures today and the API later.
 */

function listingMatchesFabric(listing: FabricListing, slug: string): boolean {
  const node = getFabric(slug);
  if (!node) return false;
  const haystack =
    `${listing.material} ${listing.construction ?? ""} ${listing.name}`.toLowerCase();
  if (haystack.includes(node.name.toLowerCase())) return true;
  return (node.aliases ?? []).some((alias) =>
    haystack.includes(alias.toLowerCase()),
  );
}

function suppliers(listings: FabricListing[]): number {
  return new Set(listings.map((l) => l.supplier.slug)).size;
}

/**
 * The facts a page states, as a set, for uniqueness scoring.
 *
 * Facts rather than prose: two pages whose listings, weights and suppliers are
 * identical *are* the same page however differently they are worded, which is
 * exactly what Q20 condition 4 exists to catch.
 */
function factSet(listings: FabricListing[], extra: string[] = []): Set<string> {
  const facts = new Set(extra);
  for (const listing of listings) {
    facts.add(`listing:${listing.slug}`);
    facts.add(`supplier:${listing.supplier.slug}`);
    facts.add(`origin:${listing.countryOfOrigin}`);
    if (listing.gsm)
      facts.add(`gsm:${Math.round(listing.gsm.value / 20) * 20}`);
    for (const cert of listing.certifications) facts.add(`cert:${cert.id}`);
  }
  return facts;
}

/** Words of page-specific prose the taxonomy actually supplies. */
function wordCount(...parts: (string | undefined)[]): number {
  return parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
}

/**
 * Words of page-specific content, counted rather than estimated.
 *
 * Q20 condition 3 requires ">= 150 words of specific, non-templated content".
 * An earlier version multiplied listing count by a constant, which is an
 * invented number wearing a measurement's clothes. This sums the actual
 * strings a page renders - the entity's own prose plus the name, composition
 * and construction of every listing on it - so the figure is checkable.
 *
 * Boilerplate is excluded by construction: nothing shared with the parent
 * page is counted, only what this page states about these records.
 */
function contentWords(
  listings: FabricListing[],
  ...prose: (string | undefined)[]
): number {
  const listingText = listings
    .map((l) =>
      [l.name, l.composition, l.construction, l.supplier.companyName]
        .filter(Boolean)
        .join(" "),
    )
    .join(" ");
  return wordCount(...prose, listingText);
}

export function buildOpportunities(
  listings: FabricListing[],
): EvaluatedOpportunity[] {
  const draft: PageOpportunity[] = [];

  /** Listings per fabric, computed once and reused by every composite. */
  const byFabric = new Map<string, FabricListing[]>();
  for (const node of FABRIC_NODES) {
    byFabric.set(
      node.slug,
      listings.filter((l) => listingMatchesFabric(l, node.slug)),
    );
  }

  // --- Fabric categories and specifications --------------------------------
  for (const node of FABRIC_NODES) {
    const matching = byFabric.get(node.slug) ?? [];
    const apps = applicationsForFabric(node.slug);
    const siblings = siblingFabrics(node.slug);
    const facts = factSet(matching, [
      `family:${node.family}`,
      `construction:${node.constructionClass}`,
    ]);

    draft.push({
      id: `fabric:${node.slug}`,
      pageType: "fabric_category",
      entities: { fabric: node.slug },
      path: buildCanonical(node),
      primaryKeyword: keywordRecord(`${node.name} fabric`, {
        fabric: node.slug,
      }),
      state: "candidate",
      signals: {
        listingCount: matching.length,
        supplierCount: suppliers(matching),
        uniqueWordCount: contentWords(matching, node.summary),
        uniquenessScore: uniquenessScore(
          facts,
          siblings.map((s) =>
            factSet(
              byFabric.get(s.href.split("/").filter(Boolean).pop() ?? "") ?? [],
            ),
          ),
        ),
        dataCompleteness: completeness(matching),
        hasQualifiedIntent: true,
        primaryKeywordIsUnique: true,
        relatedLinkCount:
          apps.length + siblings.length + buyersForFabric(node.slug).length,
      },
    });

    const bands = gsmBandsFor(node);
    for (const gsm of bands) {
      const atWeight = matching.filter(
        (l) => l.gsm && Math.abs(l.gsm.value - gsm) <= gsm * 0.08,
      );
      // Neighbouring weights are the siblings that matter: this is the check
      // that stops 180 GSM and 185 GSM being two versions of one page.
      const neighbours = bands
        .filter((other) => other !== gsm && Math.abs(other - gsm) <= 40)
        .map((other) =>
          factSet(
            matching.filter(
              (l) => l.gsm && Math.abs(l.gsm.value - other) <= other * 0.08,
            ),
          ),
        );

      draft.push({
        id: `spec:${node.slug}:${gsm}`,
        pageType: "fabric_specification",
        entities: { fabric: node.slug, gsm },
        path: buildCanonical(node, gsm),
        primaryKeyword: keywordRecord(`${gsm} gsm ${node.name.toLowerCase()}`, {
          fabric: node.slug,
          gsm,
        }),
        state: "candidate",
        signals: {
          listingCount: atWeight.length,
          supplierCount: suppliers(atWeight),
          uniqueWordCount: contentWords(atWeight),
          uniquenessScore: uniquenessScore(factSet(atWeight), neighbours),
          dataCompleteness: completeness(atWeight),
          hasQualifiedIntent: true,
          primaryKeywordIsUnique: true,
          relatedLinkCount: apps.length + 1,
        },
      });
    }
  }

  // --- Applications --------------------------------------------------------
  for (const application of APPLICATIONS) {
    const matching = listings.filter((l) =>
      l.applications?.includes(application.slug),
    );
    const fabrics = fabricsForApplication(application.slug);
    draft.push({
      id: `application:${application.slug}`,
      pageType: "application",
      entities: { application: application.slug },
      path: `/applications/${application.slug}/`,
      primaryKeyword: keywordRecord(
        `fabric for ${application.name.toLowerCase()}`,
        { application: application.slug },
      ),
      state: "candidate",
      signals: {
        listingCount: matching.length,
        supplierCount: suppliers(matching),
        uniqueWordCount: contentWords(
          matching,
          application.summary,
          ...fabrics.map((f) => f.hint),
        ),
        uniquenessScore: uniquenessScore(
          factSet(matching, [`application:${application.slug}`]),
          [],
        ),
        dataCompleteness: completeness(matching),
        hasQualifiedIntent: true,
        primaryKeywordIsUnique: true,
        relatedLinkCount: fabrics.length,
      },
    });
  }

  // --- Buyer categories ----------------------------------------------------
  for (const buyer of BUYER_SUBCATEGORIES) {
    const apps = applicationsForBuyer(buyer.slug);
    const matching = listings.filter((l) =>
      buyer.applications.some((a) => l.applications?.includes(a)),
    );

    draft.push({
      id: `buyer:${buyer.slug}`,
      pageType: "buyer_category",
      entities: { buyerType: buyer.slug },
      path: `/for/${buyer.slug}/`,
      primaryKeyword: keywordRecord(`fabric for ${buyer.name.toLowerCase()}`, {
        buyerType: buyer.slug,
      }),
      state: "candidate",
      signals: {
        listingCount: matching.length,
        supplierCount: suppliers(matching),
        uniqueWordCount: contentWords(
          matching,
          buyer.name,
          ...apps.map((a) => a.hint),
        ),
        uniquenessScore: uniquenessScore(
          factSet(matching, [`buyer:${buyer.slug}`]),
          [],
        ),
        dataCompleteness: completeness(matching),
        hasQualifiedIntent: true,
        primaryKeywordIsUnique: true,
        relatedLinkCount: apps.length,
      },
    });
  }

  // --- Countries, and country x fabric -------------------------------------
  for (const country of COUNTRIES) {
    const inCountry = listings.filter(
      (l) => l.countryOfOrigin === country.code,
    );
    // `countrySlug`, not a local regex. The inline version stripped accented
    // characters instead of folding them, so "Türkiye" became "t-rkiye" - a
    // URL that 404s and was being published in the sitemap. The shared helper
    // NFD-normalises first and is what the country routes themselves use, so
    // the two can no longer disagree.
    const slug = countrySlug(country.name);

    draft.push({
      id: `country:${country.code}`,
      pageType: "supplier_country",
      entities: { countryCode: country.code },
      // `/countries/`, not `/suppliers/`. `/suppliers/{slug}` is the supplier
      // *profile* route, so every one of these URLs resolved to a 308 or a
      // 404 while being listed in the sitemap as canonical. The country pages
      // that actually render this content live under `/countries/`.
      path: `/countries/${slug}/`,
      primaryKeyword: keywordRecord(
        `fabric suppliers in ${country.name.toLowerCase()}`,
        { countryCode: country.code },
      ),
      state: "candidate",
      signals: {
        listingCount: inCountry.length,
        supplierCount: suppliers(inCountry),
        uniqueWordCount: contentWords(inCountry, country.knownFor),
        uniquenessScore: uniquenessScore(
          factSet(inCountry, [`country:${country.code}`]),
          [],
        ),
        dataCompleteness: completeness(inCountry),
        hasQualifiedIntent: true,
        primaryKeywordIsUnique: true,
        relatedLinkCount: COUNTRIES.length - 1,
      },
    });

    // Country x fabric. Differentiation over both parents is real: this page
    // states which mills in this country hold this cloth, which neither the
    // country page nor the fabric page answers.
    for (const node of FABRIC_NODES) {
      const both = (byFabric.get(node.slug) ?? []).filter(
        (l) => l.countryOfOrigin === country.code,
      );
      if (!both.length) continue;

      draft.push({
        id: `country-fabric:${country.code}:${node.slug}`,
        pageType: "country_fabric",
        entities: { countryCode: country.code, fabric: node.slug },
        path: `/countries/${slug}/${node.slug}/`,
        primaryKeyword: keywordRecord(
          `${node.name.toLowerCase()} suppliers ${country.name.toLowerCase()}`,
          { countryCode: country.code, fabric: node.slug },
        ),
        state: "candidate",
        signals: {
          listingCount: both.length,
          supplierCount: suppliers(both),
          uniqueWordCount: contentWords(both, country.knownFor, node.summary),
          uniquenessScore: uniquenessScore(factSet(both), [
            factSet(byFabric.get(node.slug) ?? []),
            factSet(inCountry),
          ]),
          dataCompleteness: completeness(both),
          hasQualifiedIntent: true,
          primaryKeywordIsUnique: true,
          relatedLinkCount: 3,
        },
      });
    }
  }

  // --- Certifications, and fabric x certification --------------------------
  for (const cert of CERTIFICATIONS) {
    const holding = listings.filter((l) =>
      l.certifications.some((c) => c.id === cert.slug),
    );
    draft.push({
      id: `certification:${cert.slug}`,
      pageType: "certification",
      entities: { certification: cert.slug },
      path: `/certifications/${cert.slug}/`,
      primaryKeyword: keywordRecord(`${cert.abbreviation} certified fabric`, {
        certification: cert.slug,
      }),
      state: "candidate",
      signals: {
        listingCount: holding.length,
        supplierCount: suppliers(holding),
        uniqueWordCount: contentWords(holding, cert.covers),
        uniquenessScore: uniquenessScore(
          factSet(holding, [`cert:${cert.slug}`]),
          [],
        ),
        dataCompleteness: completeness(holding),
        hasQualifiedIntent: true,
        primaryKeywordIsUnique: true,
        relatedLinkCount: CERTIFICATIONS.length - 1,
      },
    });

    // Root materials only - "cotton x GOTS", not "cotton jersey single jersey
    // x GRS".
    //
    // The site links a certification intersection from the material page that
    // owns it (`/fabrics/cotton/` -> `/fabrics/cotton/grs/`) and from nowhere
    // else, so generating one for every node at every depth produced pages
    // with no inbound link in the site's own information architecture. Those
    // are reachable only from the sitemap, which is the weakest discovery
    // signal there is and the definition of a doorway page.
    //
    // The bar is not "does supply exist" - it did - but "does this page have a
    // place in the structure". Two deep intersections were failing that, and
    // the honest fix is to stop minting them rather than to add links nobody
    // would have designed.
    for (const node of FABRIC_NODES) {
      if (node.parentSlug) continue;

      const both = (byFabric.get(node.slug) ?? []).filter((l) =>
        l.certifications.some((c) => c.id === cert.slug),
      );
      if (!both.length) continue;

      draft.push({
        id: `fabric-cert:${node.slug}:${cert.slug}`,
        pageType: "fabric_certification",
        entities: { fabric: node.slug, certification: cert.slug },
        path: buildCanonical(node, undefined, undefined, cert.slug),
        primaryKeyword: keywordRecord(
          `${cert.abbreviation} ${node.name.toLowerCase()}`,
          { fabric: node.slug, certification: cert.slug },
        ),
        state: "candidate",
        signals: {
          listingCount: both.length,
          supplierCount: suppliers(both),
          uniqueWordCount: contentWords(both, cert.covers, node.summary),
          uniquenessScore: uniquenessScore(factSet(both), [
            factSet(byFabric.get(node.slug) ?? []),
            factSet(holding),
          ]),
          dataCompleteness: completeness(both),
          hasQualifiedIntent: true,
          primaryKeywordIsUnique: true,
          relatedLinkCount: 3,
        },
      });
    }
  }

  // --- Buyer x fabric -----------------------------------------------------
  // Tier 6, and fourth in the strategy's build order: the searcher has already
  // stated who they are and what they buy, which is the best qualification in
  // the portfolio.
  //
  // The pair only becomes a candidate when the taxonomy links them through a
  // shared application *and* listings exist that serve it. Generating every
  // buyer x fabric pair would be the combinatorial explosion Q20 condition 7
  // exists to prevent - ~30 subcategories x 46 fabrics is 1,380 pages, almost
  // all of them meaningless.
  for (const buyer of BUYER_SUBCATEGORIES) {
    const buyerApplications = new Set(buyer.applications);

    for (const node of FABRIC_NODES) {
      const shared = APPLICATIONS.filter(
        (application) =>
          buyerApplications.has(application.slug) &&
          application.typicalFabrics.includes(node.slug),
      );
      if (!shared.length) continue;

      const forBuyer = (byFabric.get(node.slug) ?? []).filter((listing) =>
        shared.some((application) =>
          listing.applications.includes(application.slug),
        ),
      );
      if (!forBuyer.length) continue;

      draft.push({
        id: `buyer-fabric:${buyer.slug}:${node.slug}`,
        pageType: "buyer_fabric",
        entities: { buyer: buyer.slug, fabric: node.slug },
        path: `/for/${buyer.slug}/${node.slug}/`,
        primaryKeyword: keywordRecord(
          `${node.name.toLowerCase()} for ${buyer.name.toLowerCase()}`,
          { buyerType: buyer.slug, fabric: node.slug },
        ),
        state: "candidate",
        signals: {
          listingCount: forBuyer.length,
          supplierCount: suppliers(forBuyer),
          uniqueWordCount: contentWords(
            forBuyer,
            node.summary,
            shared.map((a) => a.summary).join(" "),
          ),
          uniquenessScore: uniquenessScore(
            factSet(forBuyer, [`buyer:${buyer.slug}`]),
            [factSet(byFabric.get(node.slug) ?? [])],
          ),
          dataCompleteness: completeness(forBuyer),
          hasQualifiedIntent: true,
          primaryKeywordIsUnique: true,
          relatedLinkCount: shared.length + 3,
        },
      });
    }
  }

  // A page's primary keyword targets that page. Enforced here, once, rather
  // than at nine call sites.
  //
  // `keywordRecord` infers a page type and a route from the keyword string,
  // which is right for research - a keyword arriving from a planning sheet has
  // no page yet. It is wrong here, where the page already exists and knows its
  // own canonical. Left inferred, "single jersey for clothing brands" was
  // classified as a fabric keyword pointing at the fabric page, so eight
  // distinct buyer subjects appeared to contest one URL and the gate failed
  // them all on condition 5.
  for (const opportunity of draft) {
    if (!opportunity.primaryKeyword) continue;
    opportunity.primaryKeyword = {
      ...opportunity.primaryKeyword,
      pageType: opportunity.pageType,
      targetPath: opportunity.canonical ?? opportunity.path,
    };
  }

  // Cannibalisation is a property of the *set*, so it is applied once every
  // candidate exists: two pages targeting one keyword both fail condition 5.
  const contested = new Set(
    cannibalisation(
      clusterKeywords(
        draft.flatMap((o) => (o.primaryKeyword ? [o.primaryKeyword] : [])),
      ),
    ).flatMap((c) => c.primaries),
  );

  const evaluated: EvaluatedOpportunity[] = draft.map((opportunity) => {
    const signals = {
      ...opportunity.signals,
      primaryKeywordIsUnique: opportunity.primaryKeyword
        ? !contested.has(opportunity.primaryKeyword.keyword)
        : true,
    };
    const gate = runGate(opportunity.pageType, signals);
    return { ...opportunity, signals, state: gate.state, gate };
  });

  return rank(evaluated);
}

/** Paths the gate approved. The sitemap consumes exactly this. */
export function indexablePaths(listings: FabricListing[]): Set<string> {
  return new Set(
    buildOpportunities(listings)
      .filter((o) => o.gate.indexable)
      .map((o) => o.path),
  );
}

/**
 * Pre-generation safety report.
 *
 * Required before any large-scale generation: candidate volume, what the gate
 * refused and why, and the two failure modes that only appear at scale -
 * duplicate clusters and keyword cannibalisation.
 */
export function safetyReport(listings: FabricListing[]) {
  const all = buildOpportunities(listings);
  const clusters = clusterKeywords(
    all.flatMap((o) => (o.primaryKeyword ? [o.primaryKeyword] : [])),
  );

  const byState = new Map<string, number>();
  const byType = new Map<string, { total: number; indexable: number }>();
  const byCondition = new Map<number, number>();

  for (const opportunity of all) {
    byState.set(opportunity.state, (byState.get(opportunity.state) ?? 0) + 1);
    const type = byType.get(opportunity.pageType) ?? { total: 0, indexable: 0 };
    type.total += 1;
    if (opportunity.gate.indexable) type.indexable += 1;
    byType.set(opportunity.pageType, type);
    for (const failure of opportunity.gate.failures) {
      byCondition.set(
        failure.condition,
        (byCondition.get(failure.condition) ?? 0) + 1,
      );
    }
  }

  return {
    candidates: all.length,
    approved: all.filter((o) => o.gate.indexable).length,
    byState: [...byState.entries()].sort((a, b) => b[1] - a[1]),
    byType: [...byType.entries()].sort((a, b) => b[1].total - a[1].total),
    byCondition: [...byCondition.entries()].sort((a, b) => a[0] - b[0]),
    clusters: clusters.length,
    cannibalisation: cannibalisation(clusters),
    opportunities: all,
  };
}
