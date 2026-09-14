import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = process.env.NEXT_DIST_DIR ?? ".next";
const budget = JSON.parse(
  readFileSync(path.join(root, "performance-budgets.json"), "utf8"),
);

function files(directory, predicate) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? files(file, predicate)
      : predicate(file)
        ? [file]
        : [];
  });
}

function measured(filePaths) {
  return filePaths
    .map((file) => ({
      file: path.relative(root, file),
      bytes: statSync(file).size,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

const javascript = measured(
  files(
    path.join(root, distDir, "static/chunks"),
    (file) => file.endsWith(".js"),
  ),
);
const css = measured(
  files(path.join(root, distDir, "static"), (file) => file.endsWith(".css")),
);
const images = measured(
  files(path.join(root, "public"), (file) =>
    /\.(?:avif|webp|png|jpe?g)$/i.test(file),
  ),
);
const videos = measured(
  files(path.join(root, "public"), (file) => /\.(?:mp4|webm)$/i.test(file)),
);

if (!javascript.length)
  throw new Error(
    "No production JavaScript chunks found. Run next build first.",
  );

const measurements = {
  largestJavaScript: javascript[0],
  totalJavaScriptBytes: javascript.reduce((sum, item) => sum + item.bytes, 0),
  javascriptChunkCount: javascript.length,
  totalCssBytes: css.reduce((sum, item) => sum + item.bytes, 0),
  cssFileCount: css.length,
  largestImage: images[0] ?? null,
  imageCount: images.length,
  largestVideo: videos[0] ?? null,
  videoCount: videos.length,
};

const failures = [];
if (
  measurements.largestJavaScript.bytes >
  budget.buildAssets.largestJavaScriptBytes
)
  failures.push(
    `largest JavaScript chunk ${measurements.largestJavaScript.bytes} > ${budget.buildAssets.largestJavaScriptBytes}`,
  );
if (measurements.totalCssBytes > budget.buildAssets.totalCssBytes)
  failures.push(
    `total CSS ${measurements.totalCssBytes} > ${budget.buildAssets.totalCssBytes}`,
  );
if (
  measurements.largestImage &&
  measurements.largestImage.bytes > budget.buildAssets.largestImageBytes
)
  failures.push(
    `largest image ${measurements.largestImage.bytes} > ${budget.buildAssets.largestImageBytes}`,
  );
if (
  measurements.largestVideo &&
  measurements.largestVideo.bytes > budget.buildAssets.largestVideoBytes
)
  failures.push(
    `largest video ${measurements.largestVideo.bytes} > ${budget.buildAssets.largestVideoBytes}`,
  );

const report = {
  budget,
  distDir,
  measurements,
  note: "Build asset sizes are raw bytes. Core Web Vitals and route transfer budgets are measured by seo-browser-performance.mjs against a running production server.",
  failures,
};

const artifacts = path.join(root, "artifacts");
mkdirSync(artifacts, { recursive: true });
writeFileSync(
  path.join(artifacts, "performance-budget.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
