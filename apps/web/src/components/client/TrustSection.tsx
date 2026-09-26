const pillars = [
  {
    title: "Consent-first data",
    description: "Clear consent, fair attribution, and benefit for contributing communities.",
  },
  {
    title: "Your data, your control",
    description: "Regional hosting when sensitive workloads need to stay close to home.",
  },
  {
    title: "Safe by design",
    description: "Safeguards so African-language AI is harder to misuse.",
  },
  {
    title: "Local context protection",
    description: "Tools that catch fraud and harm in languages global systems often miss.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-14 sm:gap-10 sm:px-6 sm:py-24 md:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 overflow-hidden rounded-2xl bg-[#0a0a0a] ring-1 ring-white/10 md:order-1">
          <img
            src="/assets/trust-security.webp"
            alt="Shield with checkmark representing trust and safety"
            className="block h-auto w-full"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="order-1 flex h-full min-h-0 flex-col md:order-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-adara-orange-light">
              Trust & safety
            </p>
            <h2 className="mt-3 text-[clamp(1.65rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em]">
              Built to be trusted.
            </h2>
            <p className="mt-4 max-w-md text-base font-light leading-[1.5] text-white/55 sm:text-lg">
              Consent, privacy, and safety are part of the product.
            </p>
          </div>

          <div className="mt-8 grid flex-1 grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:grid-rows-2 sm:gap-4">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="group relative flex h-full min-h-[7rem] flex-col justify-end overflow-hidden rounded-2xl bg-white/[0.05] px-5 py-5 transition-colors duration-300 hover:bg-white/[0.09] sm:min-h-0 sm:px-6 sm:py-6"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
                <h3 className="text-[15px] font-bold tracking-[-0.01em] text-white">{item.title}</h3>
                <p className="mt-2 text-[13px] font-light leading-[1.5] text-white/55">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
