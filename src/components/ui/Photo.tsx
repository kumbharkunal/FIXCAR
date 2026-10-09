import { getImageProps, type ImageProps, type StaticImageData } from "next/image";

interface PhotoProps extends Omit<ImageProps, "src" | "placeholder" | "blurDataURL"> {
  src: StaticImageData;
  /** Paint the build-time blur under the photo until it loads. */
  blur?: boolean;
}

/**
 * next/image's srcset, sizes, lazy loading and blur-up, rendered on the server as a plain
 * <img>, so photos add no client JavaScript. The blur is never removed, which is invisible
 * because every photo on the page is opaque and covers it once loaded.
 */
export function Photo({ blur = true, ...rest }: PhotoProps) {
  const { alt, ...props } = getImageProps({ ...rest, placeholder: blur ? "blur" : "empty" }).props;
  // eslint-disable-next-line @next/next/no-img-element -- these are next/image props, minus the client component
  return <img alt={alt} {...props} />;
}
