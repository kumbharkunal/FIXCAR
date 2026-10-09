import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/env";

/** The demo blocks all crawlers unless NEXT_PUBLIC_NOINDEX is "false" (production). */
export default function robots(): MetadataRoute.Robots {
  if (noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
