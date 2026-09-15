import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  trailingSlash: true,
  experimental: {
    cpus: 2,
    staticGenerationMinPagesPerWorker: 200,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 1,
  },
  staticPageGenerationTimeout: 240,
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.fabstitch.net",
      },
      {
        protocol: "https",
        hostname: "fabstitch.net",
      },
      {
        protocol: "https",
        hostname: "www.fabstitch.net",
      },
      // Migration only: legacy absolute media URLs may still resolve on the
      // previous API host until catalog assets are rewritten to api.fabstitch.net.
      {
        protocol: "https",
        hostname: "fabstitch-backend.fastapicloud.dev",
      },
    ],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
