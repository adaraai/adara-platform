import { useEffect } from "react";

// `html` uses overflow-x: clip, so overflow set on `body` never reaches the viewport;
// the lock has to live on `html`. Ref-counted so overlapping overlays don't unlock early.
let lockCount = 0;

function lock() {
  lockCount += 1;
  if (lockCount > 1) return;
  const html = document.documentElement;
  const scrollbarWidth = window.innerWidth - html.clientWidth;
  html.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
  if (scrollbarWidth > 0) html.style.paddingRight = `${scrollbarWidth}px`;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  const html = document.documentElement;
  html.style.overflow = "";
  html.style.overscrollBehavior = "";
  html.style.paddingRight = "";
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
