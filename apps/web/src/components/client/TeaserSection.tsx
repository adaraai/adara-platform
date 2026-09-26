import { MintButton } from "@/components/client/MintButton";

export function TeaserSection() {
  return (
    <section id="teaser" className="relative isolate overflow-hidden border-t border-white/10 bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/assets/news-bg.webp"
          alt=""
          className="h-full w-full object-cover object-center brightness-[0.45] contrast-[1.1]"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div
          className="absolute left-1/2 top-[42%] h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen"
          style={{
            background:
              "conic-gradient(from 210deg at 50% 50%, transparent 0deg, rgba(34,211,238,0.55) 18deg, transparent 36deg, rgba(168,85,247,0.5) 58deg, transparent 78deg, rgba(244,114,182,0.45) 100deg, transparent 120deg, rgba(250,204,21,0.4) 145deg, transparent 165deg, rgba(52,211,153,0.45) 190deg, transparent 210deg, rgba(96,165,250,0.5) 235deg, transparent 255deg, rgba(251,146,60,0.4) 280deg, transparent 300deg, rgba(192,132,252,0.45) 325deg, transparent 360deg)",
          }}
        />
        <div
          className="absolute left-1/2 top-[42%] h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(34,211,238,0.2) 25%, rgba(168,85,247,0.15) 50%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65" />
      </div>

      <div className="relative mx-auto flex min-h-[20rem] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[26rem] sm:px-6 sm:py-28">
        <h2 className="text-[clamp(1.65rem,5.5vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em]">
          Ready to build with African context?
        </h2>
        <p className="mt-5 max-w-lg text-base font-light leading-[1.5] text-white/70 sm:text-lg">
          Start with the Africa Context API, or talk to us about your product and market.
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <MintButton href="/#contact" size="lg" className="w-full rounded-xl sm:w-auto">
            Schedule a discovery session
          </MintButton>
          <MintButton
            href="/#contact"
            size="lg"
            className="w-full rounded-xl bg-transparent text-white ring-1 ring-white/30 hover:bg-white/10 hover:text-white active:bg-white/15 sm:w-auto"
          >
            Talk to an expert
          </MintButton>
        </div>
      </div>
    </section>
  );
}
