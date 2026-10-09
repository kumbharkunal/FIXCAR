"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/ArrowRight";
import * as m from "motion/react-m";
import { useState, type KeyboardEvent } from "react";
import { reviewsSection, ui, type Review } from "@/content/site";

const SPRING = { type: "spring", stiffness: 420, damping: 38 } as const;

/**
 * One review at a time: a verbatim sentence large, the full review below. Swipe or drag
 * (Motion), arrow buttons, or the arrow keys. No autoplay. All reviews are in the page
 * for search engines; slides out of view are inert so focus stays on the visible one.
 */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const go = (next: number) => setIndex(Math.max(0, Math.min(count - 1, next)));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div className="mt-12 lg:mt-16" role="region" aria-roledescription="carousel" aria-label={ui.reviewsCarousel} onKeyDown={onKeyDown}>
      <div className="overflow-hidden">
        <m.div
          drag="x"
          dragSnapToOrigin
          dragElastic={0.18}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
            else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
          }}
          className="cursor-grab touch-pan-y active:cursor-grabbing"
        >
          <m.div className="flex" initial={false} animate={{ x: `${-index * 100}%` }} transition={SPRING}>
            {reviews.map((review, i) => (
              <div
                key={review.author}
                role="group"
                aria-roledescription="slide"
                aria-label={reviewsSection.slideLabel(i + 1, count)}
                aria-hidden={i !== index || undefined}
                inert={i !== index}
                className="w-full shrink-0 pr-6"
              >
                <figure>
                  <blockquote>
                    <p className="type-quote max-w-[28ch]">“{review.pull}”</p>
                    <p className="mt-6 max-w-[62ch] text-stone">{review.text}</p>
                  </blockquote>
                  <figcaption className="mt-6 font-semibold">{review.author}</figcaption>
                </figure>
              </div>
            ))}
          </m.div>
        </m.div>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <button type="button" className="icon-btn" aria-label={ui.previousReview} disabled={index === 0} onClick={() => go(index - 1)}>
          <ArrowLeftIcon size={20} aria-hidden />
        </button>
        <button type="button" className="icon-btn" aria-label={ui.nextReview} disabled={index === count - 1} onClick={() => go(index + 1)}>
          <ArrowRightIcon size={20} aria-hidden />
        </button>
        <p className="sr-only" aria-live="polite">
          {reviewsSection.slideLabel(index + 1, count)}
        </p>
      </div>
    </div>
  );
}
