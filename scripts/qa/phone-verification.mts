/**
 * Phone verification unit checks (no network).
 * Run: node --import=./scripts/register-loader.mjs scripts/qa/phone-verification.mts
 */
import assert from "node:assert/strict";
import {
  PHONE_COUNTRIES,
  PHONE_POPULAR_ISOS,
  assertNoIsraelInPhoneCountries,
  phoneCountryByIso,
  searchPhoneCountries,
} from "@/features/phone/countries";
import {
  isValidPhoneForCountry,
  maskPhoneDisplay,
  splitE164,
  toE164,
} from "@/features/phone/format";
import { isPhoneVerified } from "@/features/phone/api";
import {
  phoneSendErrorMessage,
  phoneVerifyErrorMessage,
} from "@/features/phone/messages";
import { ApiError } from "@/lib/api/errors";

assertNoIsraelInPhoneCountries();
assert.equal(
  PHONE_COUNTRIES.some((row) => row.iso === "IL" || row.dialCode === "+972"),
  false,
  "Israel must be excluded",
);

assert.ok(PHONE_COUNTRIES.length > 100, "expected a broad Twilio SMS country set");
assert.ok(phoneCountryByIso("PK"));
assert.ok(phoneCountryByIso("US"));
assert.ok(phoneCountryByIso("CN"), "China should be included for Verify SMS");
assert.equal(phoneCountryByIso("IL"), undefined);

for (const iso of PHONE_POPULAR_ISOS) {
  assert.ok(phoneCountryByIso(iso), `missing popular market ${iso}`);
}

const pakistanHits = searchPhoneCountries("Pakistan");
assert.ok(pakistanHits.some((row) => row.iso === "PK"));
const plusHits = searchPhoneCountries("+92");
assert.ok(plusHits.some((row) => row.iso === "PK"));
const codeHits = searchPhoneCountries("92");
assert.ok(codeHits.some((row) => row.iso === "PK"));

assert.equal(toE164("3001234567", "PK"), "+923001234567");
assert.equal(toE164("03001234567", "PK"), "+923001234567");
assert.equal(toE164("7911123456", "GB"), "+447911123456");
assert.equal(toE164("+923001234567", "PK"), "+923001234567");
assert.equal(isValidPhoneForCountry("12", "PK"), false);
assert.equal(toE164("501234567", "IL"), null);

const split = splitE164("+923001234567", "US");
assert.equal(split.iso, "PK");
assert.equal(split.national, "3001234567");

const masked = maskPhoneDisplay("+923001234567");
assert.ok(masked.includes("***"));
assert.ok(!masked.includes("1234567"));

assert.equal(
  isPhoneVerified({ phone: "+923001234567", phone_verified: true }),
  true,
);
assert.equal(
  isPhoneVerified({ phone: "+923001234567", phone_verified: false }),
  false,
);
assert.equal(isPhoneVerified({ phone: null, phone_verified: true }), false);

assert.match(
  phoneSendErrorMessage(
    new ApiError({
      status: 429,
      code: "otp_resend_cooldown",
      message: "wait",
    }),
  ),
  /wait/i,
);
assert.match(
  phoneSendErrorMessage(
    new ApiError({
      status: 422,
      code: "unsupported_phone_region",
      message: "no",
    }),
  ),
  /unavailable for this destination/i,
);
assert.match(
  phoneVerifyErrorMessage(
    new ApiError({
      status: 401,
      code: "otp_invalid",
      message: "bad",
    }),
  ),
  /not correct/i,
);

console.log(
  `phone-verification qa ok (${PHONE_COUNTRIES.length} selectable countries, Israel excluded)`,
);
