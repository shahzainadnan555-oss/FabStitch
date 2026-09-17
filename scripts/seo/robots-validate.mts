/**
 * Validates frontend robots policy for Googlebot crawlability.
 * Fails the process if any public SEO URL would be blocked by robots.txt.
 */
import {
  ROBOTS_ALLOW_PREFIXES,
  ROBOTS_DISALLOW_PREFIXES,
  ROBOTS_MUST_ALLOW_URLS,
  ROBOTS_MUST_DISALLOW_URLS,
  assertRobotsPolicy,
  isPathAllowedByRobots,
} from "@/lib/robots-policy";

assertRobotsPolicy();

const failures: string[] = [];

if (ROBOTS_DISALLOW_PREFIXES.includes("/" as never)) {
  failures.push("Disallow contains root /");
}

for (const path of ROBOTS_MUST_ALLOW_URLS) {
  if (
    !isPathAllowedByRobots(
      path,
      ROBOTS_ALLOW_PREFIXES,
      ROBOTS_DISALLOW_PREFIXES,
    )
  ) {
    failures.push(`public path blocked: ${path}`);
  }
}

for (const path of ROBOTS_MUST_DISALLOW_URLS) {
  if (
    isPathAllowedByRobots(path, ROBOTS_ALLOW_PREFIXES, ROBOTS_DISALLOW_PREFIXES)
  ) {
    failures.push(`private path allowed: ${path}`);
  }
}

// Googlebot Smartphone uses the Googlebot group / * group — same policy.
const googlebotCases = [
  "/discover/breathable-cotton-shirts/",
  "/marketplace/",
  "/",
  "/collections/cotton/",
];
for (const path of googlebotCases) {
  if (!isPathAllowedByRobots(path)) {
    failures.push(`Googlebot would be blocked on ${path}`);
  }
}

console.log("robots policy validation");
console.log(`  allow prefixes: ${ROBOTS_ALLOW_PREFIXES.length}`);
console.log(`  disallow prefixes: ${ROBOTS_DISALLOW_PREFIXES.length}`);
console.log(`  must-allow checks: ${ROBOTS_MUST_ALLOW_URLS.length}`);
console.log(`  must-disallow checks: ${ROBOTS_MUST_DISALLOW_URLS.length}`);

if (failures.length) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exit(1);
}

console.log("robots policy validation passed.");
