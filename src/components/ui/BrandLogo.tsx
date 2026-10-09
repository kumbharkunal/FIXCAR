type BrandName = "instagram" | "facebook" | "whatsapp";

interface BrandLogoProps {
  name: BrandName;
  /** Rendered size in px (minimum 20; keep clear space around the mark). */
  size?: number;
  className?: string;
}

/**
 * An official social mark (Instagram, Facebook, WhatsApp) from the page sprite (SvgSprite).
 * Decorative (aria-hidden): the surrounding link or button carries the accessible name.
 */
export function BrandLogo({ name, size = 24, className }: BrandLogoProps) {
  const px = Math.max(20, size);
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <use href={`#fx-${name}`} />
    </svg>
  );
}
