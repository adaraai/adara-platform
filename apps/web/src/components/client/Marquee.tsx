import { cn } from "@/lib/utils";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { useOffscreenPause } from "@/hooks/use-offscreen-pause";

type MarqueeProps = {
  children: ReactNode;
  direction?: "ltr" | "rtl";
  duration?: number;
  className?: string;
  gapClassName?: string;
};

export function Marquee({
  children,
  direction = "ltr",
  duration = 45,
  className,
  gapClassName = "gap-4 sm:gap-5",
}: MarqueeProps) {
  const pauseRef = useOffscreenPause<HTMLDivElement>();
  const items = Children.toArray(children);

  const renderTrack = (copy: "a" | "b") => (
    <div
      className={cn("flex shrink-0", gapClassName, "pe-4 sm:pe-5")}
      aria-hidden={copy === "b" ? true : undefined}
    >
      {items.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            key: `${copy}-${String(child.key ?? index)}`,
          });
        }
        return child;
      })}
    </div>
  );

  return (
    <div ref={pauseRef} className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max",
          direction === "ltr" ? "animate-marquee-ltr" : "animate-marquee-rtl"
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {renderTrack("a")}
        {renderTrack("b")}
      </div>
    </div>
  );
}
