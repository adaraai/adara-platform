import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  label: string;
  href: string;
  children?: ReactNode;
  className?: string;
  image?: string;
  imagePosition?: string;
  cta?: string;
  compact?: boolean;
  layout?: "default" | "visual";
  surface?: "dark" | "auto";
};

export function BentoCard({
  label,
  href,
  children,
  className,
  image,
  imagePosition,
  cta = "Explore",
  compact = false,
  layout = "default",
  surface = "dark",
}: BentoCardProps) {
  const isVisual = layout === "visual";
  const autoSurface = isVisual && surface === "auto";
  const isTiled = isVisual && !image && Boolean(children);
  const hasVisual = Boolean(image) || isVisual;

  return (
    <Link
      to={href}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-2xl ring-0 ring-inset transition-[box-shadow,ring-width,ring-color] duration-300 hover:ring-1 hover:ring-border",
        hasVisual ? (autoSurface ? "bg-muted dark:bg-card" : "bg-[#0a0a0a]") : "bg-muted dark:bg-card",
        compact ? "min-h-0" : "min-h-[220px] h-full",
        isTiled && "p-1.5 sm:p-2",
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          loading={compact ? "eager" : "lazy"}
          decoding="async"
          width={960}
          height={960}
          className="bento-card-image absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition ?? "center" }}
        />
      )}

      {isTiled && (
        <div className="absolute inset-1.5 overflow-hidden sm:inset-2">{children}</div>
      )}

      {hasVisual && !isVisual && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
        />
      )}

      {!isVisual && (
        <>
          {image ? (
            <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end overflow-hidden pb-1">
              {children}
            </div>
          ) : (
            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-1">
              {children}
            </div>
          )}
        </>
      )}

      <div
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-between gap-3",
          isVisual
            ? "absolute inset-x-0 bottom-0 bg-transparent px-5 py-4 sm:px-6 sm:py-5"
            : cn("mt-auto bg-transparent", compact ? "px-4 py-2.5" : "px-5 py-3.5 sm:px-6")
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate font-medium tracking-[-0.02em]",
            hasVisual && !autoSurface ? "text-white" : "text-foreground",
            isVisual && !autoSurface && "drop-shadow-[0_1px_10px_rgba(0,0,0,0.75)]",
            isVisual ? "text-lg sm:text-xl" : compact ? "text-[15px]" : "text-lg sm:text-xl"
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 text-sm transition-colors",
            hasVisual && !autoSurface
              ? "text-white/80 group-hover:text-white"
              : "text-muted-foreground group-hover:text-foreground",
            isVisual && !autoSurface && "drop-shadow-[0_1px_10px_rgba(0,0,0,0.75)]"
          )}
        >
          {cta}
          {isVisual ? (
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </span>
      </div>
    </Link>
  );
}
