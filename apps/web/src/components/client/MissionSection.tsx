const cards = [
  {
    title: "Languages",
    description: "Speech and text that work across African languages and accents.",
  },
  {
    title: "Lived reality",
    description: "Local culture, commerce, and daily life built into every response.",
  },
];

export function MissionSection() {
  return (
    <section id="mission" className="border-t border-neutral-200 bg-white text-neutral-900">
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-14 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex h-full flex-col">
          <h2 className="text-[clamp(1.65rem,5.5vw,2.85rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            Teaching AI to understand Africa in its languages,{" "}
            <span className="text-neutral-400">its logic, and its lived reality.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base font-light leading-[1.55] text-neutral-500 sm:mt-6 sm:text-lg">
            Most AI misses African languages and local life. We build the data and tools that fix that.
          </p>

          <div className="mt-8 grid gap-3 sm:mt-auto sm:grid-cols-2 sm:gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl bg-[#F7F7F5] p-5 transition-colors duration-300 hover:bg-[#F0EFEB] sm:p-6"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
                <p className="text-[16px] font-bold tracking-[-0.01em] text-neutral-900">
                  {card.title}
                </p>
                <p className="mt-2 text-[13px] font-light leading-[1.55] text-neutral-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full min-h-[14rem] overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-black/5 sm:min-h-0">
          <img
            src="/assets/mission-voice.webp"
            alt="Person speaking into a phone with colorful voice waves"
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
