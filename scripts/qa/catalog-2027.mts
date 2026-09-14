import assert from "node:assert/strict";
import { api } from "@/lib/api/client";
import type {
  BestFor,
  BestForCard,
  Collection,
  CollectionCard,
  Discovery,
  Fabric,
  FabricCard,
  FabricFilters,
  FabricPage,
  RecommendationPage,
} from "@/lib/api/types";

const firstPage = await api.get<FabricPage>("/fabrics", {
  query: { limit: 24 },
  signal: AbortSignal.timeout(30_000),
});
assert(firstPage.items.length <= 24);
assert.equal(firstPage.limit, 24);
if (firstPage.has_more) assert(firstPage.next_cursor);

if (firstPage.next_cursor) {
  const nextPage = await api.get<FabricPage>("/fabrics", {
    query: { limit: 24, cursor: firstPage.next_cursor },
    signal: AbortSignal.timeout(30_000),
  });
  assert(nextPage.items.length <= 24);
  const overlap = firstPage.items.filter((item) =>
    nextPage.items.some((other) => other.id === item.id),
  );
  assert.equal(overlap.length, 0, "cursor pages must not repeat items");
}

const filters = await api.get<FabricFilters>("/fabrics/filters", {
  signal: AbortSignal.timeout(30_000),
});
assert(Array.isArray(filters.fibers));

for (const term of ["cotton", "linen", "silk"]) {
  const results = await api.get<FabricPage>("/fabrics/search", {
    query: { q: term, limit: 8 },
    signal: AbortSignal.timeout(30_000),
  });
  assert(Array.isArray(results.items), `search "${term}" must return items`);
}

const collections = await api.get<CollectionCard[]>("/collections");
assert(Array.isArray(collections));
for (const collection of collections.slice(0, 3)) {
  const detail = await api.get<Collection>(
    `/collections/${encodeURIComponent(collection.slug)}`,
    { query: { limit: 8 } },
  );
  assert.equal(detail.slug, collection.slug);
}

const bestFor = await api.get<BestForCard[]>("/best-for");
assert(Array.isArray(bestFor));
for (const useCase of bestFor.slice(0, 3)) {
  const detail = await api.get<BestFor>(
    `/best-for/${encodeURIComponent(useCase.slug)}`,
    { query: { limit: 8 } },
  );
  assert.equal(detail.slug, useCase.slug);
}

const sorted = await api.get<FabricPage>("/fabrics", {
  query: { sort: "name_asc", limit: 24 },
  signal: AbortSignal.timeout(30_000),
});
assert.deepEqual(
  sorted.items.map((fabric) => fabric.name),
  [...sorted.items.map((fabric) => fabric.name)].sort((a, b) =>
    a.localeCompare(b),
  ),
  "name sort is deterministic",
);

for (const fabric of firstPage.items.slice(0, 8)) {
  const [detail, related] = await Promise.all([
    api.get<Fabric>(`/fabrics/${encodeURIComponent(fabric.slug)}`),
    api.get<FabricCard[]>(
      `/fabrics/${encodeURIComponent(fabric.slug)}/related`,
      { query: { limit: 6 } },
    ),
  ]);
  assert.equal(detail.slug, fabric.slug);
  assert(Array.isArray(related));
  const serialized = JSON.stringify(detail).toLowerCase();
  assert.ok(
    !serialized.includes("supplier_email"),
    `${fabric.slug} leaks supplier email`,
  );
  assert.ok(
    !serialized.includes("supplier_phone"),
    `${fabric.slug} leaks supplier phone`,
  );
}

const [discovery, recommended] = await Promise.all([
  api.get<Discovery>("/me/discovery", { signal: AbortSignal.timeout(30_000) }),
  api.get<RecommendationPage>("/me/recommendations", {
    query: { limit: 12 },
    signal: AbortSignal.timeout(30_000),
  }),
]);
assert(Array.isArray(discovery.sections));
assert(Array.isArray(recommended.items));

console.log(
  JSON.stringify(
    {
      firstPageCount: firstPage.items.length,
      total: firstPage.total ?? null,
      hasMore: firstPage.has_more,
      collections: collections.length,
      bestFor: bestFor.length,
      discoverySections: discovery.sections.length,
      recommended: recommended.items.length,
    },
    null,
    2,
  ),
);
