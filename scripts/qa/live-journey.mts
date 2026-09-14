import assert from "node:assert/strict";
import { apiUrl } from "@/lib/api/config";
import { isApiErrorEnvelope } from "@/lib/api/errors";
import type {
  AuthSession,
  FabricPage,
  Inquiry,
  InquiryPage,
  OnboardingOptions,
  OnboardingState,
  Preferences,
  Profile,
  User,
} from "@/lib/api/types";

const stamp = Date.now();
const email = `integration.test.${stamp}@example.com`;
const password = "FabStitch-Integration-2026!";
const jar = new Map<string, string>();

function cookieHeader() {
  return [...jar.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function rememberCookies(response: Response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  for (const cookie of raw) {
    const [pair] = cookie.split(";");
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (!name) continue;
    if (/Max-Age=0/i.test(cookie) || /Expires=.*1970/i.test(cookie)) {
      jar.delete(name);
      continue;
    }
    jar.set(name, value);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; data: T }> {
  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(jar.size ? { Cookie: cookieHeader() } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  rememberCookies(response);
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    if (isApiErrorEnvelope(parsed)) {
      throw new Error(
        `${path} ${response.status} ${parsed.error.code}: ${parsed.error.message} ${JSON.stringify(parsed.error.details ?? [])}`,
      );
    }
    throw new Error(`${path} ${response.status}: ${text.slice(0, 300)}`);
  }
  return { status: response.status, data: parsed as T };
}

const signup = await request<{ authenticated: boolean; user: User }>(
  "POST",
  "/auth/signup",
  {
    email,
    password,
    full_name: "FabStitch Integration Test",
    country: "US",
    currency: "USD",
  },
);
assert.equal(signup.data.authenticated, true);
assert.equal(signup.data.user.email, email);
assert(jar.has("fabstitch_session") || jar.size > 0, "session cookie set");

const me = await request<AuthSession>("GET", "/auth/me");
assert.equal(me.data.authenticated, true);
assert.equal(me.data.user?.email, email);

const profile = await request<Profile>("PATCH", "/account/profile", {
  full_name: "FabStitch Integration Test",
  phone: "+12025550147",
});
assert.equal(profile.data.full_name, "FabStitch Integration Test");

const preferences = await request<Preferences>("PUT", "/me/preferences", {
  country: "GB",
  currency: "GBP",
});
assert.equal(preferences.data.country, "GB");
assert.equal(preferences.data.currency, "GBP");

const options = await request<OnboardingOptions>(
  "GET",
  "/account/onboarding/options",
);
assert(options.data.customer_types.length > 0);
assert(options.data.work_areas.length > 0);
assert(options.data.fabric_interests.length > 0);
assert(options.data.use_cases.length > 0);

const onboarding = await request<OnboardingState>(
  "PUT",
  "/account/onboarding",
  {
    customer_type: options.data.customer_types[0].code,
    work_area: options.data.work_areas[0].code,
    fabric_interests: options.data.fabric_interests
      .slice(0, 2)
      .map((item) => item.code),
    use_cases: options.data.use_cases.slice(0, 2).map((item) => item.code),
    quantity_preference: options.data.quantity_preferences[0]?.code ?? null,
  },
);
assert.equal(onboarding.data.onboarding_completed, true);

const fabrics = await request<FabricPage>("GET", "/fabrics?limit=1");
assert(fabrics.data.items.length > 0);
const fabric = fabrics.data.items[0];

const inquiry = await request<{ inquiry: Inquiry }>(
  "POST",
  "/inquiries",
  {
    fabricId: fabric.id,
    quantity: 12,
    quantityUnit: "meters",
    customerNote: "FabStitch integration-test inquiry. Safe to ignore.",
  },
  { "Idempotency-Key": crypto.randomUUID() },
);
assert(inquiry.data.inquiry.inquiry_number);
assert.equal(Number(inquiry.data.inquiry.quantity), 12);

const history = await request<InquiryPage>("GET", "/me/inquiries?limit=10");
assert(
  history.data.items.some((item) => item.id === inquiry.data.inquiry.id),
  "created inquiry appears in history",
);

const detail = await request<Inquiry>(
  "GET",
  `/me/inquiries/${inquiry.data.inquiry.id}`,
);
assert.equal(detail.data.id, inquiry.data.inquiry.id);

console.log(
  JSON.stringify(
    {
      email,
      userId: signup.data.user.id,
      inquiryNumber: inquiry.data.inquiry.inquiry_number,
      fabricSlug: fabric.slug,
      country: preferences.data.country,
      currency: preferences.data.currency,
      onboardingCompleted: onboarding.data.onboarding_completed,
    },
    null,
    2,
  ),
);
