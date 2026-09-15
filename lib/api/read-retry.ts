import { ApiError } from "@/lib/api/errors";

/** Transient failures that are safe to retry for idempotent GET reads. */
export function isRetryableReadError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (!(error instanceof ApiError)) return false;
  if (error.code === "timeout") return true;
  if (error.status === 429) return false;
  if (error.status >= 500) return true;
  if (error.status === 408) return true;
  return false;
}

export async function withReadRetries<T>(
  operation: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 250;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !isRetryableReadError(error)) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
