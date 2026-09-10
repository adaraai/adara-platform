import type { Router } from "expo-router";

/** Navigate back when possible; otherwise return to the home tab stack. */
export function goBackOrHome(router: Router) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/(tabs)");
  }
}
