import { buildSeedRecords } from "./seeds";
import { SEED_ROWS_REST } from "./seeds-rest";
import { SEED_ROWS_24_50 } from "./seeds-24-50";
import { SEED_ROWS_51_80 } from "./seeds-51-80";
import { SEED_ROWS_81_100 } from "./seeds-81-100";
import type { SeedRecord } from "./types";

export const SEED_RECORDS: readonly SeedRecord[] = buildSeedRecords([
  ...SEED_ROWS_REST,
  ...SEED_ROWS_24_50,
  ...SEED_ROWS_51_80,
  ...SEED_ROWS_81_100,
]);

if (SEED_RECORDS.length !== 100) {
  throw new Error(`Expected 100 seed records, got ${SEED_RECORDS.length}`);
}

const ids = new Set(SEED_RECORDS.map((seed) => seed.id));
if (ids.size !== 100) {
  throw new Error("Seed ids are not unique 1–100");
}

export const SEED_BY_ID: Readonly<Record<number, SeedRecord>> = Object.freeze(
  Object.fromEntries(SEED_RECORDS.map((seed) => [seed.id, seed])),
);

export const SEED_BY_SLUG: Readonly<Record<string, SeedRecord>> = Object.freeze(
  Object.fromEntries(SEED_RECORDS.map((seed) => [seed.slug, seed])),
);
