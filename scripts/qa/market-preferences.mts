import assert from "node:assert/strict";
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_MARKETS,
  defaultCurrencyForCountry,
  isCountryCode,
  isCurrencyCode,
} from "../../features/preferences/market";

const expected = [
  ["US", "United States", "USD"],
  ["GB", "United Kingdom", "GBP"],
  ["TR", "Turkey", "TRY"],
  ["PK", "Pakistan", "PKR"],
  ["IN", "India", "INR"],
  ["BD", "Bangladesh", "BDT"],
  ["SG", "Singapore", "SGD"],
] as const;

assert.deepEqual(
  SUPPORTED_MARKETS.map((market) => [
    market.countryCode,
    market.countryName,
    market.defaultCurrency,
  ]),
  expected,
);
assert.deepEqual(
  SUPPORTED_CURRENCIES,
  expected.map((market) => market[2]),
);

for (const [country, , currency] of expected) {
  assert.equal(isCountryCode(country), true);
  assert.equal(isCurrencyCode(currency), true);
  assert.equal(defaultCurrencyForCountry(country), currency);
}

for (const unsupported of ["CA", "CN", "EUR", "", null, undefined]) {
  assert.equal(isCountryCode(unsupported), false);
  assert.equal(isCurrencyCode(unsupported), false);
}

console.log(
  `Market preferences: ${SUPPORTED_MARKETS.length} countries, ${SUPPORTED_CURRENCIES.length} currencies, all mappings valid.`,
);
