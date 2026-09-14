export type QueryPrimitive = string | number | boolean;
export type QueryValue =
  | QueryPrimitive
  | null
  | undefined
  | readonly (QueryPrimitive | null | undefined)[];
export type ApiQuery = Record<string, QueryValue>;

export function appendQuery(
  searchParams: URLSearchParams,
  query: ApiQuery,
): URLSearchParams {
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === undefined || value === null || value === "") continue;
      searchParams.append(key, String(value));
    }
  }
  return searchParams;
}

export function queryString(query?: ApiQuery): string {
  if (!query) return "";
  const value = appendQuery(new URLSearchParams(), query).toString();
  return value ? `?${value}` : "";
}
