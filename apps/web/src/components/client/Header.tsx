import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/client/Logo";
import { MintButton } from "@/components/client/MintButton";
import { navigationItems } from "@/components/client/nav";
import { WaitlistModal } from "@/components/client/WaitlistModal";
import { useScrollLock } from "@/lib/scrollLock";

type HeaderProps = {
  variant?: "default" | "home";
};

export function Header({ variant: _variant = "default" }: HeaderProps) {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const closeWaitlist = useCallback(() => setIsWaitlistOpen(false), []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      const next = window.scrollY > 12;
      setScrolled((prev) => (prev === next ? prev : next));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useScrollLock(isMenuOpen);

  // Same height as Contact button (h-9) so every header control shares one center line
  const navLink =
    "inline-flex h-9 items-center text-[14px] font-bold leading-none text-neutral-900 transition-colors duration-150 hover:text-primary";

  const mobileNavLink =
    "flex h-12 w-full items-center text-[15px] font-semibold leading-none text-neutral-900 transition-colors hover:text-primary";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b bg-white transition-all duration-200 safe-area-top",
        scrolled ? "border-border/60" : "border-border/40",
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <div className="flex min-w-0 items-center gap-8">
            <Logo forceLight />

            <nav className="hidden items-center gap-6 lg:flex">
              {navigationItems.map((item) => (
                <Link key={item.label} to={item.href} className={navLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => setIsWaitlistOpen(true)} className={navLink}>
              Join waitlist
            </button>
            <MintButton href="/#contact" size="sm" className="leading-none">
              Contact us
            </MintButton>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-900 transition touch-manipulation hover:bg-neutral-100 lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-neutral-900" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5 text-neutral-900" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden",
          isMenuOpen
            ? "h-[calc(100dvh-4rem-env(safe-area-inset-top))] overflow-y-auto border-t border-neutral-200 bg-white sm:h-[calc(100dvh-4.25rem-env(safe-area-inset-top))]"
            : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 safe-area-bottom sm:px-6">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6">
            <MintButton
              href="/#contact"
              size="lg"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact us
            </MintButton>
            <MintButton
              size="lg"
              className="w-full bg-white text-neutral-900 ring-1 ring-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
              onClick={() => {
                setIsMenuOpen(false);
                setIsWaitlistOpen(true);
              }}
            >
              Join waitlist
            </MintButton>
          </div>
        </nav>
      </div>

      <WaitlistModal open={isWaitlistOpen} onClose={closeWaitlist} source="header" />
    </header>
  );
}
