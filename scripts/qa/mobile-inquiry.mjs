/**
 * Mobile inquiry modal scroll regression.
 *
 * Reproduces the production bug: dialog max-height + overflow:hidden without an
 * inner overflow-y-auto region clipped Email / Submit below the fold.
 *
 *   SITE=http://127.0.0.1:3000 npm run qa:mobile-inquiry
 */
import { chromium } from "playwright";

const SITE = (process.env.SITE ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const FABRICS = [
  "/fabrics/egyptian-cotton-poplin/",
  "/fabrics/european-flax-linen/",
  "/fabrics/mercerized-cotton-jersey/",
  "/fabrics/cotton-poplin/",
];

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
];

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const mockUser = {
  authenticated: true,
  user: {
    id: "00000000-0000-4000-8000-000000000001",
    email: "qa-inquiry@fabstitch.test",
    full_name: "Shahzain Ali",
    phone: "+15551234567",
    country: "US",
    currency: "USD",
    onboarding_completed: true,
    onboarding_completed_at: null,
  },
};

async function installAuthMock(page) {
  await page.route("**/auth/me**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUser),
    });
  });
  await page.route("**/me/preferences**", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          country: "US",
          currency: "USD",
          onboarding_completed: true,
          onboarding_completed_at: null,
          email: mockUser.user.email,
          full_name: mockUser.user.full_name,
          phone: mockUser.user.phone,
        }),
      });
      return;
    }
    await route.continue();
  });
}

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});

for (const viewport of VIEWPORTS) {
  for (const fabricPath of FABRICS.slice(0, viewport.name === "390" ? 4 : 1)) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });
    await installAuthMock(page);

    const label = `${viewport.name} ${fabricPath}`;
    await page.goto(`${SITE}${fabricPath}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });

    const trigger = page.getByRole("button", { name: /Send Inquiry/i }).first();
    await trigger.waitFor({ timeout: 60_000 });
    await trigger.click();

    const dialog = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: /Your inquiry/i }),
    });
    await dialog.waitFor({ state: "visible", timeout: 30_000 });

    // Wait for compose form (authenticated), not the sign-in gate.
    await dialog.getByLabel(/Quantity/i).waitFor({ timeout: 30_000 });

    const bodyOverflow = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    assert(
      bodyOverflow === "hidden",
      `${label}: body scroll not locked while inquiry open`,
    );

    const scrollProbe = await dialog.evaluate((node) => {
      const scroller = [...node.querySelectorAll("div")].find((el) => {
        const style = getComputedStyle(el);
        return (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight - 1
        );
      });
      if (!scroller) {
        // Even if content fits a tall viewport, the compose form must expose a
        // dedicated overflow-y-auto region for shorter phones / keyboard.
        const candidate = node.querySelector(
          "form > div.overflow-y-auto, form div.min-h-0.flex-1",
        );
        return {
          ok: Boolean(candidate),
          reason: candidate ? "fit" : "missing-scroller",
          scrollHeight: candidate?.scrollHeight ?? 0,
          clientHeight: candidate?.clientHeight ?? 0,
          moved: false,
        };
      }
      const before = scroller.scrollTop;
      scroller.scrollTop = Math.min(
        scroller.scrollHeight,
        scroller.clientHeight + 200,
      );
      const after = scroller.scrollTop;
      return {
        ok: true,
        reason: "scrolled",
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        moved: after > before,
      };
    });

    assert(
      scrollProbe.ok,
      `${label}: inquiry scroll container missing (${scrollProbe.reason})`,
    );
    if (scrollProbe.scrollHeight > scrollProbe.clientHeight + 8) {
      assert(
        scrollProbe.moved,
        `${label}: inquiry content did not scroll (${scrollProbe.scrollHeight}/${scrollProbe.clientHeight})`,
      );
    }

    await dialog.getByLabel(/Quantity/i).fill("100");
    await dialog.getByLabel(/Note/i).fill("Mobile scroll QA note");

    // Scroll the inquiry scroller to the bottom and confirm email + submit.
    await dialog.evaluate((node) => {
      const scroller = [...node.querySelectorAll("div")].find((el) => {
        const style = getComputedStyle(el);
        return style.overflowY === "auto" || style.overflowY === "scroll";
      });
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    });

    const email = dialog.getByLabel(/Email address/i);
    const country = dialog.getByLabel(/^Country$/i);
    const phone = dialog.getByLabel(/Phone number/i);
    const submit = dialog.getByRole("button", { name: /Send Inquiry/i });

    for (const [name, locator] of [
      ["email", email],
      ["country", country],
      ["phone", phone],
      ["submit", submit],
    ]) {
      await locator.scrollIntoViewIfNeeded();
      const box = await locator.boundingBox();
      assert(Boolean(box), `${label}: ${name} not laid out`);
      if (box) {
        assert(
          box.y + box.height > 0 && box.y < viewport.height,
          `${label}: ${name} not in viewport after scroll (y=${box.y})`,
        );
      }
    }

    const horizontal = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    assert(horizontal <= 1, `${label}: horizontal overflow ${horizontal}px`);

    await dialog.getByRole("button", { name: /Close inquiry form/i }).click();
    await dialog.waitFor({ state: "hidden" });

    const unlocked = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    assert(
      unlocked !== "hidden",
      `${label}: body still locked after inquiry close`,
    );

    // Re-open and confirm scroll still works.
    await trigger.click();
    await dialog.waitFor({ state: "visible" });
    await dialog.getByLabel(/Quantity/i).waitFor();
    const reopenScroll = await dialog.evaluate((node) => {
      const scroller = [...node.querySelectorAll("div")].find((el) => {
        const style = getComputedStyle(el);
        return style.overflowY === "auto" || style.overflowY === "scroll";
      });
      if (!scroller) return false;
      scroller.scrollTop = scroller.scrollHeight;
      return scroller.scrollTop >= 0;
    });
    assert(reopenScroll, `${label}: reopen lost scroll container`);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });

    await page.close();
  }
}

// Desktop smoke: dialog usable, not forced full-bleed.
{
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  await installAuthMock(page);
  await page.goto(`${SITE}${FABRICS[0]}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page
    .getByRole("button", { name: /Send Inquiry/i })
    .first()
    .click();
  const dialog = page.getByRole("dialog").filter({
    has: page.getByRole("heading", { name: /Your inquiry/i }),
  });
  await dialog.waitFor();
  await dialog.getByLabel(/Quantity/i).waitFor({ timeout: 30_000 });
  const box = await dialog.boundingBox();
  assert(Boolean(box), "desktop: inquiry dialog missing");
  assert(
    box && box.width < 1280,
    `desktop: inquiry dialog unexpectedly full width (${box?.width})`,
  );
  await page.keyboard.press("Escape");
  await page.close();
}

await browser.close();

const report = {
  site: SITE,
  failures,
  passed: failures.length === 0,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error(`\n${failures.length} mobile inquiry failure(s)`);
  process.exit(1);
}
console.log("\nMobile inquiry scroll checks passed");
