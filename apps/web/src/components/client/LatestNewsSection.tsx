import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/client/NewsCard";
import { Marquee } from "@/components/client/Marquee";
import { NEWS_POSTS } from "@/data/news";

export function LatestNewsSection() {
  return (
    <section id="news" className="relative isolate overflow-hidden border-t border-white/10 bg-black py-14 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <h2 className="text-[clamp(1.65rem,5vw,2.5rem)] font-bold tracking-[-0.02em] text-white">
            Latest news
          </h2>
          <Link
            to="/news"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            All posts
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black to-transparent sm:w-16"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black to-transparent sm:w-16"
            aria-hidden
          />

          <Marquee duration={50} gapClassName="gap-4 sm:gap-6" className="py-1">
            {NEWS_POSTS.map((post) => (
              <div
                key={post.slug}
                className="w-[14.5rem] shrink-0 sm:w-[17.5rem]"
              >
                <NewsCard post={post} onDark />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
