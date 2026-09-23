/**
 * Quantity validation regression for inquiry form rules.
 *
 *   node --import=./scripts/register-loader.mjs scripts/qa/inquiry-quantity.mts
 */
import assert from "node:assert/strict";
import {
  INQUIRY_QUANTITY_MAX_ERROR,
  INQUIRY_QUANTITY_MAX_METERS,
  parseQuantity,
  quantityFieldError,
  validateInquiryContact,
} from "@/features/inquiries/contact";

assert.equal(INQUIRY_QUANTITY_MAX_METERS, 500_000);

const accepted = [
  "1",
  "10",
  "1000",
  "10000",
  "100000",
  "250000",
  "499999",
  "500000",
  "0.5",
  "12.25",
];
for (const value of accepted) {
  assert.notEqual(
    parseQuantity(value),
    null,
    `expected ${value} to be accepted`,
  );
  assert.equal(
    quantityFieldError(value),
    undefined,
    `expected no error for ${value}`,
  );
}

const rejected = [
  "",
  "0",
  "-1",
  "500001",
  "600000",
  "1000000",
  "abc",
  "500,000",
];
for (const value of rejected) {
  assert.equal(parseQuantity(value), null, `expected ${value} to be rejected`);
}

assert.equal(quantityFieldError("500001"), INQUIRY_QUANTITY_MAX_ERROR);
assert.equal(quantityFieldError("1000000"), INQUIRY_QUANTITY_MAX_ERROR);
assert.equal(quantityFieldError("0"), "Enter a valid quantity.");

const over = validateInquiryContact({
  quantity: "500001",
  email: "test@example.com",
  country: "US",
  phone: "+15551234567",
  name: "Shahzain Ali",
  nameRequired: true,
});
assert.equal(over.quantity, INQUIRY_QUANTITY_MAX_ERROR);

const ok = validateInquiryContact({
  quantity: "500000",
  email: "test@example.com",
  country: "US",
  phone: "+15551234567",
  name: "Shahzain Ali",
  nameRequired: true,
});
assert.equal(ok.quantity, undefined);

console.log(
  JSON.stringify(
    {
      maxMeters: INQUIRY_QUANTITY_MAX_METERS,
      accepted: accepted.length,
      rejected: rejected.length,
      passed: true,
    },
    null,
    2,
  ),
);
