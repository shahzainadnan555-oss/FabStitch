import assert from "node:assert/strict";
import { api } from "@/lib/api/client";
import type {
  BestForCard,
  CollectionCard,
  Country,
  Currency,
  Discovery,
  FabricFilters,
  FabricPage,
  SeoRouteClass,
  SeoSitemapIndex,
} from "@/lib/api/types";

const checks: Array<{ endpoint: string; durationMs: number }> = [];

async function check<T>(endpoint: string, run: () => Promise<T>): Promise<T> {
  const startedAt = performance.now();
  const value = await run();
  checks.push({
    endpoint,
    durationMs: Math.round(performance.now() - startedAt),
  });
  return value;
}

const countries = await check("/countries", () =>
  api.get<{ items: Country[] }>("/countries"),
);
assert.equal(countries.items.length, 7);

const currencies = await check("/currencies", () =>
  api.get<{ items: Currency[] }>("/currencies"),
);
assert.equal(currencies.items.length, 7);

const fabrics = await check("/fabrics", () =>
  api.get<FabricPage>("/fabrics", {
    query: { limit: 2, fiber: ["cotton", "linen"] },
    signal: AbortSignal.timeout(30_000),
  }),
);
assert(fabrics.items.length <= 2);
assert.equal(fabrics.limit, 2);
if (fabrics.has_more) assert(fabrics.next_cursor);

const filters = await check("/fabrics/filters", () =>
  api.get<FabricFilters>("/fabrics/filters", {
    signal: AbortSignal.timeout(30_000),
  }),
);
assert(Array.isArray(filters.fibers));

const collections = await check("/collections", () =>
  api.get<CollectionCard[]>("/collections"),
);
assert(Array.isArray(collections));

const bestFor = await check("/best-for", () =>
  api.get<BestForCard[]>("/best-for"),
);
assert(Array.isArray(bestFor));

const discovery = await check("/me/discovery", () =>
  api.get<Discovery>("/me/discovery", {
    signal: AbortSignal.timeout(30_000),
  }),
);
assert(Array.isArray(discovery.sections));

const sitemap = await check("/seo/sitemap/index", () =>
  api.get<SeoSitemapIndex>("/seo/sitemap/index"),
);
assert(sitemap.total_urls >= 0);

const routeClasses = await check("/seo/route-classes", () =>
  api.get<SeoRouteClass[]>("/seo/route-classes"),
);
assert(routeClasses.length > 0);

const serializedPublicCatalog = JSON.stringify(fabrics).toLowerCase();
for (const privateField of [
  "supplier_email",
  "supplier_phone",
  "supplier_documents",
  "supplier_notes",
  "supplier_score",
]) {
  assert(
    !serializedPublicCatalog.includes(`"${privateField}"`),
    `Public catalog exposed ${privateField}`,
  );
}

console.log(JSON.stringify({ checks }, null, 2));
