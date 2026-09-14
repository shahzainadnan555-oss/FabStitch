import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const failures = [];

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function match(html, expression) {
  return decode(html.match(expression)?.[1]?.trim() ?? "");
}

function metadata(html) {
  const meta = (property, attribute = "name") =>
    match(
      html,
      new RegExp(
        `<meta[^>]+${attribute}=["']${property}["'][^>]+content=["']([^"']*)["'][^>]*>`,
        "i",
      ),
    ) ||
    match(
      html,
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${property}["'][^>]*>`,
        "i",
      ),
    );
  return {
    title: match(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description:
      match(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ||
      match(
        html,
        /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
      ),
    canonical:
      match(
        html,
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i,
      ) ||
      match(
        html,
        /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["'][^>]*>/i,
      ),
    robots:
      match(
        html,
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ||
      match(
        html,
        /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["'][^>]*>/i,
      ),
    h1Count: (html.match(/<h1(?:\s|>)/gi) ?? []).length,
    ogTitle: meta("og:title", "property"),
    ogDescription: meta("og:description", "property"),
    ogUrl: meta("og:url", "property"),
    ogImage: meta("og:image", "property"),
    ogType: meta("og:type", "property"),
    twitterCard: meta("twitter:card"),
  };
}

async function pool(values, concurrency, run) {
  const results = new Array(values.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (next < values.length) {
        const index = next++;
        results[index] = await run(values[index], index);
      }
    }),
  );
  return results;
}

const sitemapResponse = await fetch(`${SITE}/sitemap.xml`, {
  redirect: "manual",
});
if (!sitemapResponse.ok) {
  throw new Error(`sitemap.xml returned ${sitemapResponse.status}`);
}
const sitemapXml = await sitemapResponse.text();
const rootLocations = [
  ...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match_) => decode(match_[1]));
const sitemapDocuments = [];
const urls = [];
if (/<sitemapindex[\s>]/i.test(sitemapXml)) {
  for (const location of rootLocations) {
    const pathname = new URL(location, SITE).pathname;
    const response = await fetch(`${SITE}${pathname}`);
    if (!response.ok) {
      failures.push(`${pathname}: sitemap batch returned ${response.status}`);
      continue;
    }
    const xml = await response.text();
    sitemapDocuments.push({ path: pathname, status: response.status });
    urls.push(
      ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match_) =>
        decode(match_[1]),
      ),
    );
  }
} else {
  urls.push(...rootLocations);
}

const pages = await pool(urls, 8, async (url) => {
  const sitemapUrl = new URL(url);
  const response = await fetch(`${SITE}${sitemapUrl.pathname}`, {
    redirect: "manual",
  });
  const html = await response.text();
  const data = metadata(html);
  const urlPath = new URL(url).pathname;

  if (response.status !== 200)
    failures.push(`${urlPath}: sitemap URL returned ${response.status}`);
  if (!data.title) failures.push(`${urlPath}: missing title`);
  if (!data.description) failures.push(`${urlPath}: missing description`);
  if (!data.canonical) failures.push(`${urlPath}: missing canonical`);
  if (data.canonical && new URL(data.canonical, SITE).pathname !== urlPath)
    failures.push(`${urlPath}: canonical points to ${data.canonical}`);
  if (/noindex/i.test(data.robots))
    failures.push(`${urlPath}: sitemap URL is noindex`);
  if (data.h1Count !== 1)
    failures.push(`${urlPath}: expected one H1, found ${data.h1Count}`);
  if (!data.ogTitle || !data.ogDescription || !data.ogUrl || !data.ogImage)
    failures.push(`${urlPath}: incomplete Open Graph metadata`);
  if (!data.twitterCard)
    failures.push(`${urlPath}: missing Twitter/X card metadata`);
  const headingLevels = [...html.matchAll(/<h([1-6])(?:\s|>)/gi)].map(
    (match_) => Number(match_[1]),
  );
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      failures.push(
        `${urlPath}: heading level jumps from H${headingLevels[index - 1]} to H${headingLevels[index]}`,
      );
      break;
    }
  }
  const imagesWithoutAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter(
    (match_) => !/\salt=(?:"[^"]*"|'[^']*')/i.test(match_[0]),
  ).length;
  if (imagesWithoutAlt)
    failures.push(`${urlPath}: ${imagesWithoutAlt} image(s) missing alt`);

  const links = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)]
    .map((match_) => decode(match_[1]))
    .filter(
      (href) =>
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/_next/"),
    )
    .map((href) => new URL(href, SITE).pathname);

  return {
    url,
    path: urlPath,
    status: response.status,
    ...data,
    headingLevels,
    imagesWithoutAlt,
    links,
  };
});

for (const field of ["title", "description"]) {
  const grouped = new Map();
  for (const page of pages) {
    const key = page[field].toLowerCase();
    grouped.set(key, [...(grouped.get(key) ?? []), page.path]);
  }
  for (const [value, paths] of grouped) {
    if (value && paths.length > 1)
      failures.push(`duplicate ${field}: ${paths.join(", ")}`);
  }
}

const internalPaths = [
  ...new Set(pages.flatMap((page) => page.links).filter(Boolean)),
];
const linkStatuses = await pool(internalPaths, 8, async (pathname) => {
  const response = await fetch(`${SITE}${pathname}`, {
    method: "HEAD",
    redirect: "manual",
  });
  if (response.status === 404 || response.status >= 500)
    failures.push(
      `broken internal link: ${pathname} returned ${response.status}`,
    );
  return { path: pathname, status: response.status };
});

const queryResponse = await fetch(`${SITE}/marketplace/?q=linen&sort=name_asc`);
const queryMeta = metadata(await queryResponse.text());
if (!/noindex/i.test(queryMeta.robots))
  failures.push("marketplace query state is not noindex");
if (new URL(queryMeta.canonical || SITE, SITE).pathname !== "/marketplace/")
  failures.push("marketplace query state canonical is not /marketplace/");

const controlledQueryRoutes = [
  ["/collections/cotton/?page=2", "/collections/cotton/"],
  ["/help/?q=account", "/help/"],
];
const controlledQueryResults = [];
for (const [pathname, canonicalPath] of controlledQueryRoutes) {
  const response = await fetch(`${SITE}${pathname}`);
  const data = metadata(await response.text());
  if (!/noindex/i.test(data.robots))
    failures.push(`${pathname}: query state is not noindex`);
  if (new URL(data.canonical || SITE, SITE).pathname !== canonicalPath)
    failures.push(`${pathname}: canonical is not ${canonicalPath}`);
  controlledQueryResults.push({ pathname, canonicalPath, robots: data.robots });
}

const representativeRoutes = [
  { type: "home", path: "/", indexable: true },
  { type: "fabric-family", path: "/collections/cotton/", indexable: true },
  { type: "fabric-detail", path: "/fabrics/silk-chiffon/", indexable: true },
  {
    type: "held-fabric-detail",
    path: "/fabrics/linen-cotton/",
    indexable: false,
  },
  {
    type: "collection",
    path: "/collections/spring-summer-2027/",
    indexable: true,
  },
  {
    type: "best-for",
    path: "/fabrics/best-for/shirts/",
    indexable: true,
  },
  { type: "guide", path: "/guides/fabrics-2027/", indexable: true },
  { type: "about", path: "/about/", indexable: true },
  { type: "how-it-works", path: "/how-it-works/", indexable: true },
  { type: "contact", path: "/contact/", indexable: true },
  { type: "help", path: "/help/", indexable: true },
];
const representativeResults = [];
for (const route of representativeRoutes) {
  const response = await fetch(`${SITE}${route.path}`, { redirect: "manual" });
  const data = metadata(await response.text());
  if (response.status !== 200)
    failures.push(
      `${route.type} representative returned ${response.status}: ${route.path}`,
    );
  const noindex = /noindex/i.test(data.robots);
  if (route.indexable === noindex)
    failures.push(
      `${route.type} representative has incorrect robots: ${data.robots}`,
    );
  if (!data.canonical || new URL(data.canonical, SITE).pathname !== route.path)
    failures.push(`${route.type} representative has incorrect canonical`);
  if (data.h1Count !== 1)
    failures.push(`${route.type} representative does not have one H1`);
  representativeResults.push({
    ...route,
    status: response.status,
    robots: data.robots,
    canonical: data.canonical,
    h1Count: data.h1Count,
  });
}

const privateRoutes = [
  "/login/",
  "/signup/",
  "/account/",
  "/admin/",
  "/inquiries/",
  "/buyer/",
  "/supplier/",
];
const privateRouteResults = [];
for (const pathname of privateRoutes) {
  const response = await fetch(`${SITE}${pathname}`, { redirect: "manual" });
  const data = metadata(await response.text());
  if (response.status === 200 && !/noindex/i.test(data.robots))
    failures.push(`${pathname}: private route is not noindex`);
  privateRouteResults.push({
    pathname,
    status: response.status,
    robots: data.robots,
  });
}

const excludedFromSitemap = [
  "/fabrics/linen-cotton/",
  "/terms/",
  "/privacy/",
  "/support/",
  "/login/",
  "/account/",
];
const sitemapPaths = new Set(urls.map((url) => new URL(url, SITE).pathname));
for (const pathname of excludedFromSitemap) {
  if (sitemapPaths.has(pathname))
    failures.push(`${pathname}: noindex/private URL entered the sitemap`);
}

const redirects = [
  ["/marketplace/fabrics/silk-chiffon/", "/fabrics/silk-chiffon/"],
  ["/applications/shirts/", "/fabrics/best-for/shirts/"],
  ["/suppliers/", "/marketplace/"],
  ["/certifications/", "/marketplace/"],
  ["/search/?q=linen", "/marketplace/"],
  ["/sitemap-index.xml", "/sitemap.xml"],
  ["/FABRICS/SILK-CHIFFON/", "/fabrics/silk-chiffon/"],
];
const redirectResults = [];
for (const [source, target] of redirects) {
  const response = await fetch(`${SITE}${source}`, { redirect: "manual" });
  const location = response.headers.get("location");
  const targetPath = location ? new URL(location, SITE).pathname : "";
  if (response.status !== 308 || targetPath !== target)
    failures.push(
      `${source}: expected 308 to ${target}, received ${response.status} to ${location}`,
    );
  redirectResults.push({ source, status: response.status, location });
}

const missingResponse = await fetch(`${SITE}/fabrics/not-a-real-fabric/`, {
  redirect: "manual",
});
if (missingResponse.status !== 404)
  failures.push(
    `invalid fabric route expected 404, received ${missingResponse.status}`,
  );

async function schemas(pathname) {
  const response = await fetch(`${SITE}${pathname}`);
  const html = await response.text();
  return [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
    .map((match_) => {
      try {
        return JSON.parse(decode(match_[1]));
      } catch {
        failures.push(`${pathname}: invalid JSON-LD`);
        return null;
      }
    })
    .filter(Boolean)
    .map((schema) => schema["@type"]);
}

const schemaCoverage = {
  home: await schemas("/"),
  fabric: await schemas("/fabrics/silk-chiffon/"),
  collection: await schemas("/collections/cotton/"),
  bestFor: await schemas("/fabrics/best-for/shirts/"),
  guide: await schemas("/guides/fabrics-2027/"),
};
for (const required of ["Organization", "WebSite"]) {
  if (!schemaCoverage.home.includes(required))
    failures.push(`homepage missing ${required} JSON-LD`);
}
for (const required of ["Organization", "Product", "BreadcrumbList"]) {
  if (!schemaCoverage.fabric.includes(required))
    failures.push(`fabric page missing ${required} JSON-LD`);
}
for (const required of ["Organization", "Article", "BreadcrumbList"]) {
  if (!schemaCoverage.guide.includes(required))
    failures.push(`guide page missing ${required} JSON-LD`);
}
for (const [name, required] of [
  ["collection", ["Organization", "CollectionPage", "BreadcrumbList"]],
  ["bestFor", ["Organization", "CollectionPage", "BreadcrumbList"]],
]) {
  for (const type of required) {
    if (!schemaCoverage[name].includes(type))
      failures.push(`${name} page missing ${type} JSON-LD`);
  }
}

const robotsResponse = await fetch(`${SITE}/robots.txt`);
const robotsText = await robotsResponse.text();
for (const path of ["/admin/", "/account/", "/inquiries/", "/buyer/", "/supplier/", "/rfq/"]) {
  if (!robotsText.includes(`Disallow: ${path}`))
    failures.push(`robots.txt does not disallow ${path}`);
}
if (!robotsText.includes("Sitemap:") || !robotsText.includes("/sitemap.xml"))
  failures.push("robots.txt does not advertise the sitemap index");

const report = {
  site: SITE,
  sitemapIndexLocations: rootLocations,
  sitemapDocuments,
  sitemapUrls: urls.length,
  pagesChecked: pages.length,
  internalLinksChecked: linkStatuses.length,
  redirectResults,
  invalidFabricStatus: missingResponse.status,
  queryIndexation: queryMeta,
  controlledQueryResults,
  representativeResults,
  privateRouteResults,
  excludedFromSitemap,
  robotsStatus: robotsResponse.status,
  schemaCoverage,
  failures,
};

const artifacts = path.join(process.cwd(), "artifacts");
mkdirSync(artifacts, { recursive: true });
writeFileSync(
  path.join(artifacts, "seo-runtime-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
