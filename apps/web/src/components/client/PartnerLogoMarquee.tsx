import { Marquee } from "@/components/client/Marquee";
import { cn } from "@/lib/utils";

const PARTNER_LOGOS = [
  { src: "/assets/partners/safaricom.svg", alt: "Safaricom" },
  { src: "/assets/partners/flutterwave.svg", alt: "Flutterwave" },
  { src: "/assets/partners/chipper.svg", alt: "Chipper" },
  { src: "/assets/partners/jumia.svg", alt: "Jumia" },
  { src: "/assets/partners/andela.svg", alt: "Andela" },
  { src: "/assets/partners/paystack.svg", alt: "Paystack" },
] as const;

function PartnerLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-8 w-[7.5rem] shrink-0 items-center justify-center bg-transparent sm:h-10 sm:w-[9.5rem]">
      <img
        src={src}
        alt={alt}
        className="max-h-full w-auto max-w-full bg-transparent object-contain opacity-55 brightness-0 invert"
        draggable={false}
        loading="eager"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}

type PartnerLogoMarqueeProps = {
  className?: string;
};

/** Infinite logo strip — transparent, no card backgrounds. */
export function PartnerLogoMarquee({ className }: PartnerLogoMarqueeProps) {
  return (
    <section
      className={cn("relative z-10 bg-transparent py-8 sm:py-9", className)}
      aria-label="Partner logos"
    >
      <Marquee duration={55} gapClassName="gap-10 sm:gap-16 md:gap-20" className="bg-transparent">
        {PARTNER_LOGOS.map((logo) => (
          <PartnerLogo key={logo.src} {...logo} />
        ))}
      </Marquee>
    </section>
  );
}
