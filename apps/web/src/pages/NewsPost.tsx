import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { NewsCard } from "@/components/client/NewsCard";
import { getNewsPost, getRelatedNews } from "@/data/news";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, useSeo } from "@/lib/seo";

export default function NewsPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getNewsPost(slug) : undefined;
  const related = slug ? getRelatedNews(slug) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (wasDark) root.classList.add("dark");
    };
  }, [slug]);

  useSeo(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          path: `/news/${post.slug}`,
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.isoDate,
            url: `${SITE_URL}/news/${post.slug}`,
            image: DEFAULT_IMAGE,
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        }
      : { title: "Story not found", noindex: true },
  );

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-neutral-900">
        <Header />
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-neutral-900">
            Story not found
          </h1>
          <p className="mt-3 text-neutral-500">That post is not in the archive.</p>
          <Link
            to="/news"
            className="mt-8 inline-flex items-center gap-2 text-sm text-neutral-900 hover:text-neutral-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to news
          </Link>
        </main>
        <Footer variant="light" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />
      <main className="pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[4.25rem]">
        <article className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All posts
            </Link>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              {post.label}
            </p>
            <h1 className="mt-3 text-[clamp(1.875rem,4.2vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.035em] text-neutral-900">
              {post.title}
            </h1>
            <time
              dateTime={post.isoDate}
              className="mt-4 block text-sm text-neutral-500"
            >
              {post.date}
            </time>

            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.imageHasLabel ? post.label : ""}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: post.imagePosition ?? "center" }}
                />
              ) : null}
              {post.imageHasLabel ? null : (
                <>
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      post.gradient,
                      post.image && "opacity-80"
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <span className="text-center text-2xl font-medium tracking-[-0.02em] text-white sm:text-3xl">
                      {post.label}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-10 space-y-6">
              {post.body.map((block, index) =>
                block.type === "h2" ? (
                  <h2
                    key={index}
                    className="pt-4 text-xl font-bold tracking-[-0.02em] text-neutral-900 sm:text-2xl"
                  >
                    {block.text}
                  </h2>
                ) : (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-neutral-700 sm:text-lg sm:leading-relaxed"
                  >
                    {block.text}
                  </p>
                )
              )}
            </div>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-neutral-200 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-neutral-900 sm:text-2xl">
                More from the lab
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <NewsCard key={item.slug} post={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer variant="light" />
    </div>
  );
}
