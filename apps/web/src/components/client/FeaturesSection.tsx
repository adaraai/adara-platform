import { BentoCard } from "@/components/client/BentoCard";
import { BentoPromptCarousel } from "@/components/client/showcase/BentoPromptCarousel";
import { BentoCodeDemo } from "@/components/client/showcase/BentoCodeDemo";
import { ModelsPreview } from "@/components/client/showcase/ModelsPreview";
import { ProductsVisual } from "@/components/client/showcase/ProductsVisual";
import { SecurityVisual } from "@/components/client/showcase/SecurityVisual";

export function FeaturesSection() {
  return (
    <section id="features" className="section-auto py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.035em] text-foreground">
            One platform.
            <span className="text-gray-out"> Every modality.</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-[13.5rem_16.5rem]">
          <BentoCard
            label="Corpus"
            href="/products"
            cta="Explore"
            compact
            className="min-h-[13.5rem] md:col-span-2 md:h-full"
          >
            <BentoPromptCarousel compact />
          </BentoCard>

          <BentoCard
            label="Models"
            href="/products"
            cta="Explore"
            compact
            className="min-h-[13.5rem] md:col-span-2 md:h-full"
          >
            <ModelsPreview />
          </BentoCard>

          <BentoCard
            label="Context API"
            href="/documentation"
            cta="Explore"
            compact
            className="min-h-[13.5rem] md:col-span-2 md:h-full"
          >
            <BentoCodeDemo compact />
          </BentoCard>

          <BentoCard
            label="Products"
            href="/products"
            cta="Explore"
            layout="visual"
            className="min-h-[16.5rem] md:col-span-3 md:h-full"
          >
            <ProductsVisual />
          </BentoCard>

          <BentoCard
            label="Security"
            href="/products"
            cta="Explore"
            layout="visual"
            surface="auto"
            className="min-h-[16.5rem] md:col-span-3 md:h-full"
          >
            <SecurityVisual />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
