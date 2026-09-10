import { Platform } from "react-native";

/** Shared flex/height styles so the RN-web tree fills the viewport on first paint. */
export const webRootStyle =
  Platform.OS === "web"
    ? ({ flex: 1, height: "100%", minHeight: 0, width: "100%" } as const)
    : ({ flex: 1 } as const);

/** `useWindowDimensions` can report 0 on the first web paint — read the DOM instead. */
export function getWebViewportWidth(fallback = 0): number {
  if (typeof window === "undefined") return fallback;
  return window.innerWidth || fallback;
}
