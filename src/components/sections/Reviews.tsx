import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { StarIcon } from "@phosphor-icons/react/dist/ssr/Star";
import { ReviewsCarousel } from "@/components/ui/ReviewsCarousel";
import { business, reviews, reviewsSection } from "@/content/site";

/** Three real testimonials from fixcar.in, in their exact words. Never invented. */
export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" data-track="reviews" className="section cv-auto bg-paper">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h2 id="reviews-title" data-section-heading className="type-display-l max-w-[14ch]">
            {reviewsSection.title}
          </h2>
          <div className="grid gap-1">
            <p className="flex items-center gap-2 font-semibold">
              <StarIcon size={20} weight="fill" className="text-racing" aria-hidden />
              {reviewsSection.rating}
            </p>
            <p className="type-small text-stone">{reviewsSection.ratingNote}</p>
            <a
              className="link inline-flex min-h-11 items-center type-small"
              href={business.google.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {reviewsSection.moreReviews}
            </a>
          </div>
        </div>
        <ReviewsCarousel
          reviews={reviews}
          previousIcon={<ArrowLeftIcon size={20} aria-hidden />}
          nextIcon={<ArrowRightIcon size={20} aria-hidden />}
        />
      </div>
    </section>
  );
}
