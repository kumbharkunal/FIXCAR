import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { WORDMARK_PATH, WORDMARK_RATIO, WORDMARK_VIEWBOX } from "@/components/ui/wordmark-data";
import { hero, seo } from "@/content/site";
import { tokens } from "@/lib/tokens";

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static Archivo instances (the OG renderer cannot use variable or woff2 fonts). Read once.
const expanded = await readFile(join(process.cwd(), "src/app/fonts/Archivo-Expanded-ExtraBold.woff"));
const medium = await readFile(join(process.cwd(), "src/app/fonts/Archivo-Medium.woff"));

export default async function OpenGraphImage() {
  const wordmarkHeight = 64;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: tokens.limewash,
          color: tokens.ink,
          fontFamily: "Archivo",
        }}
      >
        <svg viewBox={WORDMARK_VIEWBOX} width={Math.round(wordmarkHeight * WORDMARK_RATIO)} height={wordmarkHeight}>
          <path fill={tokens.ink} fillRule="evenodd" d={WORDMARK_PATH} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {hero.lines.desktop.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: 28, fontWeight: 500, color: tokens.stone }}>{seo.ogCardLine}</div>
        </div>
        <div style={{ display: "flex", height: 12, width: "100%", borderRadius: 999, background: tokens.racing }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: expanded, weight: 800, style: "normal" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
