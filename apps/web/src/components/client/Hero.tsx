import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { HeroTechPattern } from "@/components/client/HeroTechPattern";
import { FlagMarquee } from "@/components/client/FlagMarquee";

export function Hero() {
  return (
    <section className="relative isolate bg-background">
      <div className="hero-frame relative mx-auto flex w-full max-w-7xl flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
        <HeroTechPattern />

        <div className="hero-content relative z-10 mx-auto flex min-h-0 w-full max-w-[920px] flex-1 flex-col items-center justify-center pb-8 pt-[calc(5.5rem+env(safe-area-inset-top))] text-center sm:pb-10 sm:pt-28">
          <Link
            to="/products"
            className="mb-6 inline-flex max-w-full items-center justify-center gap-x-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-1 text-[11px] leading-tight text-foreground/90 transition-colors hover:border-border hover:bg-muted/50 sm:mb-8 sm:gap-2.5 sm:px-3 sm:py-1.5 sm:pl-1.5 sm:pr-4 sm:text-[15px] sm:leading-snug dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:border-white/30 dark:hover:bg-white/15"
          >
            <span className="shrink-0 rounded-full border border-[hsl(var(--adara-pink)/0.8)] bg-[hsl(var(--adara-pink)/0.15)] px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide text-[hsl(var(--adara-pink))] sm:px-2.5 sm:py-[3px] sm:text-xs">
              NEW
            </span>
            <span className="truncate sm:text-left">
              Africa Context API
              <span className="text-muted-foreground/60 dark:text-white/40"> · </span>
              Now available
            </span>
            <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-border/60 sm:h-4 sm:w-4 dark:border-white/25">
              <ChevronRight className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5" />
            </span>
          </Link>

          <h1 className="hero-headline text-[clamp(2.5rem,10.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] sm:font-medium sm:leading-[1.1] sm:tracking-[-0.03em]">
            <span className="text-foreground">Data and tools that make AI</span>
            <br />
            <span className="text-gray-out">understand </span>
            <span className="font-semibold text-[hsl(var(--adara-pink))]">Africa</span>
            <span className="text-gray-out">.</span>
          </h1>

          <p className="hero-subcopy mt-5 max-w-[34rem] text-[1.1875rem] leading-relaxed text-foreground/75 sm:mt-6 sm:text-lg sm:text-muted-foreground md:text-xl dark:text-white/80 dark:sm:text-muted-foreground">
            Translation, speech, and cultural context for developers building in African markets.
          </p>

          <div className="mt-8 flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:mt-10 sm:w-auto sm:gap-3">
            <Link
              to="/signup"
              className="interactive-scale inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground px-4 text-[14px] font-medium text-background transition-colors hover:bg-foreground/90 sm:h-12 sm:w-auto sm:flex-none sm:px-7 sm:text-base dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90"
            >
              Try ADARA
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/documentation"
              className="interactive-scale inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border bg-background px-4 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-muted/30 sm:h-12 sm:w-auto sm:flex-none sm:px-7 sm:text-base dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/15"
            >
              <span className="sm:hidden">Docs</span>
              <span className="hidden sm:inline">Documentation</span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-auto w-full pb-2 sm:pb-3">
          <p className="text-center text-sm text-muted-foreground">
            Languages and cultures across the continent
          </p>
          <div className="mt-4 w-full min-w-0">
            <FlagMarquee />
          </div>
        </div>
      </div>
    </section>
  );
}
