import { BentoCard } from "@/components/client/BentoCard";
import { BentoTranscribeDemo } from "@/components/client/showcase/BentoTranscribeDemo";
import { BentoPromptCarousel } from "@/components/client/showcase/BentoPromptCarousel";
import { BentoCodeDemo } from "@/components/client/showcase/BentoCodeDemo";
import { BentoAgentDemo } from "@/components/client/showcase/BentoAgentDemo";

export function SolutionSection() {
  return (
    <section id="solutions" className="section-auto bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(2.25rem,4.8vw,3.75rem)] font-normal leading-[1.06] tracking-[-0.035em] text-foreground">
            See ADARA
            <span className="text-gray-out"> in action.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 md:h-[540px] md:grid-cols-3 md:grid-rows-2">
          <BentoCard
            label="Transcribe"
            href="/products"
            cta="Try Transcribe"
            className="h-full md:col-start-1 md:row-start-1 md:row-span-2"
          >
            <BentoTranscribeDemo />
          </BentoCard>

          <BentoCard
            label="Corpus"
            href="/products"
            cta="Browse"
            className="h-full md:col-start-2 md:row-start-1"
          >
            <BentoPromptCarousel />
          </BentoCard>

          <BentoCard
            label="API"
            href="/documentation"
            cta="View docs"
            className="h-full md:col-start-2 md:row-start-2"
          >
            <BentoCodeDemo />
          </BentoCard>

          <BentoCard
            label="Build"
            href="/products"
            cta="Get started"
            className="h-full md:col-start-3 md:row-start-1 md:row-span-2"
          >
            <BentoAgentDemo />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
