import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // Spanish-facing URLs map to English file paths via rewrites (repo convention:
  // no non-English file/dir names). Slugs are wired in later slices.
  async rewrites() {
    return [
      { source: "/privacidad", destination: "/legal/privacidad" },
      { source: "/terminos", destination: "/legal/terminos" },
    ];
  },
};

export default nextConfig;
