import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LazyVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** When true, start loading immediately (hero). */
  eager?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
};

/**
 * Muted looping background video that only loads when near the viewport.
 * Uses poster until the source is attached, then plays when ready.
 */
export function LazyVideo({
  src,
  poster,
  className,
  eager = false,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const play = () => {
      void el.play().catch(() => {});
    };
    if (el.readyState >= 2) play();
    else el.addEventListener("loadeddata", play, { once: true });
    return () => el.removeEventListener("loadeddata", play);
  }, [active, src]);

  return (
    <video
      ref={ref}
      id={id}
      className={cn(className)}
      autoPlay={active}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      poster={poster}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {active ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
