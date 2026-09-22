/**
 * Mobile navigation regression checks for FabStitch storefront chrome.
 *
 * Uses the project's existing Playwright dependency (no new test stack).
 * Run against a local or staging server:
 *   SITE=http://127.0.0.1:3000 node scripts/qa/mobile-nav.mjs
 */
import { chromium } from "playwright";

const SITE = (process.env.SITE ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "360", width: 360, height: 740 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "412", width: 412, height: 915 },
  { name: "430", width: 430, height: 932 },
];

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await page.goto(`${SITE}/`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.locator("main h1").waitFor();

  const openNav = page.getByRole("button", { name: /Open navigation/i });
  assert(
    (await openNav.count()) === 1,
    `${viewport.name}: open navigation control missing`,
  );

  const openBox = await openNav.boundingBox();
  assert(
    openBox && openBox.width >= 44 && openBox.height >= 44,
    `${viewport.name}: hamburger touch target below 44px (${openBox?.width}x${openBox?.height})`,
  );

  await openNav.click();
  const dialog = page.getByRole("dialog", { name: /Site navigation/i });
  await dialog.waitFor({ state: "visible" });
  assert(
    (await dialog.getAttribute("aria-modal")) === "true",
    `${viewport.name}: drawer missing aria-modal`,
  );

  const overflow = await page.evaluate(() => ({
    bodyOverflow: getComputedStyle(document.body).overflow,
    docOverflow: document.documentElement.scrollWidth - window.innerWidth,
  }));
  assert(
    overflow.bodyOverflow === "hidden",
    `${viewport.name}: body scroll not locked while drawer open`,
  );
  assert(
    overflow.docOverflow <= 1,
    `${viewport.name}: horizontal overflow ${overflow.docOverflow}px with drawer open`,
  );

  // Drawer body should scroll independently when content is tall.
  const scrollProbe = await page.evaluate(() => {
    const panel = document.getElementById("fabstitch-mobile-navigation");
    if (!panel) return { ok: false, reason: "missing panel" };
    const scroller = panel.querySelector(".overflow-y-auto");
    if (!(scroller instanceof HTMLElement))
      return { ok: false, reason: "missing scroller" };
    const before = scroller.scrollTop;
    scroller.scrollTop = Math.min(scroller.scrollHeight, 240);
    const after = scroller.scrollTop;
    return {
      ok: true,
      moved: after !== before || scroller.scrollHeight <= scroller.clientHeight,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
    };
  });
  assert(scrollProbe.ok, `${viewport.name}: drawer scroller missing`);
  assert(
    scrollProbe.moved,
    `${viewport.name}: drawer did not accept scroll (${scrollProbe.scrollHeight}/${scrollProbe.clientHeight})`,
  );

  const account = dialog.getByRole("button", { name: /^Account$/i });
  const joinFree = dialog.getByRole("link", { name: /Join Free/i });
  const signIn = dialog.getByRole("link", { name: /Sign In/i });
  await Promise.race([
    account.waitFor({ state: "visible", timeout: 10_000 }),
    joinFree.waitFor({ state: "visible", timeout: 10_000 }),
  ]);
  const authControlCount =
    (await account.count()) + (await joinFree.count()) + (await signIn.count());
  assert(
    authControlCount >= 1,
    `${viewport.name}: Account / Join Free controls missing from drawer footer`,
  );

  const primaryCta =
    (await account.count()) > 0
      ? account
      : (await joinFree.count()) > 0
        ? joinFree
        : signIn;
  const ctaBox = await primaryCta.boundingBox();
  assert(Boolean(ctaBox), `${viewport.name}: primary auth CTA not laid out`);
  if (ctaBox) {
    assert(
      ctaBox.height >= 44,
      `${viewport.name}: auth CTA height ${ctaBox.height} below 44px`,
    );
    assert(
      ctaBox.y + ctaBox.height <= viewport.height + 1,
      `${viewport.name}: auth CTA sits below the viewport (y=${ctaBox.y}, h=${ctaBox.height})`,
    );

    // Confirm the centre of the CTA is the topmost hittable element.
    const tap = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        if (!(el instanceof Element)) return { tag: null, text: null };
        const clickable = el.closest("a,button");
        return {
          tag: clickable?.tagName ?? el.tagName,
          text: (clickable ?? el).textContent?.trim().slice(0, 40) ?? null,
        };
      },
      { x: ctaBox.x + ctaBox.width / 2, y: ctaBox.y + ctaBox.height / 2 },
    );
    assert(
      Boolean(tap.text && /Account|Join Free|Sign In/i.test(tap.text)),
      `${viewport.name}: auth CTA covered by ${tap.tag}:${tap.text}`,
    );
  }

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  const unlocked = await page.evaluate(
    () => getComputedStyle(document.body).overflow,
  );
  assert(
    unlocked !== "hidden",
    `${viewport.name}: body overflow still locked after Escape`,
  );

  await openNav.click();
  await dialog.waitFor({ state: "visible" });
  await dialog.getByRole("button", { name: /Close navigation$/i }).click();
  await dialog.waitFor({ state: "hidden" });

  // Join Free / Account path after reopen.
  await openNav.click();
  await dialog.waitFor({ state: "visible" });
  if ((await joinFree.count()) > 0) {
    await Promise.all([page.waitForURL(/\/signup\/?/), joinFree.click()]);
    assert(
      page.url().includes("/signup"),
      `${viewport.name}: Join Free did not navigate to signup`,
    );
    const leftover = await page.evaluate(() =>
      Boolean(document.getElementById("fabstitch-mobile-navigation")),
    );
    assert(
      !leftover,
      `${viewport.name}: drawer remained after Join Free navigation`,
    );
  } else if ((await account.count()) > 0) {
    await account.click();
    const menu = page.getByRole("menu");
    await menu.waitFor({ state: "visible" });
    const accountLink = menu.getByRole("menuitem", { name: /^Account$/i });
    await Promise.all([page.waitForURL(/\/account\/?/), accountLink.click()]);
    const leftover = await page.evaluate(() =>
      Boolean(document.getElementById("fabstitch-mobile-navigation")),
    );
    assert(
      !leftover,
      `${viewport.name}: drawer remained after Account navigation`,
    );
  }

  await page.close();
}

// Desktop regression: primary nav still visible, no mobile drawer chrome.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto(`${SITE}/`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  assert(
    (await page.getByRole("navigation", { name: "Primary" }).count()) === 1,
    "desktop: primary navigation missing",
  );
  assert(
    (await page.getByRole("button", { name: /Open navigation/i }).count()) ===
      0,
    "desktop: hamburger should be hidden",
  );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  assert(overflow <= 1, `desktop: horizontal overflow ${overflow}px`);
  await page.close();
}

await browser.close();

const report = {
  site: SITE,
  failures,
  passed: failures.length === 0,
  checkedViewports: VIEWPORTS.map((item) => item.name),
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error(`\n${failures.length} mobile navigation failure(s)`);
  process.exit(1);
}
console.log("\nMobile navigation checks passed");
