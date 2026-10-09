import type { MetadataRoute } from "next";
import { business } from "@/content/site";
import { tokens } from "@/lib/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name}: doorstep car service in Dehradun`,
    short_name: business.name,
    description: business.description,
    start_url: "/",
    display: "standalone",
    background_color: tokens.limewash,
    theme_color: tokens.limewash,
    lang: "en-IN",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
