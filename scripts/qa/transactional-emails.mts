/**
 * Render FabStitch transactional email design samples and assert structure.
 *
 *   node --import=./scripts/register-loader.mjs scripts/qa/transactional-emails.mts
 *
 * Live delivery is backend-owned. This validates the frontend design package.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  escapeHtml,
  renderInquiryAdminEmail,
  renderInquiryCustomerEmail,
  renderOtpEmail,
  renderWelcomeEmail,
} from "@/lib/transactional-email";

const outDir = path.join(process.cwd(), "docs/email/generated");
mkdirSync(outDir, { recursive: true });

const failures: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) failures.push(message);
}

function writeSample(
  name: string,
  html: string,
  text: string,
  subject: string,
) {
  writeFileSync(path.join(outDir, `${name}.html`), html, "utf8");
  writeFileSync(path.join(outDir, `${name}.txt`), text, "utf8");
  writeFileSync(path.join(outDir, `${name}.subject.txt`), subject, "utf8");
}

const otp = renderOtpEmail({
  code: "194827",
  purpose: "signup",
  expiresMinutes: 10,
});
writeSample("otp", otp.html, otp.text, otp.subject);
assert(otp.subject.includes("Verify"), "OTP subject missing Verify");
assert(otp.html.includes("194827"), "OTP HTML missing code");
assert(otp.html.includes("expires in 10 minutes"), "OTP HTML missing expiry");
assert(!otp.text.includes("<"), "OTP plain text contains HTML");

const welcome = renderWelcomeEmail({ fullName: "Shahzain Ali" });
writeSample("welcome", welcome.html, welcome.text, welcome.subject);
assert(welcome.subject === "Welcome to FabStitch", "Welcome subject mismatch");
assert(
  welcome.html.includes("https://fabstitch.net/marketplace/"),
  "Welcome CTA missing marketplace URL",
);
assert(
  welcome.html.includes("https://fabstitch.net/media/fabstitch-mark.png"),
  "Welcome missing production logo URL",
);

const customer = renderInquiryCustomerEmail({
  inquiryNumber: "INQ-AF203BE2",
  inquiryId: "fefd0bc2-2dd4-4bf9-bfba-3718f5abce49",
  createdDate: "23 September 2026",
  createdTime: "20:20",
  customerName: "Shahzain Ali",
  customerEmail: "test@example.com",
  customerPhone: "+92XXXXXXXXXX",
  fabricName: "Egyptian Cotton Poplin",
  quantity: "50000",
  quantityUnit: "meters",
  note: "Ghh",
});
writeSample("inquiry-customer", customer.html, customer.text, customer.subject);
assert(
  customer.subject === "Your FabStitch inquiry has been received",
  "Customer subject mismatch",
);
assert(
  customer.html.includes("within 24 hours"),
  "Customer email missing 24-hour message",
);
assert(customer.html.includes("+92XXXXXXXXXX"), "Customer email missing phone");
assert(customer.html.includes("Ghh"), "Customer email missing note");
assert(
  customer.html.includes("/inquiries/fefd0bc2-2dd4-4bf9-bfba-3718f5abce49/"),
  "Customer email missing inquiry URL",
);

const admin = renderInquiryAdminEmail({
  inquiryNumber: "INQ-AF203BE2",
  inquiryId: "fefd0bc2-2dd4-4bf9-bfba-3718f5abce49",
  createdDate: "23 September 2026",
  createdTime: "20:20",
  customerName: "Shahzain Ali",
  customerEmail: "test@example.com",
  customerPhone: "+92XXXXXXXXXX",
  fabricName: "Egyptian Cotton Poplin",
  quantity: "50000",
  quantityUnit: "meters",
  note: 'Need "soft" hand & <sample> ASAP',
  composition: "100% cotton",
  construction: "Plain weave",
  gsm: "120",
});
writeSample("inquiry-admin", admin.html, admin.text, admin.subject);
assert(
  admin.subject.includes("Egyptian Cotton Poplin"),
  "Admin subject missing fabric",
);
assert(
  admin.subject.includes("INQ-AF203BE2"),
  "Admin subject missing reference",
);
assert(admin.html.includes("+92XXXXXXXXXX"), "Admin email missing phone");
assert(
  admin.html.includes("&lt;sample&gt;"),
  "Admin email did not escape HTML-like note",
);
assert(
  !admin.html.includes("<sample>"),
  "Admin email leaked raw HTML from note",
);
assert(admin.text.includes('Need "soft" hand'), "Admin text lost note content");

const emptySpec = renderInquiryAdminEmail({
  inquiryNumber: "INQ-TEST",
  inquiryId: "00000000-0000-4000-8000-000000000099",
  createdDate: "24 September 2026",
  createdTime: "01:00",
  customerEmail: "ops@example.com",
  fabricName: "Test Cloth",
  quantity: "10",
});
assert(
  !emptySpec.html.includes("Composition"),
  "Empty composition should be omitted",
);
assert(
  !emptySpec.html.includes("Customer note"),
  "Empty note should be omitted",
);

assert(
  escapeHtml(`a<b>"c"`) === "a&lt;b&gt;&quot;c&quot;",
  "escapeHtml failed",
);

const report = {
  generatedDir: "docs/email/generated",
  samples: ["otp", "welcome", "inquiry-customer", "inquiry-admin"],
  failures,
  passed: failures.length === 0,
  deliveryNote:
    "These samples are the frontend design source of truth. Production send still uses backend EmailDeliveryPort until templates are ported.",
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error(`\n${failures.length} transactional email failure(s)`);
  process.exit(1);
}
console.log("\nTransactional email design checks passed");
