const layers = [
  {
    title: "Data & corpus",
    description: "Language and cultural datasets built with local researchers and communities.",
  },
  {
    title: "Models",
    description: "Speech and language models tuned for African languages and accents.",
  },
  {
    title: "Developer tools",
    description: "APIs for translation, speech, and cultural context you can plug into any product.",
  },
  {
    title: "Applied products",
    description: "Practical tools that put African understanding to work for everyday users.",
  },
];

export function ApproachSection() {
  return (
    <section id="approach" className="relative isolate overflow-hidden border-t border-white/10 bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/assets/platform-bg.webp"
          alt=""
          className="h-full w-full object-cover object-center brightness-[0.75] contrast-[1.05]"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[clamp(1.65rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            Everything you need to build with{" "}
            <span className="text-white/45">African context.</span>
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:mt-12 sm:grid-cols-2 sm:gap-4">
          {layers.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl px-4 py-4 sm:px-5 sm:py-5"
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 transition-transform duration-300 group-hover:scale-x-100"
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
    </section>
  );
}
