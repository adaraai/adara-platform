import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/client/Logo";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { resolvedTheme } = useTheme();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const next = window.scrollY > 12;
      setScrolled((prev) => (prev === next ? prev : next));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navigationItems = [
    { label: "Products", href: "/products" },
    { label: "API", href: "/api" },
    { label: "Docs", href: "/docs/introduction" },
    { label: "Docs", href: "/documentation" },
    { label: "About", href: "/about" },
  ];

  const moreDropdownItems = [
    { label: "News", href: "/news" },
    { label: "Customers", href: "/customers" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Government", href: "/government" },
    { label: "Support", href: "/support" },
    { label: "Learn", href: "/learn" },
  ];

  const navLink = cn(
    "text-[15px] font-normal transition-colors duration-150",
    scrolled
      ? "text-muted-foreground hover:text-foreground"
      : "text-muted-foreground hover:text-foreground dark:text-white/80 dark:hover:text-white"
  );

  const mobileNavLink =
    "block rounded-lg px-3 py-3 text-base text-muted-foreground transition hover:bg-accent hover:text-foreground";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b bg-background transition-colors duration-200 safe-area-top",
        scrolled ? "border-border/60" : "border-border/50"
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[4.25rem]">
          <div className="flex min-w-0 items-center gap-8">
            <Logo onDark={resolvedTheme === "dark"} className="relative z-10" />

            <nav className="hidden items-center gap-7 lg:flex">
              {navigationItems.map((item) => (
                <Link key={item.label} to={item.href} className={navLink}>
                  {item.label}
                </Link>
              ))}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={cn("flex items-center gap-1", navLink)}
                >
                  Resources
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 opacity-70 transition-transform duration-200",
                      isMoreDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isMoreDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-3 w-48 rounded-xl border border-border bg-card py-1.5 shadow-xl shadow-black/30">
                    {moreDropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="mx-1 flex items-center rounded-lg px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        onClick={() => setIsMoreDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/login"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full border px-5 text-[15px] font-medium transition-colors duration-150",
                scrolled
                  ? "border-border text-foreground hover:bg-accent"
                  : "border-border text-foreground hover:bg-accent dark:border-white/25 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/5"
              )}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-colors duration-150 hover:bg-foreground/90"
            >
              Try ADARA
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition touch-manipulation lg:hidden",
              scrolled ? "text-foreground hover:bg-accent" : "text-foreground hover:bg-accent dark:text-white dark:hover:bg-white/10"
            )}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-card transition-all duration-300 lg:hidden",
          isMenuOpen
            ? "max-h-[calc(100dvh-4rem)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 safe-area-bottom sm:px-6">
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
          <div className="mt-2 border-t border-border pt-2">
            <p className="px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Resources
            </p>
            {moreDropdownItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border px-4 text-base font-medium text-foreground transition hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-4 text-base font-medium text-background transition hover:bg-foreground/90"
              onClick={() => setIsMenuOpen(false)}
            >
              Try ADARA
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
