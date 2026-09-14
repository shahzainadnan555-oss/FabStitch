import assert from "node:assert/strict";
import { chromium } from "playwright";
import {
  futureOrderRecord,
  submitOrderDraft,
  validateOrderDraft,
  type OrderDraft,
} from "@/features/purchase/order-draft";
import { SUPPORTED_MARKETS } from "@/features/preferences/market";

const SITE = (process.env.SITE ?? "http://127.0.0.1:3000").replace(/\/$/, "");

assert.deepEqual(
  SUPPORTED_MARKETS.map((market) => [
    market.countryCode,
    market.dialCode,
    market.address.postalLabel,
  ]),
  [
    ["US", "+1", "ZIP Code"],
    ["GB", "+44", "Postcode"],
    ["TR", "+90", "Postal Code"],
    ["PK", "+92", "Postal Code"],
    ["IN", "+91", "PIN Code"],
    ["BD", "+880", "Postal Code"],
    ["SG", "+65", "Postal Code"],
  ],
);

const validDraft: OrderDraft = {
  fabric: {
    id: "fs-fabric-2027-001",
    slug: "european-flax-linen",
    name: "European Flax Linen",
    listingSlug: null,
  },
  quantity: { value: "10", unit: null, minimum: null },
  customer: {
    accountId: "customer-001",
    name: "Sam Taylor",
    email: "orders@example.com",
    phone: {
      countryCode: "US",
      dialCode: "+1",
      nationalNumber: "202 555 0147",
    },
  },
  shippingAddress: {
    line1: "100 Market Street",
    line2: "Studio 4",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    countryCode: "US",
  },
  currency: "USD",
};

assert.deepEqual(validateOrderDraft(validDraft), {});
assert.ok(
  validateOrderDraft({
    ...validDraft,
    customer: {
      ...validDraft.customer,
      email: "invalid",
    },
  }).email,
);
assert.ok(
  validateOrderDraft({
    ...validDraft,
    shippingAddress: { ...validDraft.shippingAddress, region: "" },
  }).region,
);

const futureRecord = futureOrderRecord(validDraft);
assert.deepEqual(futureRecord.shippingAddress, validDraft.shippingAddress);
assert.equal(futureRecord.customerId, validDraft.customer.accountId);
assert.equal(futureRecord.customerName, validDraft.customer.name);
assert.equal(futureRecord.customerEmail, validDraft.customer.email);
assert.deepEqual(futureRecord.customerPhone, validDraft.customer.phone);
assert.equal(futureRecord.paymentStatus, null);
assert.equal(futureRecord.orderStatus, null);
assert.equal(futureRecord.amount, null);
assert.equal(futureRecord.orderId, null);

const unavailable = await submitOrderDraft(validDraft);
assert.equal(unavailable.ok, false);
assert.equal(unavailable.code, "ORDER_SERVICE_NOT_READY");
assert.equal(unavailable.draft.paymentStatus, null);

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const desktop = await browser.newPage({
  viewport: { width: 1366, height: 900 },
});
const prohibitedRequests: string[] = [];
desktop.on("request", (request) => {
  if (!["GET", "OPTIONS"].includes(request.method())) {
    prohibitedRequests.push(`${request.method()} ${request.url()}`);
  }
});

await desktop.goto(`${SITE}/marketplace/`, { waitUntil: "domcontentloaded" });
for (const item of [
  "Fabrics",
  "Marketplace",
  "Collections",
  "How It Works",
  "About Us",
  "Contact",
]) {
  await assert.doesNotReject(() =>
    desktop.getByRole("link", { name: item, exact: true }).first().waitFor(),
  );
}

const firstCard = desktop.locator("[data-fabric-slug]").first();
const selectedSlug = await firstCard.getAttribute("data-fabric-slug");
assert.ok(selectedSlug);
await firstCard.getByRole("link").first().click();
await desktop.waitForURL(new RegExp(`/fabrics/${selectedSlug}/`));

const buyButton = desktop.getByRole("button", { name: /Buy now/i }).first();
await buyButton.click();
const dialog = desktop.getByRole("dialog", { name: /^Order / });
await dialog.waitFor();
assert.equal(
  await dialog
    .locator("[data-order-fabric-slug]")
    .getAttribute("data-order-fabric-slug"),
  selectedSlug,
);

await dialog
  .getByRole("spinbutton", { name: "Quantity", exact: true })
  .waitFor();
for (const field of [
  "Email",
  "Phone number",
  "Address line 1",
  "Address line 2 (optional)",
  "Country",
  "City",
  "State",
  "ZIP Code",
]) {
  await assert.doesNotReject(() =>
    dialog.getByLabel(field, { exact: true }).waitFor(),
  );
}
await dialog
  .getByRole("button", { name: "Review order preview", exact: true })
  .waitFor();
assert.equal(await dialog.getByText(/supplier|vendor|factory/i).count(), 0);
assert.equal(
  await dialog
    .getByText(
      /Verify your phone number|Send verification code|Enter verification code/i,
    )
    .count(),
  0,
);
assert.equal(
  await dialog
    .getByText(/Payment successful|Payment done|Order paid|Order completed/i)
    .count(),
  0,
);

await dialog.getByLabel("Country", { exact: true }).selectOption("GB");
await dialog.getByLabel("Town / City", { exact: true }).waitFor();
await dialog.getByLabel("Postcode", { exact: true }).waitFor();
assert.equal(await dialog.getByLabel("State", { exact: true }).count(), 0);

await dialog.getByLabel("Country", { exact: true }).selectOption("US");
await dialog
  .getByRole("button", { name: "Review order preview", exact: true })
  .click();
await dialog.getByText("Enter a valid email address.").waitFor();
await dialog.getByText("Enter the delivery address.").waitFor();

await dialog.getByLabel("Email", { exact: true }).fill("orders@example.com");
await dialog.getByLabel("Phone number", { exact: true }).fill("202 555 0147");
await dialog
  .getByLabel("Address line 1", { exact: true })
  .fill("100 Market Street");
await dialog.getByLabel("City", { exact: true }).fill("New York");
await dialog.getByLabel("State", { exact: true }).fill("NY");
await dialog.getByLabel("ZIP Code", { exact: true }).fill("10001");
await dialog
  .getByRole("button", { name: "Review order preview", exact: true })
  .click();
await dialog
  .getByText("Frontend preview complete.", {
    exact: false,
  })
  .waitFor();
assert.equal(
  await dialog.getByLabel("Address line 1", { exact: true }).inputValue(),
  "100 Market Street",
);
assert.equal(
  await dialog.getByLabel("Email", { exact: true }).inputValue(),
  "orders@example.com",
);
assert.deepEqual(prohibitedRequests, []);

await desktop.keyboard.press("Escape");
await dialog.waitFor({ state: "hidden" });
assert.equal(
  await buyButton.evaluate((node) => document.activeElement === node),
  true,
);

await desktop.goto(`${SITE}/help/how-to-buy-fabric/`, {
  waitUntil: "domcontentloaded",
});
for (const heading of [
  "How do I buy a fabric?",
  "What information do I need to place an order?",
  "How do I provide my delivery address?",
  "What happens after I place an order?",
  "How will payment work?",
  "When will payment be available?",
]) {
  await desktop.getByRole("heading", { name: heading, exact: true }).waitFor();
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${SITE}/fabrics/european-flax-linen/`, {
  waitUntil: "domcontentloaded",
});
await mobile
  .getByRole("button", { name: /Buy now/i })
  .first()
  .click();
const mobileDialog = mobile.getByRole("dialog", {
  name: "Order European Flax Linen",
});
await mobileDialog.waitFor();
const mobileBounds = await mobileDialog.boundingBox();
assert.ok(mobileBounds);
assert.ok(mobileBounds.width <= 390);
assert.equal(
  await mobile.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  ),
  false,
);
for (let index = 0; index < 12; index += 1) {
  await mobile.keyboard.press("Tab");
  assert.equal(
    await mobile.evaluate(
      () => document.activeElement?.closest("dialog")?.open === true,
    ),
    true,
    "focus remains trapped in the order dialog",
  );
}
await mobile.keyboard.press("Escape");
await mobileDialog.waitFor({ state: "hidden" });

await browser.close();

console.log(
  JSON.stringify(
    {
      model: "passed",
      markets: SUPPORTED_MARKETS.length,
      selectedFabricPreserved: true,
      countryAwareAddress: true,
      paymentStatusInvented: false,
      orderSubmissionPerformed: false,
      failurePreservesValues: true,
      desktop: "passed",
      mobile: "passed",
      focusTrapAndEscape: "passed",
      prohibitedRequests,
    },
    null,
    2,
  ),
);
