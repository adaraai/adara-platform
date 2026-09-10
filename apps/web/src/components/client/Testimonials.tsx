import { ChevronRight } from "lucide-react";
import { Marquee } from "@/components/client/Marquee";

const testimonials1 = [
  {
    name: "Amara Okonkwo",
    title: "CTO",
    company: "Fintech Startup",
    quote:
      "Our Pidgin and local finance flows finally work. Generic models couldn't handle the context — ADARA could from day one.",
  },
  {
    name: "James Mwangi",
    title: "Product Lead",
    company: "AgriTech Kenya",
    quote:
      "Voice advice in Swahili for smallholder farmers changed how our product works in the field. Western AI missed our crops entirely.",
  },
  {
    name: "Fatima Diallo",
    title: "Director",
    company: "Public Health NGO",
    quote:
      "Health messages in Wolof and French finally read naturally. Our community teams trust the translations.",
  },
  {
    name: "Kwesi Mensah",
    title: "Head of AI",
    company: "Regional Bank",
    quote:
      "Mobile money fraud looks nothing like card fraud. ADARA catches USSD scam patterns our old tools never flagged.",
  },
];

const testimonials2 = [
  {
    name: "Sarah Chen",
    title: "Localization Lead",
    company: "Global Platform",
    quote:
      "Light UI translation wasn't enough. We needed cultural depth for West Africa — ADARA gave us that in weeks, not months.",
  },
  {
    name: "Ibrahim Yusuf",
    title: "Researcher",
    company: "African NLP Lab",
    quote:
      "Rare to see African NLP done with community attribution built in. The corpus work is serious and the API is clean.",
  },
  {
    name: "Naledi Botha",
    title: "Policy Advisor",
    company: "Digital Ministry",
    quote:
      "Local languages in public services shouldn't be an afterthought. ADARA made it practical for our digital ID rollout.",
  },
  {
    name: "Chidi Adebayo",
    title: "Founder",
    company: "EdTech Nigeria",
    quote:
      "Students learn better when tutors bridge Yoruba and English. ADARA closed that gap for us faster than we expected.",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials1)[0];
}) {
  return (
    <article className="flex w-[min(100%,320px)] shrink-0 flex-col rounded-2xl border border-border bg-card p-5 sm:w-[380px] sm:p-6">
      <p className="flex-1 text-sm leading-relaxed text-foreground sm:text-base md:text-lg">
        {testimonial.quote}
      </p>
      <div className="mt-6 flex items-center justify-between pt-1">
        <div>
          <p className="text-base font-medium text-foreground">{testimonial.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {testimonial.title} · {testimonial.company}
          </p>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
      </div>
    </article>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.03em] text-foreground">
              What teams
              <br />
              <span className="text-gray-out">are building</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
            Developers, researchers, and public teams using ADARA to ship AI that works locally.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" />

          <div className="py-3">
            <Marquee direction="ltr" duration={55}>
              {testimonials1.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </Marquee>
          </div>

          <div className="py-3">
            <Marquee direction="rtl" duration={50}>
              {testimonials2.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
