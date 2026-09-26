import { useMemo, useState, useEffect } from "react";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { NewsCard } from "@/components/client/NewsCard";
import { NEWS_LABELS, NEWS_POSTS } from "@/data/news";
import { cn } from "@/lib/utils";

export default function News() {
  const [label, setLabel] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "News | Adara";
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      document.title = "Adara, Data and tools that make AI understand Africa";
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  const posts = useMemo(
    () => (label === "All" ? NEWS_POSTS : NEWS_POSTS.filter((post) => post.label === label)),
    [label]
  );

  const featured = label === "All" ? posts[0] : null;
  const gridPosts = featured ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />
      <main className="pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[4.25rem]">
        <section className="py-12 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Adara
              </p>
              <h1 className="mt-3 text-[clamp(1.85rem,5.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.035em] text-neutral-900">
                Latest news
                <span className="font-normal text-neutral-400"> from the lab.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
                Models, corpus, APIs, and security, updates as we ship.
              </p>
            </div>

            <div className="mt-8 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {NEWS_LABELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLabel(item)}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm transition-colors",
                    label === item
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {featured ? (
              <div className="mt-12">
                <NewsCard post={featured} featured />
              </div>
            ) : null}

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-6">
              {gridPosts.map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="light" />
    </div>
  );
}
