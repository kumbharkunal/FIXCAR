/**
 * Canonical and Open Graph base URL.
 * NEXT_PUBLIC_SITE_URL wins; on Vercel the project's production URL is used so link
 * previews of the demo work; otherwise the client's live domain.
 */
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

// `||`, not `??`: an empty value (as copied from .env.example) falls through to the default.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (vercelProductionHost ? `https://${vercelProductionHost}` : "https://www.fixcar.in");

/** The demo must not compete with the live site: noindex unless explicitly "false". */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

/** Vercel Analytics and Speed Insights only run on Vercel deployments. */
export const onVercel = Boolean(process.env.VERCEL);
