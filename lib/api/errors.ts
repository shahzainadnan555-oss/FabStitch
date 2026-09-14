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

  constructor(input: {
    status: number;
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    requestId?: string;
  }) {
    super(input.message);
    this.name = "ApiError";
    this.status = input.status;
    this.code = input.code;
    this.details = input.details ?? [];
    this.requestId = input.requestId;
  }
}

export function normalizeApiError(
  status: number,
  body: unknown,
  requestId?: string | null,
): ApiError {
  if (isApiErrorEnvelope(body)) {
    return new ApiError({
      status,
      code: body.error.code,
      message: body.error.message,
      details: body.error.details,
      requestId: body.error.request_id ?? requestId ?? undefined,
    });
  }
  return new ApiError({
    status,
    code: status === 401 ? "unauthorized" : "request_failed",
    message:
      status === 401
        ? "Your session has expired. Please sign in again."
        : "FabStitch could not complete this request.",
    requestId: requestId ?? undefined,
  });
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
