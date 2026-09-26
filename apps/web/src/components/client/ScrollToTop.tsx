import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  // Offset for fixed header
  const headerOffset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, left: 0, behavior });
}

/** Scroll to top on pathname change, or to #hash targets when present. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick so the destination page can mount
      const t = window.setTimeout(() => scrollToHash(hash, "smooth"), 40);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
