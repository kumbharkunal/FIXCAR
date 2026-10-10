"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface MapEmbedProps {
  src: string;
  title: string;
  /** Shown until the map has loaded (rendered on the server and passed in). */
  placeholder: ReactNode;
}

/**
 * The Google Maps embed, added only as the footer approaches (Google's map scripts are
 * heavy), then faded in once it has loaded. A muted, warm tint keeps it in the page's
 * palette; hover or focus brings back full colour. The frame's scroll reveal is in
 * FooterMotion ([data-map-frame], [data-map-inner]).
 */
export function MapEmbed({ src, title, placeholder }: MapEmbedProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="map-frame" data-map-frame data-loaded={loaded || undefined}>
      <div className="map-inner" data-map-inner>
        <div className="map-placeholder" aria-hidden>
          {placeholder}
        </div>
        {near ? (
          <iframe
            src={src}
            title={title}
            className="map-iframe"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        ) : null}
      </div>
    </div>
  );
}
