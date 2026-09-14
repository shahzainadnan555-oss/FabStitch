import type { Slug } from "@/domain/types";
import type { KeywordRecord, PageType } from "./keywords";
import { buildPriority } from "./tiers";
import type { GateDecision, GateSignals, PageState } from "./gate";

/**
 * Page opportunities.
 *
 * The gate itself now lives in `gate.ts`, built to the seven conditions in the
 * FabStitch strategy document (Q20). This file carries the record shape and
 * the ordering, and deliberately holds no thresholds of its own - two gates
 * disagreeing about the same page is worse than one strict gate.
 */

export type { GateDecision, GateSignals, PageState } from "./gate";

export type PageOpportunity = {
  id: string;
  pageType: PageType;
  /** Entity ids this page is built from. */
  entities: Record<string, Slug | number | string | undefined>;
  path: string;
  /** The canonical this page points at. Differs from `path` for variants. */
  canonical?: string;
  primaryKeyword?: KeywordRecord;
  secondaryKeywords?: KeywordRecord[];
  signals: GateSignals;
  state: PageState;
};

export type EvaluatedOpportunity = PageOpportunity & { gate: GateDecision };

/**
 * Ordering.
 *
 * **Tier first, evidence second.** The research is explicit that build order
 * is not volume order (Q23): "as a query gets more specific its volume falls
 * and its value rises". So a specification page outranks a broad fabric page
 * even with less supply behind it, because the buyer typing a GSM number has
 * already decided to buy.
 *
 * Search demand is absent from this entirely. No keyword research with volume
 * data has been imported - the strategy document in the repository is
 * architecture, not a dataset - so weighting demand would produce an ordering
 * that looks measured and is not.
 */
export type PriorityWeights = {
  supply: number;
  suppliers: number;
  connectivity: number;
  completeness: number;
  /** Only meaningful once volume data exists. Zero until then. */
  demand: number;
};

export const DEFAULT_WEIGHTS: PriorityWeights = {
  supply: 3,
  suppliers: 2,
  connectivity: 1,
  completeness: 10,
  demand: 0,
};

export function evidenceScore(
  opportunity: PageOpportunity,
  weights: PriorityWeights = DEFAULT_WEIGHTS,
): number {
  const { signals, primaryKeyword } = opportunity;
  return Math.round(
    signals.listingCount * weights.supply +
      signals.supplierCount * weights.suppliers +
      signals.relatedLinkCount * weights.connectivity +
      signals.dataCompleteness * weights.completeness +
      (primaryKeyword?.metrics?.monthlySearches ?? 0) * weights.demand,
  );
}

/** Sorts by build tier, then by evidence. Stable within equal scores. */
export function rank<T extends PageOpportunity>(
  opportunities: T[],
  weights?: PriorityWeights,
): T[] {
  return [...opportunities]
    .map((opportunity, index) => ({ opportunity, index }))
    .sort((a, b) => {
      const tier =
        buildPriority(a.opportunity.pageType) -
        buildPriority(b.opportunity.pageType);
      if (tier !== 0) return tier;
      const evidence =
        evidenceScore(b.opportunity, weights) -
        evidenceScore(a.opportunity, weights);
      return evidence !== 0 ? evidence : a.index - b.index;
    })
    .map((entry) => entry.opportunity);
}
