import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-10-09T00:00:00+05:30"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
