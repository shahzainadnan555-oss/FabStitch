import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { FABRICS_2027 } from "@/catalog";
import type { CatalogProduct } from "@/catalog";

const root = process.cwd();
const outputDir = path.join(root, "artifacts");
mkdirSync(outputDir, { recursive: true });

const globalStyle =
  "Premium FabStitch textile catalog photography; photorealistic commercial studio image; warm-white soft-neutral background; soft directional studio lighting; natural realistic shadows; minimal sophisticated composition; fabric is the only hero; 4:3 landscape; defining material behavior inside the central 60 percent safe area; no people, hands, models, mannequins, clothing, furniture, tools, packaging, labels, text, typography, logos, watermarks, props, collage, border, UI, fantasy material, illustration, or CGI appearance.";

const entries = FABRICS_2027.map((fabric: CatalogProduct, index) => {
  const characteristics = [
    ...(fabric.composition ?? []),
    ...(fabric.construction ?? []),
    ...(fabric.characteristics ?? []),
    ...(fabric.measurements ?? []).map((measurement) => {
      const range =
        measurement.exact ??
        (measurement.min !== undefined && measurement.max !== undefined
          ? `${measurement.min}-${measurement.max}`
          : (measurement.min ?? measurement.max ?? ""));
      return range ? `${range} ${measurement.unit}` : measurement.unit;
    }),
  ];
  const context = [
    `named fabric: ${fabric.name}`,
    characteristics.length
      ? `material specifics: ${characteristics.join("; ")}`
      : "material specifics: accurately render the named construction and surface",
    fabric.seasons.length
      ? `season direction: ${fabric.seasons.join(", ")}`
      : "",
    fabric.applications.length
      ? `appropriate use context: ${fabric.applications.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join(". ");

  return {
    index: index + 1,
    fabricName: fabric.name,
    slug: fabric.slug,
    filename: `${fabric.slug}-primary.webp`,
    source: fabric.source,
    characteristics,
    prompt: `${globalStyle} Photograph ${context}. Show a carefully arranged close textile surface with natural folds appropriate to this exact material, realistic weave/fiber/yarn/pile/grain/transparency/density, and commercially useful neutral color variation. Do not make it generic or substitute another textile.`,
    generationStatus: "PENDING",
    integrationStatus: "PENDING",
    verificationStatus: "PENDING",
    retryCount: 0,
    notes: "",
  };
});

if (entries.length !== FABRICS_2027.length) {
  throw new Error(
    `Expected ${FABRICS_2027.length} approved fabrics, found ${entries.length}`,
  );
}

writeFileSync(
  path.join(outputDir, "fabric-image-generation-manifest.json"),
  `${JSON.stringify({ globalStyle, entries }, null, 2)}\n`,
);

const progress = [
  "# FabStitch Fabric Image Generation Progress",
  "",
  "Generated from the approved `FABRICS_2027` catalog. One canonical primary WebP is required per identity.",
  "",
  "| # | Fabric | Slug | Filename | Generation | Integration | Verification | Retries | Notes |",
  "|---:|---|---|---|---|---|---|---:|---|",
  ...entries.map(
    (entry) =>
      `| ${String(entry.index).padStart(2, "0")} | ${entry.fabricName} | \`${entry.slug}\` | \`${entry.filename}\` | ${entry.generationStatus} | ${entry.integrationStatus} | ${entry.verificationStatus} | ${entry.retryCount} | ${entry.notes} |`,
  ),
  "",
  "## Totals",
  "",
  `- Expected primary images: ${FABRICS_2027.length}`,
  "- Generated: 0",
  "- Integrated: 0",
  "- Verified: 0",
  "- Failed: 0",
  `- Missing: ${FABRICS_2027.length}`,
];
writeFileSync(
  path.join(root, "docs", "FABRIC-IMAGE-GENERATION-PROGRESS.md"),
  `${progress.join("\n")}\n`,
);

console.log(
  JSON.stringify(
    {
      fabrics: entries.length,
      manifest: "artifacts/fabric-image-generation-manifest.json",
      progress: "docs/FABRIC-IMAGE-GENERATION-PROGRESS.md",
    },
    null,
    2,
  ),
);
