export type ApiErrorDetail = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
  [key: string]: unknown;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    request_id?: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (!isRecord(value) || !isRecord(value.error)) return false;
  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  );
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly requestId?: string;
  readonly retryAfterSeconds?: number;

  constructor(input: {
    status: number;
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    requestId?: string;
    retryAfterSeconds?: number;
  }) {
    super(input.message);
    this.name = "ApiError";
    this.status = input.status;
    this.code = input.code;
    this.details = input.details ?? [];
    this.requestId = input.requestId;
    this.retryAfterSeconds = input.retryAfterSeconds;
  }
}

function retryAfterFromDetails(
  details: ApiErrorDetail[] | undefined,
): number | undefined {
  if (!details?.length) return undefined;
  for (const detail of details) {
    const candidate =
      detail.retry_after ??
      detail.retryAfter ??
      detail.retry_after_seconds ??
      detail.cooldown_seconds;
    const numeric =
      typeof candidate === "number" ? candidate : Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) return Math.ceil(numeric);
  }
  return undefined;
}

export function parseRetryAfterHeader(
  value: string | null,
): number | undefined {
  if (!value) return undefined;
  const asSeconds = Number(value);
  if (Number.isFinite(asSeconds) && asSeconds > 0) return Math.ceil(asSeconds);
  const asDate = Date.parse(value);
  if (!Number.isFinite(asDate)) return undefined;
  const seconds = Math.ceil((asDate - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
}

export function normalizeApiError(
  status: number,
  body: unknown,
  requestId?: string | null,
  retryAfterHeader?: string | null,
): ApiError {
  const headerRetry = parseRetryAfterHeader(retryAfterHeader ?? null);
  if (isApiErrorEnvelope(body)) {
    return new ApiError({
      status,
      code: body.error.code,
      message: body.error.message,
      details: body.error.details,
      requestId: body.error.request_id ?? requestId ?? undefined,
      retryAfterSeconds:
        headerRetry ?? retryAfterFromDetails(body.error.details),
    });
  }
  return new ApiError({
    status,
    code:
      status === 401
        ? "unauthorized"
        : status === 429
          ? "rate_limited"
          : "request_failed",
    message:
      status === 401
        ? "Your session has expired. Please sign in again."
        : status === 429
          ? "You're trying too quickly. Please wait a moment and try again."
          : "FabStitch could not complete this request.",
    requestId: requestId ?? undefined,
    retryAfterSeconds: headerRetry,
  });
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
