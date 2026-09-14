import type { FabricListing } from "@/domain/types";
import type { EvaluatedOpportunity } from "@/domain/seo/opportunities";

/**
 * Page lifecycle: performance, pruning and refresh.
 *
 * §6, §7 and §8 are one system seen from three angles - a page is evaluated,
 * and the evaluation says improve it, merge it, leave it, or stop offering it
 * for indexing.
 *
 * **The honest constraint.** §6 asks pages to be judged on traffic, engagement,
 * search visibility and conversion. FabStitch has none of that: no analytics
 * backend, no Search Console connection, no traffic history. Scoring pages on
 * invented numbers would produce a maintenance system that confidently deletes
 * the wrong pages, which is worse than having none.
 *
 * So this module splits the evaluation in two, explicitly:
 *
 *   `PageEvidence` - what is measurable **today**, from the catalogue and the
 *   taxonomy: supply, supplier depth, data completeness, internal links,
 *   content volume, uniqueness.
 *
 *   `TrafficEvidence` - what needs a backend. Optional on every function. When
 *   it is absent the recommendations are made from structure alone and say so;
 *   when it arrives, the same functions weigh it without a rewrite.
 *
 * §7's rule is enforced structurally rather than by convention: **nothing here
 * can return `remove`.** Removal is a human decision about a real URL with
 * possible inbound links, and a maintenance system that automates it will
 * eventually automate a mistake.
 */

export type TrafficEvidence = {
  impressions?: number;
  clicks?: number;
  /** Distinct sessions that reached the page. */
  sessions?: number;
  /** RFQs started from this page. The only conversion that matters. */
  rfqStarts?: number;
  /** Average position in search results. */
  position?: number;
};

export type PageEvidence = {
  path: string;
  pageType: string;
  listings: number;
  suppliers: number;
  /** 0-1 mean field completeness of the listings behind it. */
  completeness: number;
  uniqueWords: number;
  uniqueness: number;
  internalLinksIn: number;
  indexable: boolean;
};

export type Recommendation =
  /** Leave it. It is doing its job. */
  | "keep"
  /** Real supply, weak content. Writing helps. */
  | "improve"
  /** Too close to a sibling to justify a separate URL. */
  | "merge"
  /** Publishable the moment supply arrives. Nothing to do but sell. */
  | "await_supply"
  /** Stop offering it for indexing; keep it rendering and crawlable. */
  | "noindex"
  /** Cannot be judged without data that does not exist yet. */
  | "needs_data";

export type PageVerdict = {
  path: string;
  recommendation: Recommendation;
  reason: string;
  /** Whether traffic data was available to this decision. */
  basis: "structure_only" | "structure_and_traffic";
  evidence: PageEvidence;
};

/* ==========================================================================
   Evaluation
   ========================================================================== */

export function evidenceFor(
  opportunity: EvaluatedOpportunity,
  internalLinksIn = 0,
): PageEvidence {
  return {
    path: opportunity.path,
    pageType: opportunity.pageType,
    listings: opportunity.signals.listingCount,
    suppliers: opportunity.signals.supplierCount,
    completeness: opportunity.signals.dataCompleteness,
    uniqueWords: opportunity.signals.uniqueWordCount,
    uniqueness: opportunity.signals.uniquenessScore,
    internalLinksIn,
    indexable: opportunity.gate.indexable,
  };
}

export function evaluatePage(
  evidence: PageEvidence,
  traffic?: TrafficEvidence,
): PageVerdict {
  const basis = traffic ? "structure_and_traffic" : "structure_only";
  const verdict = (recommendation: Recommendation, reason: string) => ({
    path: evidence.path,
    recommendation,
    reason,
    basis: basis as PageVerdict["basis"],
    evidence,
  });

  // Structure first - it is the evidence that always exists.

  // No supply. Nothing about the page can be fixed by editing it.
  if (evidence.listings === 0) {
    return verdict(
      "await_supply",
      "no listings; the page is complete but the marketplace cannot answer it yet. Fixed by supplier acquisition, not by writing.",
    );
  }

  // Too similar to a sibling to deserve its own URL. This is the one case where
  // consolidation genuinely beats improvement.
  if (evidence.uniqueness < 0.5) {
    return verdict(
      "merge",
      `uniqueness ${evidence.uniqueness.toFixed(2)} against its siblings - it restates a neighbouring page rather than adding to it.`,
    );
  }

  // Supply exists and the page is distinct, but there is not enough on it.
  if (evidence.listings >= 3 && evidence.uniqueWords < 150) {
    return verdict(
      "improve",
      `${evidence.listings} listings but only ${evidence.uniqueWords} words of page-specific content. Real supply behind a page that does not describe it.`,
    );
  }

  if (evidence.completeness < 0.7 && evidence.listings >= 3) {
    return verdict(
      "improve",
      `listing completeness ${Math.round(evidence.completeness * 100)}% - the listings cannot answer the question the page ranks for. Chase suppliers for missing fields.`,
    );
  }

  // Indexable, supplied, distinct - and nobody links to it. An orphan ranks for
  // nothing regardless of how good it is.
  if (evidence.indexable && evidence.internalLinksIn === 0) {
    return verdict(
      "improve",
      "indexable but no internal links point at it. Add it to the relations that already describe it.",
    );
  }

  // Structure says the page is fine. Whether it *performs* is a traffic
  // question, and answering it without traffic data would be a guess.
  if (!traffic) {
    return verdict(
      "keep",
      "passes every structural check. Traffic, engagement and conversion cannot be assessed - no analytics backend is connected.",
    );
  }

  return evaluateWithTraffic(evidence, traffic, verdict);
}

function evaluateWithTraffic(
  evidence: PageEvidence,
  traffic: TrafficEvidence,
  verdict: (r: Recommendation, reason: string) => PageVerdict,
): PageVerdict {
  const { impressions = 0, clicks = 0, rfqStarts = 0 } = traffic;

  // High impressions, low clicks: the page ranks and the result does not
  // persuade. A title and description problem, not a supply problem.
  if (impressions >= 100 && clicks / Math.max(1, impressions) < 0.01) {
    return verdict(
      "improve",
      `${impressions} impressions at ${((clicks / impressions) * 100).toFixed(1)}% CTR - it ranks but the snippet does not earn the click.`,
    );
  }

  // Traffic arriving, nothing sourced. The page attracts the wrong buyer or
  // fails to make the next step obvious.
  if (clicks >= 50 && rfqStarts === 0) {
    return verdict(
      "improve",
      `${clicks} clicks and no RFQ started - the page attracts visitors it does not convert.`,
    );
  }

  // No visibility at all despite being indexable and supplied. Worth noindexing
  // to concentrate crawl budget - never deleting.
  if (evidence.indexable && impressions === 0 && evidence.listings < 5) {
    return verdict(
      "noindex",
      "indexable for a full reporting period with zero impressions and thin supply. Keep it rendering and crawlable; stop submitting it.",
    );
  }

  return verdict("keep", "performing; supply, content and demand all present.");
}

/* ==========================================================================
   Refresh
   ========================================================================== */

export type RefreshTrigger =
  | "new_listings"
  | "lost_listings"
  | "new_certification"
  | "new_supplier"
  | "crossed_gate_threshold"
  | "fell_below_gate_threshold";

export type RefreshSignal = {
  path: string;
  trigger: RefreshTrigger;
  detail: string;
};

/**
 * What changed since the last snapshot.
 *
 * Content should evolve with the marketplace (§8), and the only trustworthy
 * trigger for that is the marketplace itself changing. Comparing two catalogue
 * snapshots gives an exact answer where a heuristic ("older than 90 days")
 * gives a guess - a page nothing has changed behind does not need rewriting
 * however old it is.
 */
export function refreshSignals(
  previous: EvaluatedOpportunity[],
  current: EvaluatedOpportunity[],
): RefreshSignal[] {
  const before = new Map(previous.map((o) => [o.path, o]));
  const signals: RefreshSignal[] = [];

  for (const now of current) {
    const then = before.get(now.path);
    if (!then) continue;

    const delta = now.signals.listingCount - then.signals.listingCount;
    if (delta > 0) {
      signals.push({
        path: now.path,
        trigger: "new_listings",
        detail: `${delta} new listing${delta === 1 ? "" : "s"} (${then.signals.listingCount} → ${now.signals.listingCount})`,
      });
    } else if (delta < 0) {
      signals.push({
        path: now.path,
        trigger: "lost_listings",
        detail: `${-delta} listing${delta === -1 ? "" : "s"} withdrawn (${then.signals.listingCount} → ${now.signals.listingCount})`,
      });
    }

    if (now.signals.supplierCount > then.signals.supplierCount) {
      signals.push({
        path: now.path,
        trigger: "new_supplier",
        detail: `${then.signals.supplierCount} → ${now.signals.supplierCount} suppliers`,
      });
    }

    if (!then.gate.indexable && now.gate.indexable) {
      signals.push({
        path: now.path,
        trigger: "crossed_gate_threshold",
        detail: "now passes the gate - review the copy before it is submitted",
      });
    } else if (then.gate.indexable && !now.gate.indexable) {
      signals.push({
        path: now.path,
        trigger: "fell_below_gate_threshold",
        detail: `no longer passes: ${now.gate.failures.map((f) => f.reason).join("; ")}`,
      });
    }
  }

  return signals;
}

/** Listings whose data has gone stale enough to weaken every page they sit on. */
export function stalest(listings: FabricListing[], limit = 10) {
  return [...listings]
    .filter((listing) => listing.updatedAt)
    .sort((a, b) => (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""))
    .slice(0, limit)
    .map((listing) => ({
      slug: listing.slug,
      name: listing.name,
      supplier: listing.supplier.companyName,
      updatedAt: listing.updatedAt,
    }));
}
