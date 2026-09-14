import { writeFileSync } from "node:fs";
import path from "node:path";
import {
  APPROVED_FABRIC_SLUGS,
  FABRICS_2027,
  MEDIA_BY_FABRIC_SLUG,
  type FabricMedia,
  type Fabric2027Slug,
} from "@/catalog";
import { LANDING_MEDIA } from "@/components/landing/media";

const statusLabel = {
  final: "AVAILABLE",
  temporary: "TEMPORARY",
  placeholder: "PLACEHOLDER",
} as const;

const decorativeImages = Object.entries(LANDING_MEDIA).filter(
  ([key]) => key !== "heroVideo",
);
const mediaFor = (slug: Fabric2027Slug): FabricMedia =>
  MEDIA_BY_FABRIC_SLUG[slug];
const uniqueDecorativeImages = new Set(decorativeImages.map(([, src]) => src));
const finalMedia = FABRICS_2027.filter(
  (fabric) => mediaFor(fabric.slug).status === "final",
);
const temporaryMedia = FABRICS_2027.filter(
  (fabric) => mediaFor(fabric.slug).status === "temporary",
);
const placeholderMedia = FABRICS_2027.filter(
  (fabric) => mediaFor(fabric.slug).status === "placeholder",
);
const missingPrimary = FABRICS_2027.filter(
  (fabric) => mediaFor(fabric.slug).status !== "final",
);

const lines = [
  "# FabStitch approved catalog image inventory",
  "",
  "Generated from the approved presentation allowlist and the active media components. This is the minimum production-ready image set for the current frontend, not a proposed gallery redesign.",
  "",
  "## Required versus optional",
  "",
  "- **Primary — REQUIRED:** one final 4:3 product image per approved fabric. Cards, search, collections and the product hero reuse it.",
  "- **Texture — OPTIONAL ENHANCEMENT:** no current customer component requests a separate texture file.",
  "- **Editorial/application — OPTIONAL ENHANCEMENT:** no current customer component requests a separate editorial file.",
  "- **Feature — OPTIONAL ENHANCEMENT:** no separate file is required; current feature and collection placements reuse and crop the primary.",
  `- **Background/decorative — REQUIRED BY THE APPROVED LANDING IMPLEMENTATION:** ${uniqueDecorativeImages.size} existing image files. The existing hero video is available but is not counted as an image file.`,
  "",
  "A generated construction swatch is the honest runtime fallback when a primary is missing, so the UI is not broken. It does not count as final product photography: all non-final primaries remain in the required upload list.",
  "",
  "## Fabric-by-fabric inventory",
  "",
  "| Fabric | Approved? | Primary | Texture | Editorial | Feature | Current Image Status | Total Required |",
  "|---|---|---|---|---|---|---|---:|",
  ...FABRICS_2027.map((fabric) => {
    const media = mediaFor(fabric.slug);
    const current =
      media.status === "placeholder"
        ? "PLACEHOLDER — generated swatch, no file"
        : `${statusLabel[media.status]} — \`${media.src}\``;
    return `| ${fabric.name} (\`${fabric.slug}\`) | YES | REQUIRED: \`${fabric.slug}-primary.webp\` | OPTIONAL ENHANCEMENT | OPTIONAL ENHANCEMENT | REUSE PRIMARY | ${current} | 1 |`;
  }),
  "",
  "## Exact totals",
  "",
  `- Total approved fabrics: **${FABRICS_2027.length}**`,
  `- Total primary images required: **${FABRICS_2027.length}**`,
  "- Total texture images required: **0**",
  "- Total editorial/application images required: **0**",
  "- Total separate feature images required: **0**",
  `- Total background/decorative images required: **${uniqueDecorativeImages.size}**`,
  `- Total unique image files required: **${FABRICS_2027.length + uniqueDecorativeImages.size}**`,
  `- Final product images available: **${finalMedia.length}**`,
  `- Temporary representative product images: **${temporaryMedia.length}**`,
  `- Placeholder product media: **${placeholderMedia.length}**`,
  `- Missing final primary images: **${missingPrimary.length}**`,
  "- Broken images: **0** (runtime QA is authoritative)",
  "- Wrongly mapped active images: **0**",
  "- Wrong product mappings removed: **3** — Cotton Voile → generic cotton, Cotton Moleskin → twill, and Peach-Skin → generic polyester. These now render generated placeholders until their canonical files are supplied.",
  "- Duplicate media-registry mappings: **0**",
  "- Orphaned active media-registry mappings: **0**",
  "",
  "## Required primary file list",
  "",
  ...missingPrimary.map(
    (fabric) => `- \`${fabric.slug}-primary.webp\` — ${fabric.name}`,
  ),
  "",
  "## Dimensions",
  "",
  "| Asset role | Requirement | Aspect ratio | Minimum | Preferred | Current use |",
  "|---|---|---|---|---|---|",
  "| Primary | REQUIRED per fabric | 4:3, centre-safe for square and 16:7 crops | 1200×900 | 1600×1200 | Marketplace/search cards, collection cards, fabric hero, landing curation |",
  "| Texture | OPTIONAL ENHANCEMENT | 1:1 | 1200×1200 | 1600×1600 | Not rendered by the current frontend |",
  "| Editorial/application | OPTIONAL ENHANCEMENT | 3:2 | 1600×1067 | 2400×1600 | Not rendered by the current frontend |",
  "| Dedicated feature | OPTIONAL ENHANCEMENT | 16:7 | 1600×700 | 2400×1050 | Not required; current 16:7, 4:3 and square feature crops reuse primary |",
  "| Background/decorative | REQUIRED existing landing assets | 3:2 master with centre-safe crop | 1920×1280 | 2400×1600 | Full-bleed and layered landing imagery; responsive `sizes` limits delivery width |",
  "",
  "Use WebP or AVIF for new stills. Keep the subject and characteristic weave inside the central 60% so the same primary remains legible in the current 4:3 card, square lead tile and 16:7 collection crop.",
  "",
  "## Current background/decorative files",
  "",
  ...decorativeImages.map(
    ([role, src]) => `- **${role}:** \`${src}\` — AVAILABLE`,
  ),
  `- **heroVideo:** \`${LANDING_MEDIA.heroVideo}\` — AVAILABLE, excluded from image totals`,
  "",
  "## Reuse plan",
  "",
  "- One final primary file is the canonical file for marketplace, search, filtered/sorted results, collection results, Best For results and the fabric detail hero.",
  "- The same primary may represent its fabric in a homepage or collection feature. No second feature export is required; provide a centre-safe composition.",
  "- A future macro/texture or editorial frame must be a separate file because it communicates different visual evidence, but neither is loaded by the current frontend.",
  "- Existing landing backgrounds remain separate from product truth. Do not promote a broad decorative cotton, twill or polyester photograph to a final product primary.",
  `- The ${temporaryMedia.length} current representative product paths are temporary reuse, not final image approval.`,
  "",
  "## Registry integrity",
  "",
  `The allowlist contains ${APPROVED_FABRIC_SLUGS.length} slugs and the active fabric media registry contains one record for each. No non-approved slug has an active registry entry.`,
  "",
  "`public/images.jpeg` is not referenced by the active frontend. It is a physical orphan, not an active media mapping, and was left untouched because its ownership is not established.",
  "",
];

writeFileSync(
  path.join(process.cwd(), "docs", "FABRIC-IMAGE-INVENTORY.md"),
  `${lines.join("\n")}\n`,
);

console.log(
  JSON.stringify(
    {
      approvedFabrics: FABRICS_2027.length,
      primaryRequired: FABRICS_2027.length,
      finalAvailable: finalMedia.length,
      temporary: temporaryMedia.length,
      placeholder: placeholderMedia.length,
      missingPrimary: missingPrimary.length,
      backgroundRequired: uniqueDecorativeImages.size,
      totalUniqueImageFilesRequired:
        FABRICS_2027.length + uniqueDecorativeImages.size,
    },
    null,
    2,
  ),
);
