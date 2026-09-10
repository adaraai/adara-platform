import {
  CountryFlag,
  FLAG_REGIONS,
} from "@/components/client/CountryFlag";
import { useOffscreenPause } from "@/hooks/use-offscreen-pause";

export function FlagMarquee() {
  const pauseRef = useOffscreenPause<HTMLDivElement>("40px");
  const flags = [...FLAG_REGIONS, ...FLAG_REGIONS];

  const renderTrack = (copy: string) =>
    flags.map(({ code, name }, index) => (
      <span
        key={`${code}-${copy}-${index}`}
        title={name}
        className="country-flag-slot inline-flex h-9 w-[3.25rem] shrink-0 overflow-hidden rounded-md border border-border sm:h-10 sm:w-14"
      >
        <CountryFlag code={code} name={name} />
      </span>
    ));

  return (
    <div ref={pauseRef} className="flag-marquee-mask relative w-full overflow-hidden">
      <div className="flex w-max flex-nowrap animate-marquee-flags">
        <div className="flex shrink-0 items-center gap-3 pr-3">{renderTrack("a")}</div>
        <div className="flex shrink-0 items-center gap-3 pr-3" aria-hidden>
          {renderTrack("b")}
        </div>
      </div>
    </div>
  );
}
