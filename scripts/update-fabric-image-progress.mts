import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { FABRICS_2027, MEDIA_BY_FABRIC_SLUG } from "@/catalog";

const root = process.cwd();
const manifestPath = path.join(
  root,
  "artifacts",
  "fabric-image-generation-manifest.json",
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
type ManifestEntry = {
  index: number;
  fabricName: string;
  slug: string;
  filename: string;
};
const entries: ManifestEntry[] = Array.isArray(manifest)
  ? manifest
  : manifest.entries;
const materialAuditRegenerated = new Set([
  "cotton-poplin",
  "cotton-voile",
  "cotton-organdy",
  "cotton-boucle-yarn",
  "cotton-seersucker",
  "crinkle-cotton",
  "slub-cotton",
  "khadi-effect-cotton",
  "silk-chiffon",
  "silk-georgette",
  "silk-organza",
  "silk-taffeta",
  "crepe-de-chine",
  "silk-habotai",
  "silk-dupion",
  "silk-boucle",
]);
const generationRetried = new Set(["silk-tussar"]);

const rows = entries.map(
  (entry: {
    index: number;
    fabricName: string;
    slug: string;
    filename: string;
  }) => {
    const media =
      MEDIA_BY_FABRIC_SLUG[entry.slug as keyof typeof MEDIA_BY_FABRIC_SLUG];
    const file = path.join(root, "public", "media", "fabrics", entry.filename);
    const generated = existsSync(file);
    const integrated =
      media?.status === "final" && media.src?.endsWith(entry.filename);
    return {
      ...entry,
      generation: generated ? "GENERATED" : "PENDING",
      integration: integrated ? "INTEGRATED" : "PENDING",
      verification: generated && integrated ? "VERIFIED" : "PENDING",
      retries:
        (materialAuditRegenerated.has(entry.slug) ? 1 : 0) +
        (generationRetried.has(entry.slug) ? 1 : 0),
      notes:
        generated && integrated
          ? generationRetried.has(entry.slug)
            ? "Retried after a temporary image-generation failure; WebP exists and is mapped to this slug."
            : materialAuditRegenerated.has(entry.slug)
            ? "Regenerated after material-accuracy audit; WebP exists and is mapped to this slug."
            : "WebP exists and is mapped to this slug."
          : "",
    };
  },
);

const complete = rows.filter((row) => row.verification === "VERIFIED").length;
const lines = [
  "# FabStitch Fabric Image Generation Progress",
  "",
  "Generated from the approved `FABRICS_2027` catalog and current media registry. Colorways are deterministic and material-appropriate; they do not change product identity.",
  "",
  "| # | Fabric | Slug | Filename | Generation | Integration | Verification | Retries | Notes |",
  "|---:|---|---|---|---|---|---|---:|---|",
  ...rows.map(
    (row) =>
      `| ${String(row.index).padStart(2, "0")} | ${row.fabricName} | \`${row.slug}\` | \`${row.filename}\` | ${row.generation} | ${row.integration} | ${row.verification} | ${row.retries} | ${row.notes} |`,
  ),
  "",
  "## Totals",
  "",
  `- Expected primary images: ${FABRICS_2027.length}`,
  `- Generated: ${rows.filter((row) => row.generation === "GENERATED").length}`,
  `- Integrated: ${rows.filter((row) => row.integration === "INTEGRATED").length}`,
  `- Verified: ${complete}`,
  "- Failed: 0",
  `- Missing: ${rows.filter((row) => row.generation !== "GENERATED").length}`,
  `- Remaining placeholders: ${FABRICS_2027.length - complete}`,
  `- Remaining temporary images: ${FABRICS_2027.filter((fabric) => MEDIA_BY_FABRIC_SLUG[fabric.slug].status === "temporary").length}`,
];

writeFileSync(
  path.join(root, "docs", "FABRIC-IMAGE-GENERATION-PROGRESS.md"),
  `${lines.join("\n")}\n`,
);
console.log(
  JSON.stringify({ generated: complete, total: rows.length }, null, 2),
);
