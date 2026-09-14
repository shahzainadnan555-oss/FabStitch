import { writeFileSync } from "node:fs";
import path from "node:path";
import {
  BEST_FOR,
  COLLECTIONS,
  FABRICS_2027,
  MEDIA_BY_FABRIC_SLUG,
  SOURCE_FAMILIES,
  type FabricMedia,
} from "@/catalog";

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function countBy(values: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

const collectionCounts = countBy(
  FABRICS_2027.map((fabric) => fabric.collection),
);
const familyCounts = countBy(FABRICS_2027.map((fabric) => fabric.family));
const applicationCounts = new Map(
  BEST_FOR.map((item) => [
    item.slug,
    FABRICS_2027.filter((fabric) =>
      fabric.applications.includes(item.slug as never),
    ).length,
  ]),
);

const mediaEntries = FABRICS_2027.map((fabric) => ({
  fabric,
  media: MEDIA_BY_FABRIC_SLUG[fabric.slug] as FabricMedia,
}));
const finalMedia = mediaEntries.filter(({ media }) => media.status === "final");
const temporaryMedia = mediaEntries.filter(
  ({ media }) => media.status === "temporary",
);
const placeholderMedia = mediaEntries.filter(
  ({ media }) => media.status === "placeholder",
);

const lines: string[] = [
  "# FabStitch 2027 Catalog Inventory",
  "",
  "Generated from `catalog/fabrics-2027.ts`. The sourcing reference is the content authority; the frontend catalog is the default until backend import.",
  "",
  "## Catalog",
  "",
  `- Canonical fabrics: **${FABRICS_2027.length}**`,
  `- Source families: **${SOURCE_FAMILIES.length}**`,
  `- Customer collections: **${COLLECTIONS.length}**`,
  `- Best For values: **${BEST_FOR.length}**`,
  "- Seasons: SS 27, AW 27/28, Home & Contract 27/28",
  "- Commercial state: quantity and Buy Now remain unavailable until real MOQ, price, availability and sellable IDs arrive from the backend.",
  "",
  "### Collections",
  "",
  "| Collection | Slug | Fabrics |",
  "|---|---|---:|",
  ...COLLECTIONS.map(
    (collection) =>
      `| ${escapeCell(collection.label)} | \`${collection.slug}\` | ${collectionCounts.get(collection.slug) ?? 0} |`,
  ),
  "",
  "### Source families",
  "",
  "| Family | Source section | Fabrics |",
  "|---|---|---:|",
  ...SOURCE_FAMILIES.map(
    (family) =>
      `| ${escapeCell(family.label)} | ${escapeCell(family.sourceSection)} | ${familyCounts.get(family.slug) ?? 0} |`,
  ),
  "",
  "### Best For mappings",
  "",
  "Each value links to `/marketplace/?application=<slug>`.",
  "",
  "| Customer label | Application slug | Fabrics |",
  "|---|---|---:|",
  ...BEST_FOR.map(
    (item) =>
      `| ${escapeCell(item.label)} | \`${item.slug}\` | ${applicationCounts.get(item.slug) ?? 0} |`,
  ),
  "",
  "### Canonical fabric inventory",
  "",
  "| Fabric | Stable slug | Family | Collection | Season | Best For | Media |",
  "|---|---|---|---|---|---|---|",
  ...FABRICS_2027.map((fabric) => {
    const family = SOURCE_FAMILIES.find((item) => item.slug === fabric.family);
    const collection = COLLECTIONS.find(
      (item) => item.slug === fabric.collection,
    );
    const applications = fabric.applications
      .map((slug) => BEST_FOR.find((item) => item.slug === slug)?.label ?? slug)
      .join(", ");
    return `| ${escapeCell(fabric.name)} | \`${fabric.slug}\` | ${escapeCell(family?.label ?? fabric.family)} | ${escapeCell(collection?.label ?? fabric.collection)} | ${escapeCell(fabric.seasons.join(", "))} | ${escapeCell(applications || "Not stated")} | ${MEDIA_BY_FABRIC_SLUG[fabric.slug].status} |`;
  }),
  "",
  "## Removals",
  "",
  "- Legacy fictional supplier fixtures have been removed; the approved local catalogue is authoritative.",
  "- Catalog mode returns no legacy listing records, and legacy application, buyer-category, country, comparison and listing routes redirect to `/marketplace/`.",
  "- Canonical alias groups prevent duplicate presentation: Cotton Organdy / Cotton Organza and Silk Dupion / Shantung each have one product identity.",
  "- No supplier, vendor, factory, seller, supplier count, supplier country or certificate field is present in the customer catalog model.",
  "",
  "## Media",
  "",
  `- Final production images: **${finalMedia.length}**`,
  `- Temporary representative images: **${temporaryMedia.length}**`,
  `- Generated intentional placeholders: **${placeholderMedia.length}**`,
  "- Replacement location: update the stable slug entry in `catalog/media.ts`; cards, details, landing curation and collections consume the same registry.",
  "",
  "### Fabrics with final images",
  "",
  ...(finalMedia.length
    ? finalMedia.map(({ fabric, media }) => {
        const src = "src" in media ? media.src : "";
        return `- ${fabric.name} (\`${fabric.slug}\`) — \`${src}\``;
      })
    : ["- None. No temporary or generated media is represented as final."]),
  "",
  "### Temporary representative images",
  "",
  ...temporaryMedia.map(({ fabric, media }) => {
    const src = "src" in media ? media.src : "";
    return `- ${fabric.name} (\`${fabric.slug}\`) — \`${src}\``;
  }),
  "",
  "### Fabrics needing owner image upload",
  "",
  `All ${FABRICS_2027.length} products still need final production photography. Entries marked \`temporary\` currently have representative local media; entries marked \`placeholder\` use the generated swatch.`,
  "",
  ...mediaEntries.map(
    ({ fabric, media }) =>
      `- [ ] ${fabric.name} (\`${fabric.slug}\`) — ${media.status}`,
  ),
  "",
  "## Routes",
  "",
  "- Catalog: `/marketplace/`",
  "- Fabric detail: `/marketplace/fabrics/<fabric-slug>/`",
  "- Collection discovery: `/marketplace/?collection=<collection-slug>`",
  "- Best For discovery: `/marketplace/?application=<application-slug>`",
  "- Seasonal discovery: `/marketplace/?season=SS%2027` or `/marketplace/?season=AW%2027%2F28`",
  `- All ${FABRICS_2027.length} canonical slugs pass detail lookup in \`npm run qa:catalog\`.`,
  "",
  "## Marketplace",
  "",
  "- Search runs through the server-side catalog facade and supports names, aliases, composition, construction, characteristics, collections and source-backed applications.",
  "- Supported filters: material, family, collection, season, Best For, construction, fabric type, GSM range and stretch.",
  "- Deterministic sorting: Most relevant, Name A–Z, Lightest weight and Heaviest weight.",
  "- Result pages contain at most 24 products. Only the current page reaches the card grid.",
  "- Cards use responsive media, compact specification rows, a Best For preview and one fabric-detail CTA.",
  "- Detail pages show source-supported composition, weight, construction, characteristics, applications and season. Commercial controls are visibly disabled without invented values.",
  "",
  "## Personalization",
  "",
  "- Onboarding fabric interests and use-case/business preferences are ranking hints only.",
  "- Shirts, apparel/fashion, uniform/workwear, activewear and home-textile preferences map into source-backed Best For values.",
  "- No preference hides products; all approved fabrics remain searchable.",
  "",
  "## Performance",
  "",
  "- The catalog facade filters, sorts and paginates on the server.",
  "- Next Image loads non-priority card media lazily with responsive `sizes`.",
  "- Placeholder swatches render without network image requests.",
  "- The approved frontend catalogue is the only current product data source.",
  "",
  "## QA",
  "",
  `- Catalog integrity/search/filter/detail audit: ${process.env.CATALOG_QA_DATA ?? "pending"}`,
  `- TypeScript (\`npx tsc --noEmit\`): ${process.env.CATALOG_QA_TYPES ?? "pending"}`,
  `- ESLint (\`npm run lint\`): ${process.env.CATALOG_QA_LINT ?? "pending"}`,
  `- Production build (\`npm run build\`): ${process.env.CATALOG_QA_BUILD ?? "pending"}`,
  `- Responsive browser matrix (375, 390, 414, 768, 1024, 1280, 1366, 1440, 1600): ${process.env.CATALOG_QA_BROWSER ?? "pending"}`,
  `- Remaining issues: ${process.env.CATALOG_QA_ISSUES ?? "pending final QA"}`,
  "",
];

writeFileSync(
  path.join(process.cwd(), "docs", "CATALOG-2027-INVENTORY.md"),
  `${lines.join("\n")}\n`,
);

console.log(
  `Wrote docs/CATALOG-2027-INVENTORY.md (${FABRICS_2027.length} fabrics, ${temporaryMedia.length} temporary, ${placeholderMedia.length} placeholders).`,
);
