import { WORDMARK_PATH, WORDMARK_VIEWBOX } from "./wordmark-data";

interface WordmarkProps {
  className?: string;
  /** Accessible name. Omit when the wordmark sits inside a labelled link. */
  title?: string;
}

/** The client's "fixcar.in" wordmark, traced from their logo. One colour: it takes `currentColor`. */
export function Wordmark({ className, title }: WordmarkProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={WORDMARK_PATH} />
    </svg>
  );
}
