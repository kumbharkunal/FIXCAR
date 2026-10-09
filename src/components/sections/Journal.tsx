import { business, journalSection, posts } from "@/content/site";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T12:00:00+05:30`));

/** The three latest posts on fixcar.in, as an asymmetric editorial list linking to the live URLs. */
export function Journal() {
  const [featured, ...rest] = posts;
  return (
    <section aria-labelledby="journal-title" data-track="journal" className="section pt-0">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-hairline pt-12 lg:pt-16">
          <h2 id="journal-title" data-section-heading className="type-display-l max-w-[16ch]">
            {journalSection.title}
          </h2>
          <a className="link inline-flex min-h-11 items-center" href={business.blogUrl} target="_blank" rel="noopener noreferrer">
            {journalSection.allPosts}
          </a>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <article className="relative rounded-sheet bg-paper p-7 transition-colors duration-200 hover:bg-paper/70 lg:col-span-7 lg:p-12">
            <p className="type-small text-stone">
              <time dateTime={featured.publishedIso}>{formatDate(featured.publishedIso)}</time>, {journalSection.readTime(featured.readMinutes)}
            </p>
            <h3 className="type-display-m mt-4 max-w-[22ch]">
              <a href={featured.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-sheet">
                {featured.title}
              </a>
            </h3>
            <p className="type-lead mt-5 max-w-[46ch] text-stone">{featured.excerpt}</p>
          </article>

          <div className="grid content-start gap-0 lg:col-span-5">
            {rest.map((post) => (
              <article key={post.url} className="relative border-b border-hairline py-7 first:pt-0 lg:first:pt-2">
                <p className="type-small text-stone">
                  <time dateTime={post.publishedIso}>{formatDate(post.publishedIso)}</time>, {journalSection.readTime(post.readMinutes)}
                </p>
                <h3 className="mt-3 text-[1.375rem] font-bold leading-tight [font-stretch:104%]">
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 hover:text-racing">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-3 type-small text-stone">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
