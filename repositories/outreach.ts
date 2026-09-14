/**
 * Frontend-only outreach contracts.
 *
 * **Everything here is admin-only and must stay that way.** Contact names,
 * addresses, personalisation notes, prospect scoring and campaign performance
 * are internal working notes about other people. Several of them exist only
 * because somebody supplied them in confidence, and none of them belongs on a
 * public page, in a sitemap, or in structured data. The routes live under
 * `/admin/*` on both sides and the pages that render them are noindexed.
 *
 * Failures collapse to an empty shape with `available: false` rather than
 * throwing. The growth endpoints are operational: a console that 500s because
 * the backend is restarting is worse than one that says it could not read.
 */

export type CampaignCounts = {
  prospects: number;
  contactable: number;
  contacted: number;
  responded: number;
  placed_claimed: number;
  placements_verified: number;
  placements_lost: number;
  declined: number;
  suppressed_or_rejected: number;
};

export type CampaignRates = {
  /** Null when nothing has been contacted. Never rendered as 0%. */
  response_rate: number | null;
  placement_rate: number | null;
  verification_rate: number | null;
  denominators: Record<string, number>;
};

export type Campaign = {
  campaign_id: string;
  slug: string;
  name: string;
  campaign_type: string;
  status: string;
  counts: CampaignCounts;
  rates: CampaignRates;
  note: string;
};

export type CampaignOverview = {
  campaigns: Campaign[];
  totals: {
    campaigns: number;
    running: number;
    prospects: number;
    contacted: number;
    verified_placements: number;
    overall_placement_rate: number | null;
  };
  note: string;
  available: boolean;
};

export type PlacementSummary = {
  placements: number;
  by_status: Record<string, number>;
  verified_links: number;
  verified_referring_domains: number;
  followed: number;
  nofollow_or_sponsored: number;
  lost: number;
  unverified_claims: number;
  referring_domains: string[];
  note: string;
  available: boolean;
};

export type AnchorProfile = {
  verified_placements: number;
  distribution: Record<string, { count: number; share: number }>;
  followed?: number;
  nofollow_or_sponsored?: number;
  warnings: string[];
  ceilings?: Record<string, number>;
  note: string;
  available: boolean;
};

export type SuppressionEntry = {
  domain: string;
  email: string | null;
  reason: string;
  scope: string;
  permanent: boolean;
  source: string | null;
  recorded_at: string | null;
};

export type SuppressionList = {
  total: number;
  entries: SuppressionEntry[];
  available: boolean;
};

export type OutreachEvent = {
  action: string;
  domain: string;
  campaign_id: string | null;
  prospect_id: string | null;
  actor: string | null;
  blocked_reason: string | null;
  occurred_at: string | null;
  detail: Record<string, string>;
};

export type OutreachLog = {
  total: number;
  events: OutreachEvent[];
  available: boolean;
};

/**
 * One read, one fallback. `available: false` is the console's way of saying
 * "the backend did not answer", which must never look the same as "there is
 * nothing here" - a growth dashboard that renders zeroes during an outage
 * produces exactly the wrong decision.
 */
export async function campaignOverview(): Promise<CampaignOverview> {
  return {
    campaigns: [],
    totals: {
      campaigns: 0,
      running: 0,
      prospects: 0,
      contacted: 0,
      verified_placements: 0,
      overall_placement_rate: null,
    },
    note: "Frontend preview only. No outreach records are connected.",
    available: false,
  };
}

export async function placementSummary(): Promise<PlacementSummary> {
  return {
    placements: 0,
    by_status: {},
    verified_links: 0,
    verified_referring_domains: 0,
    followed: 0,
    nofollow_or_sponsored: 0,
    lost: 0,
    unverified_claims: 0,
    referring_domains: [],
    note: "Frontend preview only. No placement records are connected.",
    available: false,
  };
}

export async function anchorProfile(): Promise<AnchorProfile> {
  return {
    verified_placements: 0,
    distribution: {},
    warnings: [],
    note: "Frontend preview only. No anchor records are connected.",
    available: false,
  };
}

export async function suppressionList(): Promise<SuppressionList> {
  return { total: 0, entries: [], available: false };
}

export async function outreachLog(): Promise<OutreachLog> {
  return { total: 0, events: [], available: false };
}
