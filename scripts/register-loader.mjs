import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Teaches plain Node the two import rules this project relies on.
 *
 * Node strips TypeScript types natively but does not read `tsconfig.json`, so
 * `@/domain/...` and extensionless imports fail outside the bundler. Resolving
 * them here lets `scripts/qa.ts` run the **real** domain modules rather than a
 * copy - a QA harness that duplicates the logic it checks proves only that the
 * duplicate agrees with itself.
 *
 * Usage: `node --import=./scripts/register-loader.mjs scripts/qa.ts`
 */

const root = path.resolve(import.meta.dirname, "..");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs"];

function firstExisting(base) {
  if (path.extname(base) && existsSync(base)) return base;
  for (const extension of EXTENSIONS) {
    if (existsSync(`${base}${extension}`)) return `${base}${extension}`;
  }
  for (const extension of EXTENSIONS) {
    const candidate = path.join(base, `index${extension}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = null;

    if (specifier.startsWith("@/")) {
      target = firstExisting(path.join(root, specifier.slice(2)));
    } else if (specifier.startsWith(".") && context.parentURL) {
      const parent = path.dirname(fileURLToPath(context.parentURL));
      target = firstExisting(path.resolve(parent, specifier));
    }

    // `.ts` is declared as `module-typescript` explicitly. Without the hint
    // Node reparses each file to guess CJS vs ESM and warns about it; with it,
    // types are stripped and the file is treated as ESM directly. Anything
    // else (".tsx", ".js") is left for Node to infer.
    if (target) {
      return {
        url: pathToFileURL(target).href,
        format: target.endsWith(".ts") ? "module-typescript" : undefined,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});
