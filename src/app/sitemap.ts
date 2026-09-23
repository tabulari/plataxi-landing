import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

// Legal pages are noindex until the final legal text ships (PLAN 1.9-1.11), so they
// stay out of the sitemap; re-add them when their `robots: { index: false }` is lifted.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.siteUrl.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];
}
