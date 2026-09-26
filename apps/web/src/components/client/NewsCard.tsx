import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { NewsPost } from "@/data/news";

type NewsCardProps = {
  post: NewsPost;
  featured?: boolean;
  onDark?: boolean;
};

export function NewsCard({ post, featured = false, onDark = false }: NewsCardProps) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className={cn(
        "group",
        featured
          ? "grid items-center gap-4 sm:grid-cols-[minmax(0,16.5rem)_1fr] sm:gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]"
          : "flex flex-col gap-3 sm:gap-3.5"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          onDark ? "bg-white/5" : "bg-muted/10",
          featured ? "aspect-[16/10] h-auto max-h-44 sm:aspect-auto sm:h-40 lg:h-44" : "h-36 sm:h-40"
        )}
      >
        {post.image ? (
          <img
            src={post.image}
            alt={post.imageHasLabel ? post.label : ""}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              post.imageHasLabel &&
                "transition-transform duration-300 group-hover:scale-[1.03]"
            )}
            style={{ objectPosition: post.imagePosition ?? "center" }}
          />
        ) : null}
        {post.imageHasLabel ? null : (
          <>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                post.gradient,
                post.image ? "opacity-85 group-hover:opacity-75" : "opacity-100"
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="text-center text-lg font-medium tracking-[-0.02em] text-white sm:text-xl">
                {post.label}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5">
        <time
          dateTime={post.isoDate}
          className={cn("text-sm", onDark ? "text-white/50" : "text-muted-foreground")}
        >
          {post.date}
        </time>
        <h3
          className={cn(
            "font-medium leading-snug tracking-[-0.01em] transition-colors",
            onDark
              ? "text-white group-hover:text-white/80"
              : "text-foreground group-hover:text-foreground/80",
            featured ? "text-lg sm:text-xl" : "text-base sm:text-[1.05rem]"
          )}
        >
          {post.title}
        </h3>
        {featured ? (
          <p
            className={cn(
              "max-w-2xl text-sm leading-relaxed sm:text-[15px]",
              onDark ? "text-white/55" : "text-muted-foreground"
            )}
          >
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
