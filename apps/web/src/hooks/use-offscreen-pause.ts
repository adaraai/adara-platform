import { useEffect, useRef } from "react";

export function useOffscreenPause<T extends HTMLElement>(rootMargin = "120px") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        node.classList.toggle("is-offscreen", !entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
