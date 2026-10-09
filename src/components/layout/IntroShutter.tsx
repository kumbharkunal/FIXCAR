import { Wordmark } from "@/components/ui/Wordmark";

/**
 * First-visit intro: a racing-green rolling shutter carrying the wordmark rolls up to
 * reveal the hero. Pure CSS (globals.css .intro), so it never waits for JavaScript and
 * never clips the hero underneath (LCP is unaffected). The head boot script hides it on
 * repeat visits in the same session; reduced motion hides it entirely.
 */
export function IntroShutter() {
  return (
    <div className="intro" aria-hidden="true">
      <Wordmark className="w-[min(62vw,22rem)] text-limewash" />
    </div>
  );
}
