import { useEffect, useRef } from "react";

const AFRICA_MAP =
  "M58 76 L46 58 62 42 92 32 128 28 158 34 176 46 184 64 188 80 204 88 228 98 246 116 250 138 236 152 216 158 206 172 200 194 208 216 200 240 186 262 172 282 156 298 138 308 120 306 110 292 106 270 96 254 76 244 58 230 48 210 44 188 38 172 22 160 10 144 14 122 10 104 22 90 40 84 50 92 58 76 Z";
const MADAGASCAR_MAP =
  "M228 224 L242 234 246 258 238 280 224 284 216 264 220 240 Z";

const AFRICA_ICON =
  "M96 10c14-3 32 4 38 18 16-3 32 10 34 26 16 6 26 26 22 44 16 12 20 36 8 52 6 22-8 42-26 50-6 20-24 32-42 26-10 14-28 12-34-2-18 8-36-6-34-24-22-8-32-32-22-50-16-14-14-42 4-52-8-18 6-38 24-40C76 28 86 16 96 10Z";
const MADAGASCAR_ICON =
  "M168 156c8 4 10 18 4 28-8 8-16 0-14-12 2-10 6-16 10-16Z";

function StippleMap({
  patternId,
  className,
  variant = "icon",
}: {
  patternId: string;
  className: string;
  variant?: "icon" | "map";
}) {
  const isMap = variant === "map";
  const africa = isMap ? AFRICA_MAP : AFRICA_ICON;
  const madagascar = isMap ? MADAGASCAR_MAP : MADAGASCAR_ICON;
  const viewBox = isMap ? "0 0 260 330" : "0 0 200 250";
  const stipple = isMap ? 5.2 : 6.5;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="hidden"
    >
      <defs>
        <pattern id={patternId} width={stipple} height={stipple} patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r={isMap ? 0.75 : 0.85} className="hero-tech-stipple" />
        </pattern>
      </defs>
      <path fill={`url(#${patternId})`} d={africa} />
      <path fill={`url(#${patternId})`} d={madagascar} />
      <path className="hero-tech-current" d={africa} />
      <path className="hero-tech-spark" d={africa} />
      <path className="hero-tech-current hero-tech-current-slow" d={madagascar} />
    </svg>
  );
}

export function HeroTechPattern() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        node.classList.toggle("hero-tech-paused", !entry.isIntersecting);
      },
      { rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="hero-tech-pattern pointer-events-none absolute inset-0 overflow-clip"
    >
      <div className="hero-tech-glow hero-tech-glow-tr" />
      <StippleMap patternId="hero-stipple-tr" className="hero-tech-map hero-tech-map-tr" variant="map" />
      <div className="hero-tech-glow hero-tech-glow-tc" />
      <StippleMap patternId="hero-stipple-tc" className="hero-tech-map hero-tech-map-tc" />
      <div className="hero-tech-glow hero-tech-glow-bl" />
      <StippleMap patternId="hero-stipple-bl" className="hero-tech-map hero-tech-map-bl" />
    </div>
  );
}
