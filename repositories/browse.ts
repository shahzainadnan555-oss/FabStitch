import { COUNTRIES } from "@/domain/taxonomy/buyers";

export type CountryRow = {
  code: string;
  name: string;
  listings: number;
  suppliers: number;
};

/**
 * The local product catalogue does not claim origin-specific availability.
 * Zero here means no local commercial listing record, not zero production.
 */
export async function listCountryDirectory(): Promise<CountryRow[]> {
  return COUNTRIES.map((country) => ({
    code: country.code,
    name: country.name,
    listings: 0,
    suppliers: 0,
  }));
}
