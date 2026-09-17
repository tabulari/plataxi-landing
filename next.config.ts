import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Spanish-facing URLs map to English file paths via rewrites (repo convention:
  // no non-English file/dir names). Slugs are wired in later slices.
  async rewrites() {
    return [
      { source: "/privacidad", destination: "/legal/privacidad" },
      { source: "/terminos", destination: "/legal/terminos" },
    ];
  },
  // The root layout is force-dynamic (server reads Core's live rates), so Next
  // already emits no-store on the document response. This header is the
  // belt-and-suspenders guarantee against a reverse proxy/CDN in front of the
  // app overriding or stripping that origin header and serving a stale page
  // after deploy. /_next/* is excluded: Next already manages Cache-Control for
  // its hashed static/image assets, and overriding it here breaks dev behavior.
  async headers() {
    return [
      {
        source: "/((?!_next/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
