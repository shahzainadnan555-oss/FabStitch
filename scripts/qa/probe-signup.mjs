/**
 * Is the signup submit button actually clickable?
 *
 * The auth E2E started failing with Playwright reporting that the decorative
 * hero `<aside>` "intercepts pointer events" over `Create buyer account`. That
 * is not a test artefact if it reproduces: a user who cannot reach the submit
 * button cannot open an account, and the symptom they report is "I pressed
 * Join and nothing happened".
 *
 * Checks each viewport at the button's real position after scrolling, and asks
 * the DOM what is actually on top.
 *
 *   node scripts/qa/probe-signup.mjs
 */

import { chromium } from "playwright";

const SITE = process.env.SITE ?? "http://127.0.0.1:3000";

const VIEWPORTS = [
  { name: "desktop 1440x900", width: 1440, height: 900 },
  { name: "laptop 1280x720", width: 1280, height: 720 },
  { name: "laptop 1024x768", width: 1024, height: 768 },
  { name: "tablet 834x1112", width: 834, height: 1112 },
  { name: "mobile 390x844", width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: "chrome" });
let failures = 0;

for (const role of ["buyer", "supplier"]) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    const problems = [];
    page.on("response", (r) => {
      if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));

    await page.goto(`${SITE}/signup/?role=${role}`, {
      waitUntil: "networkidle",
    });
    await page.fill(
      'input[name="email"]',
      `probe.${role}.${vp.width}@fabstitch-regression.com`,
    );
    await page.fill('input[name="password"]', "Fabstitch-QA-2026!");
    await page.fill('input[name="full_name"]', "Signup Probe");
    await page.fill('input[name="company_name"]', "FabStitch Probe");
    await page.selectOption('select[name="country_code"]', "IN");

    const button = page.locator('button[type="submit"]').first();
    let verdict = "no submit button";
    let clickable = false;

    if (await button.count()) {
      await button.scrollIntoViewIfNeeded();
      const box = await button.boundingBox();
      if (box) {
        const probe = await page.evaluate(
          ([x, y]) => {
            const el = document.elementFromPoint(x, y);
            if (!el) return { tag: "OUTSIDE_VIEWPORT", blocks: true };
            const button = el.closest("button");
            return {
              tag: `${el.tagName.toLowerCase()}${
                typeof el.className === "string" && el.className
                  ? `.${el.className.split(/\s+/).slice(0, 3).join(".")}`
                  : ""
              }`,
              blocks: !button,
            };
          },
          [box.x + box.width / 2, box.y + box.height / 2],
        );
        clickable = !probe.blocks;
        verdict = probe.blocks ? `BLOCKED by <${probe.tag}>` : "clickable";
      }
    }

    // The decisive test: can Playwright actually click it in one second?
    let clicked = false;
    if (clickable) {
      try {
        await button.click({ trial: true, timeout: 2000 });
        clicked = true;
      } catch {
        clicked = false;
      }
    }

    const ok = clickable && clicked;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${role.padEnd(8)} ${vp.name.padEnd(18)} ${verdict}${
        clickable && !clicked ? " (trial click timed out)" : ""
      }`,
    );
    for (const p of problems) console.log(`        ${p}`);

    await context.close();
  }
}

await browser.close();
console.log(`\n${failures} failing viewport/role combination(s)`);
process.exit(failures ? 1 : 0);
