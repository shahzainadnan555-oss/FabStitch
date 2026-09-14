/**
 * Minimal class-name joiner.
 *
 * Deliberately dependency-free: `clsx` + `tailwind-merge` is ~8 kB for
 * behaviour this codebase does not need. Components here take a single
 * `className` escape hatch which is always concatenated last, and variant maps
 * never emit competing utilities for the same CSS property - so there is
 * nothing for a merge pass to resolve.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }

  return out.join(" ");
}
