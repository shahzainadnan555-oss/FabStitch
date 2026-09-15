const base = (
  process.env.BACKEND_ORIGIN ??
  new URL(
    process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.VITE_API_BASE_URL ??
      "https://fabstitch-backend.fastapicloud.dev/api/v1",
  ).origin
).replace(/\/$/, "");

const checks = [];
for (const path of ["/health/live", "/health", "/ready"]) {
  const startedAt = performance.now();
  try {
    const response = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.json().catch(() => null);
    checks.push({
      path,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      body,
    });
  } catch (error) {
    checks.push({
      path,
      status: null,
      durationMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

console.log(JSON.stringify({ base, checks }, null, 2));
if (checks.some((check) => check.status !== 200)) process.exitCode = 1;
