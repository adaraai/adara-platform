import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ContextApiAnim, CorpusAnim, ModelsAnim } from "@/components/client/FeatureCardAnims";
import { LazyVideo } from "@/components/client/LazyVideo";

type AnimKind = "corpus" | "models" | "context";

type GridCard = {
  label: string;
  href: string;
  image?: string;
  imageAlt?: string;
  video?: string;
  poster?: string;
  anim?: AnimKind;
  span: 2 | 3;
};

const cards: GridCard[] = [
  {
    label: "Corpus",
    href: "/#features",
    anim: "corpus",
    span: 2,
  },
  {
    label: "Models",
    href: "/#features",
    anim: "models",
    span: 2,
  },
  {
    label: "Context API",
    href: "/#contact",
    anim: "context",
    span: 2,
  },
  {
    label: "Speech",
    href: "/#features",
    image: "/assets/speech-banner.webp",
    imageAlt: "Person speaking into a phone with voice recognition waves",
    video: "/assets/video/speech-card.min.mp4",
    poster: "/assets/video/speech-card-poster.webp",
    span: 3,
  },
  {
    label: "Products",
    href: "/#features",
    image: "/assets/news-corpus-annotation.svg",
    imageAlt: "Product suite",
    video: "/assets/video/products-card.min.mp4",
    poster: "/assets/video/products-card-poster.webp",
    span: 3,
  },
];

function AnimPanel({ kind }: { kind: AnimKind }) {
  if (kind === "corpus") return <ModelsAnim />;
  if (kind === "models") return <ContextApiAnim />;
  return <CorpusAnim />;
}

function ProductCard({ label, href, image, imageAlt, video, poster, anim, span }: GridCard) {
  const spanClass = span === 3 ? "col-span-6 md:col-span-3" : "col-span-6 md:col-span-2";

  return (
    <Link
      to={href}
      className={cn(
        "group relative flex h-[240px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] sm:h-[280px]",
        spanClass,
      )}
    >
      {anim ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(235,80,31,0.12),transparent_55%)]">
          <AnimPanel kind={anim} />
        </div>
      ) : null}

      {video ? (
        <LazyVideo
          src={video}
          poster={poster ?? image}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:hidden"
          aria-label={imageAlt}
        />
      ) : null}

      {image && !anim ? (
        <img
          src={image}
          alt={imageAlt ?? ""}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            video && "hidden motion-reduce:block",
          )}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0",
          anim
            ? "bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"
            : "bg-gradient-to-t from-black/75 via-black/15 to-transparent",
        )}
      />
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
        <span className="text-[15px] font-bold text-white">{label}</span>
        <span className="shrink-0 text-[13px] font-medium text-white/70 transition-colors group-hover:text-white sm:text-[14px]">
          Explore →
        </span>
      </div>
    </Link>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="bg-black py-14 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-[clamp(1.65rem,5.5vw,2.75rem)] font-bold leading-[1.2] tracking-[-0.02em]">
            One platform. Every modality.
          </h2>
          <p className="mt-4 text-base font-light leading-[1.4] text-white/55 sm:text-lg">
            Corpus, models, speech, and APIs in one stack.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-6 gap-3 sm:mt-12">
          {cards.map((card) => (
            <ProductCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
