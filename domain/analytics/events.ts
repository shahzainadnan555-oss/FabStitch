/**
 * Analytics event contract.
 *
 * §29 asks for "a clean event architecture for future analytics" and then adds
 * the constraint that decides the whole design: *"Only implement events that
 * correspond to real functionality. Do not generate fake analytics."*
 *
 * So this file defines the **shape** of every event the marketplace can
 * honestly emit, and nothing more. There is no collector, because there is no
 * endpoint to collect to - the live OpenAPI has no `/analytics`, `/events` or
 * `/telemetry` route. `track()` therefore validates and drops.
 *
 * That is deliberately not the same as doing nothing:
 *
 *   - The event names, payloads and required fields are settled now, so the
 *     backend has a specification to build against rather than a guess.
 *   - Call sites are written once. When the endpoint lands, one function body
 *     changes and every event starts flowing with no page edits.
 *   - `EVENT_STATUS` records which events correspond to functionality that
 *     actually exists today, so nobody builds a dashboard on an event that can
 *     never fire.
 *
 * Every event carries the entity it is about, because an event without one is
 * a page view with extra steps: "search" without the query, or "fabric_view"
 * without the fabric, cannot answer a single question in §30.
 */

export type EventName =
  | "search"
  | "search_zero_result"
  | "search_result_click"
  | "fabric_view"
  | "supplier_view"
  | "listing_view"
  | "compare"
  | "save"
  | "rfq_start"
  | "rfq_submit"
  | "sample_request"
  | "quote_received"
  | "order_started"
  | "order_completed";

/**
 * Whether the functionality behind an event exists in the frontend today.
 *
 * `live` - the interaction exists and the event would fire.
 * `frontend_only` - the UI exists but the outcome depends on a backend that
 *   does not report it, so the event can be emitted but never confirmed.
 * `not_built` - the journey does not exist yet. Listed so the contract is
 *   complete, never so a dashboard can imply the feature ships.
 */
export const EVENT_STATUS: Record<
  EventName,
  "live" | "frontend_only" | "not_built"
> = {
  search: "live",
  search_zero_result: "live",
  search_result_click: "live",
  fabric_view: "live",
  supplier_view: "live",
  listing_view: "live",
  compare: "live",
  save: "live",
  rfq_start: "live",
  rfq_submit: "frontend_only",
  sample_request: "frontend_only",
  quote_received: "not_built",
  order_started: "not_built",
  order_completed: "not_built",
};

type Entity = { type: string; slug: string };

export type EventPayloads = {
  search: {
    query: string;
    resultCount: number;
    filters?: Record<string, string>;
  };
  search_zero_result: { query: string; filters?: Record<string, string> };
  search_result_click: { query: string; listingSlug: string; position: number };
  fabric_view: { fabricSlug: string; path: string; listingCount: number };
  supplier_view: { supplierSlug: string };
  listing_view: { listingSlug: string; supplierSlug: string };
  compare: { fabricSlugs: string[] };
  save: { entity: Entity };
  rfq_start: { origin: string; entity?: Entity };
  rfq_submit: { rfqId: string; fabricSlug?: string; quantity?: number };
  sample_request: { listingSlug: string };
  quote_received: { rfqId: string; supplierSlug: string };
  order_started: { quoteId: string };
  order_completed: { orderId: string };
};

export type MarketplaceEvent<K extends EventName = EventName> = {
  name: K;
  payload: EventPayloads[K];
  /** ISO timestamp. Supplied by the caller so this module stays pure. */
  at: string;
};

/**
 * Records an event.
 *
 * **Not implemented, and deliberately not faked.** Returns whether the event
 * *would* have been sent, so a caller can be tested without a network.
 *
 * Future dependency: an approved event-intake service accepting
 * `MarketplaceEvent`.
 * Until it exists this validates the payload and drops it - which still catches
 * a malformed call site at the point it is written rather than months later.
 */
export function track<K extends EventName>(
  event: MarketplaceEvent<K>,
): boolean {
  if (!(event.name in EVENT_STATUS)) return false;
  if (EVENT_STATUS[event.name] === "not_built") return false;

  if (process.env.NODE_ENV === "development") {
    console.info("[fabstitch] event", event.name, event.payload);
  }
  // No transport. See the note above before adding one.
  return true;
}

/** Events whose underlying journey exists. What a dashboard may honestly show. */
export function liveEvents(): EventName[] {
  return (Object.keys(EVENT_STATUS) as EventName[]).filter(
    (name) => EVENT_STATUS[name] === "live",
  );
}
