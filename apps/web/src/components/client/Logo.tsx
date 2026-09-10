import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO_LIGHT = "/assets/adara-logo-light.png";
const LOGO_DARK = "/assets/adara-logo-dark.png";

type LogoProps = {
  className?: string;
  onDark?: boolean;
  size?: "sm" | "md";
};

export function Logo({ className, onDark = false, size = "md" }: LogoProps) {
  const height = size === "sm" ? "h-[1.25rem] sm:h-6" : "h-7 sm:h-8";

  return (
    <Link
      to="/"
      aria-label="ADARA home"
      className={cn("inline-flex shrink-0 items-center touch-manipulation", className)}
    >
      <img
        src={onDark ? LOGO_DARK : LOGO_LIGHT}
        alt="ADARA"
        width={onDark ? 120 : 118}
        height={32}
        className={cn("w-auto dark:hidden", height)}
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
      <img
        src={LOGO_DARK}
        alt="ADARA"
        width={120}
        height={32}
        className={cn("hidden w-auto dark:block", height)}
        decoding="async"
        draggable={false}
      />
    </Link>
  );
}
