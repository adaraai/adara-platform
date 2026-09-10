import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="cta" className="section-auto py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <div className="relative grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0a] sm:rounded-[2rem] md:grid-cols-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent"
          />
          <div
            aria-hidden
            className="cta-dot-grid pointer-events-none absolute inset-0"
          />

          <div className="relative z-10 flex flex-col justify-center p-6 text-white sm:p-8 md:p-14">
            <h2 className="text-balance text-[clamp(1.875rem,3.5vw,3rem)] font-semibold leading-tight tracking-tight text-white">
              Build with ADARA
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Free API access. Documentation in minutes. Start shipping AI that understands African languages today.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/signup"
                className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-white px-7 text-base font-medium text-neutral-900 transition-colors hover:bg-white/90 sm:w-auto"
              >
                Get started
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/documentation"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/30 px-7 text-base font-medium text-white transition-colors hover:border-white/45 hover:bg-white/10 sm:w-auto"
              >
                Documentation
              </Link>
            </div>
          </div>

          <div className="relative min-h-[240px] w-full sm:min-h-[280px] md:min-h-full">
            <img
              src="/assets/adara-cta.webp"
              alt="ADARA context API on mobile"
              className="absolute inset-0 h-full w-full object-cover object-top sm:object-center"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width={960}
              height={960}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
