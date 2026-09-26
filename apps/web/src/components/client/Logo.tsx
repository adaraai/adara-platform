import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO_MARK = "/assets/adara-mark.png";

type LogoProps = {
  className?: string;
  /** White wordmark for dark backgrounds (e.g. dark footer) */
  onDark?: boolean;
  /** Black wordmark for light backgrounds (e.g. white header) */
  forceLight?: boolean;
  size?: "sm" | "md";
};

export function Logo({ className, onDark = false, forceLight = false, size = "md" }: LogoProps) {
  // Keep mark + wordmark on one optical middle line for header alignment
  const markHeight = size === "sm" ? "h-5" : "h-7";
  const textSize = size === "sm" ? "text-[1.05rem]" : "text-[1.375rem]";

  const wordmarkClass = forceLight
    ? "text-neutral-900"
    : onDark
      ? "text-white"
      : "text-neutral-900 dark:text-white";

  return (
    <Link
      to="/"
      aria-label="adara home"
      className={cn("inline-flex h-9 shrink-0 items-center gap-1.5 touch-manipulation", className)}
    >
      <img
        src={LOGO_MARK}
        alt=""
        width={40}
        height={32}
        className={cn("block w-auto shrink-0", markHeight)}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        aria-hidden
      />
      <span
        className={cn(
          "font-bold leading-none tracking-[-0.03em]",
          textSize,
          wordmarkClass,
        )}
      >
        adara
      </span>
    </Link>
  );
}
