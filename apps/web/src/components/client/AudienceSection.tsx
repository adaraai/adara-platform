const audiences = [
  {
    title: "Companies in Africa",
    description: "AI that works in local languages, not just a translated interface.",
  },
  {
    title: "Startups & builders",
    description: "Language and context ready to use, so you can ship faster.",
  },
  {
    title: "Public & civic teams",
    description: "Reach people in the languages they speak for health, education, and services.",
  },
  {
    title: "Everyday users",
    description: "Voice and messaging tools that help in your own language.",
  },
];

export function AudienceSection() {
  return (
    <section id="who-we-serve" className="border-t border-neutral-200 bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.65rem,5.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            For anyone building or living with AI in Africa.
          </h2>
          <p className="mt-4 text-base font-light leading-[1.5] text-neutral-500 sm:text-lg">
            From APIs to products, African context where it matters.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {audiences.map((item) => (
            <div
              key={item.title}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[#F7F7F5] p-5 transition-colors duration-300 hover:bg-[#F0EFEB] sm:p-6"
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
              <h3 className="text-[16px] font-bold tracking-[-0.01em] text-neutral-900">{item.title}</h3>
              <p className="mt-3 text-[13px] font-light leading-[1.55] text-neutral-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
