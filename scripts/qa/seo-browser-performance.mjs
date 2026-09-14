import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const SITE = (process.env.SITE ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const budget = JSON.parse(
  readFileSync(path.join(process.cwd(), "performance-budgets.json"), "utf8"),
);
const routes = [
  "/",
  "/marketplace/",
  "/fabrics/cotton/jersey/",
  "/collections/linen-lightweight/",
  "/collections/spring-summer-2027/",
  "/fabrics/silk-chiffon/",
  "/fabrics/best-for/shirts/",
  "/guides/fabrics-2027/",
  "/about/",
  "/how-it-works/",
  "/contact/",
  "/help/",
  "/support/",
  "/search/?q=linen",
];
const widths = [375, 390, 414, 768, 1024, 1280, 1366, 1440, 1600];
const failures = [];

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
await context.addInitScript(() => {
  window.__fabstitchVitals = { lcp: null, cls: 0, inp: null };
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries.at(-1);
    if (last) window.__fabstitchVitals.lcp = last.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__fabstitchVitals.cls += entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.interactionId) continue;
        window.__fabstitchVitals.inp = Math.max(
          window.__fabstitchVitals.inp ?? 0,
          entry.duration,
        );
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  } catch {
    // Event Timing is not exposed by every browser build; report null.
  }
});

const routeMeasurements = [];
for (const route of routes) {
  const page = await context.newPage();
  await page.goto(`${SITE}${route}`, {
    waitUntil: "load",
    timeout: 120_000,
  });
  await page.locator("main h1").waitFor();
  const meaningfulContentMs = await page.evaluate(() => performance.now());
  await page
    .locator("main")
    .click({ position: { x: 8, y: 8 } })
    .catch(() => {});
  await page.waitForTimeout(1_000);
  const measurement = await page.evaluate((meaningfulContentMs) => {
    const resources = performance.getEntriesByType("resource");
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      ...window.__fabstitchVitals,
      meaningfulContentMs,
      ttfbMs: navigation?.responseStart ?? null,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
      fcpMs:
        performance.getEntriesByName("first-contentful-paint")[0]?.startTime ??
        null,
      requestCount: resources.length + (navigation ? 1 : 0),
      transferredBytes:
        resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) +
        (navigation?.transferSize || 0),
    };
  }, meaningfulContentMs);
  routeMeasurements.push({ route, ...measurement });
  if (measurement.lcp !== null && measurement.lcp > budget.coreWebVitals.lcpMs)
    failures.push(`${route} LCP ${measurement.lcp}ms exceeds budget`);
  if (measurement.cls > budget.coreWebVitals.cls)
    failures.push(`${route} CLS ${measurement.cls} exceeds budget`);
  if (measurement.inp !== null && measurement.inp > budget.coreWebVitals.inpMs)
    failures.push(`${route} INP ${measurement.inp}ms exceeds budget`);
  if (measurement.requestCount > budget.publicRoute.maximumRequests)
    failures.push(
      `${route} ${measurement.requestCount} requests exceeds budget`,
    );
  if (measurement.transferredBytes > budget.publicRoute.maximumTransferredBytes)
    failures.push(
      `${route} ${measurement.transferredBytes} transferred bytes exceeds budget`,
    );
  await page.close();
}

const responsiveChecks = [];
const responsivePage = await context.newPage();
for (const width of widths) {
  await responsivePage.setViewportSize({
    width,
    height: width < 768 ? 844 : 960,
  });
  for (const route of routes) {
    await responsivePage.goto(`${SITE}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await responsivePage.locator("main h1").waitFor();
    const check = await responsivePage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll("main h1").length,
      brokenImages: [...document.querySelectorAll("main img")].filter(
        (image) => image.complete && image.naturalWidth === 0,
      ).length,
    }));
    responsiveChecks.push({ route, width, ...check });
    if (check.overflow > 1)
      failures.push(`${route} overflows ${check.overflow}px at ${width}px`);
    if (check.h1 !== 1)
      failures.push(`${route} has ${check.h1} H1 elements at ${width}px`);
    if (check.brokenImages)
      failures.push(
        `${route} has ${check.brokenImages} broken images at ${width}px`,
      );
  }
}
await responsivePage.close();

const preferenceChecks = {};
const preferencePage = await context.newPage();
await preferencePage.setViewportSize({ width: 1440, height: 960 });
await preferencePage.goto(`${SITE}/marketplace/`, {
  waitUntil: "domcontentloaded",
  timeout: 120_000,
});
const countryTrigger = preferencePage.getByRole("button", {
  name: /Country/,
});
await countryTrigger.click();
const countryOptions = preferencePage.getByRole("menuitemradio");
preferenceChecks.countryOptionCount = await countryOptions.count();
preferenceChecks.countries = await countryOptions.allTextContents();
await preferencePage.keyboard.press("Escape");
preferenceChecks.countryClosedOnEscape =
  (await countryTrigger.getAttribute("aria-expanded")) === "false";

await countryTrigger.click();
await preferencePage.getByRole("menuitemradio", { name: /Turkey/ }).click();
preferenceChecks.countryDefaultedCurrency = (
  await preferencePage.getByRole("button", { name: /Currency/ }).textContent()
)?.includes("TRY");

const currencyTrigger = preferencePage.getByRole("button", {
  name: /Currency/,
});
await currencyTrigger.click();
preferenceChecks.currencyOptionCount = await preferencePage
  .getByRole("menuitemradio")
  .count();
await preferencePage.getByRole("menuitemradio", { name: "GBP" }).click();
await countryTrigger.click();
await preferencePage.getByRole("menuitemradio", { name: /Pakistan/ }).click();
preferenceChecks.deliberateCurrencyPreserved = (
  await currencyTrigger.textContent()
)?.includes("GBP");

await preferencePage.setViewportSize({ width: 375, height: 844 });
await preferencePage.getByRole("button", { name: /Open navigation/ }).click();
preferenceChecks.mobileControlsVisible =
  (await preferencePage.getByRole("button", { name: /Country/ }).count()) ===
    1 &&
  (await preferencePage.getByRole("button", { name: /Currency/ }).count()) ===
    1 &&
  (await preferencePage.getByRole("link", { name: "Account" }).count()) === 1;
await preferencePage.close();

if (preferenceChecks.countryOptionCount !== 7)
  failures.push("Country menu does not contain exactly seven options");
if (preferenceChecks.currencyOptionCount !== 7)
  failures.push("Currency menu does not contain exactly seven options");
if (!preferenceChecks.countryClosedOnEscape)
  failures.push("Country menu did not close on Escape");
if (!preferenceChecks.countryDefaultedCurrency)
  failures.push("Turkey did not select TRY as its default currency");
if (!preferenceChecks.deliberateCurrencyPreserved)
  failures.push("Country change overwrote a deliberate currency selection");
if (!preferenceChecks.mobileControlsVisible)
  failures.push("Mobile Country, Currency, or Account control is unavailable");

const reducedMotionPage = await context.newPage();
await reducedMotionPage.emulateMedia({ reducedMotion: "reduce" });
await reducedMotionPage.goto(`${SITE}/`, {
  waitUntil: "domcontentloaded",
  timeout: 120_000,
});
const reducedMotion = await reducedMotionPage.evaluate(() => {
  const animated = document.querySelector(".fs-textile-drift");
  const heading = document.querySelector("main h1");
  return {
    animationName: animated
      ? getComputedStyle(animated).animationName
      : "not-present",
    headingVisible: heading ? getComputedStyle(heading).opacity === "1" : false,
  };
});
if (!reducedMotion.headingVisible)
  failures.push("Reduced motion hid primary content");
if (
  reducedMotion.animationName !== "none" &&
  reducedMotion.animationName !== "not-present"
)
  failures.push("Reduced motion left textile animation running");
await reducedMotionPage.close();

const slowPage = await context.newPage();
const cdp = await context.newCDPSession(slowPage);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 350,
  downloadThroughput: (1.5 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await slowPage.goto(`${SITE}/marketplace/`, {
  waitUntil: "domcontentloaded",
  timeout: 120_000,
});
await slowPage.locator("main h1").waitFor();
const headingReadyMs = await slowPage.evaluate(() => performance.now());
await slowPage.locator("main article h3").first().waitFor();
const firstResultReadyMs = await slowPage.evaluate(() => performance.now());
const slowNetwork = { headingReadyMs, firstResultReadyMs };
if (headingReadyMs >= firstResultReadyMs)
  failures.push("Marketplace heading did not precede slow-network results");
await slowPage.close();

const offlineContext = await browser.newContext();
const offlinePage = await offlineContext.newPage();
await offlinePage.goto(`${SITE}/marketplace/`, {
  waitUntil: "domcontentloaded",
  timeout: 120_000,
});
await offlineContext.setOffline(true);
await offlinePage.getByRole("button", { name: /Country/ }).click();
await offlinePage.getByRole("menuitemradio", { name: /India/ }).click();
const temporaryDisconnect = {
  shellPreserved: await offlinePage.locator("main h1").isVisible(),
  localSelectionWorked: (
    await offlinePage.getByRole("button", { name: /Country/ }).textContent()
  )?.includes("IN"),
};
if (!temporaryDisconnect.shellPreserved)
  failures.push("Temporary disconnect replaced the application shell");
if (!temporaryDisconnect.localSelectionWorked)
  failures.push("Local preference control failed during a disconnect");
await offlineContext.setOffline(false);
await offlineContext.close();

await browser.close();

const report = {
  site: SITE,
  budget,
  routeMeasurements,
  responsiveChecks: {
    routes: routes.length,
    widths,
    checks: responsiveChecks.length,
  },
  preferenceChecks,
  reducedMotion,
  slowNetwork,
  temporaryDisconnect,
  caveat:
    "These are local Chrome lab measurements, not field Core Web Vitals. A null INP means no qualifying Event Timing entry was exposed; it is reported as unknown rather than zero.",
  failures,
};
const artifacts = path.join(process.cwd(), "artifacts");
mkdirSync(artifacts, { recursive: true });
writeFileSync(
  path.join(artifacts, "seo-browser-performance.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
