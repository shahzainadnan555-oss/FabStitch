export { api, apiRequest } from "@/lib/api/client";
export type { ApiRequestOptions } from "@/lib/api/client";
export {
  API_BASE_URL,
  WS_BASE_URL,
  apiUrl,
  webSocketUrl,
} from "@/lib/api/config";
export {
  ApiError,
  apiErrorMessage,
  isApiErrorEnvelope,
  normalizeApiError,
} from "@/lib/api/errors";
export type {
  ApiErrorDetail,
  ApiErrorEnvelope,
} from "@/lib/api/errors";
export {
  appendQuery,
  queryString,
} from "@/lib/api/query";
export type {
  ApiQuery,
  QueryPrimitive,
  QueryValue,
} from "@/lib/api/query";
export type * from "@/lib/api/types";
