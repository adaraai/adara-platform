import { MintButton } from "@/components/client/MintButton";
import { PartnerLogoMarquee } from "@/components/client/PartnerLogoMarquee";
import { LazyVideo } from "@/components/client/LazyVideo";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <div className="relative flex min-h-[min(100svh,40rem)] w-full flex-col sm:min-h-[32rem] lg:min-h-[34rem]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black" aria-hidden>
          <div className="absolute inset-0">
            <LazyVideo
              id="horizon-video"
              eager
              src="/assets/video/horizon-hero.min.mp4"
              poster="/assets/video/horizon-hero-poster.webp"
              className="absolute inset-0 z-0 h-full w-full object-cover object-[center_58%] motion-reduce:hidden"
              aria-describedby="video-described-by-horizon"
            />
            <div
              className="absolute inset-0 z-0 hidden bg-[radial-gradient(ellipse_at_50%_70%,#5b3a7a_0%,#0b1020_45%,#000_75%)] motion-reduce:block"
              role="img"
              aria-label="Dark planet-like horizon with a glowing purple-to-teal atmosphere against a night sky."
            />
            <p className="sr-only" id="video-described-by-horizon">
              Cinematic loop of a planet-like horizon, with a shifting purple-to-teal atmospheric glow
              across a dark sky.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/45" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-[calc(4.25rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-10">
            <div className="relative w-full max-w-xl sm:max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-adara-orange-light">
                Adara AI Lab
              </p>
              <h1 className="mt-3 text-[clamp(1.75rem,7vw,3.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:mt-4 sm:leading-[1.2]">
                Data and tools that make AI{" "}
                <br className="hidden sm:block" />
                understand Africa.
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-base font-light leading-[1.45] text-white/80 sm:mt-4 sm:text-lg">
                In its languages, its logic, and its lived reality.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <MintButton href="/#contact" size="lg">
                  Contact us
                </MintButton>
                <MintButton
                  href="/#features"
                  size="lg"
                  className="bg-transparent text-white ring-1 ring-white/30 hover:bg-white/10 hover:text-white active:bg-white/15"
                >
                  Explore platform
                </MintButton>
              </div>
            </div>
          </div>

          {/* Logos sit on the video — in flow so they never collide with CTAs */}
          <PartnerLogoMarquee className="relative z-10 shrink-0 bg-transparent py-4 sm:py-5" />
        </div>
      </div>
    </section>
  );
}
