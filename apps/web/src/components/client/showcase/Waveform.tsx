import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const heights = Array.from({ length: 64 }, (_, i) =>
  Math.round((0.24 + 0.76 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.55))) * 100)
);

type WaveformProps = {
  count?: number;
  className?: string;
  barStyle?: CSSProperties;
};

export function Waveform({ count = 52, className, barStyle }: WaveformProps) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-between gap-px">
      {heights.slice(0, count).map((height, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-full", className)}
          style={{ height: `${height}%`, ...barStyle }}
        />
      ))}
    </div>
  );
}
