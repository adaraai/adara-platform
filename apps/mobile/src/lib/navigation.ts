import type { useRouter } from "expo-router";

type AppRouter = ReturnType<typeof useRouter>;

/** Navigate back when possible; otherwise return to the home tab stack. */
export function goBackOrHome(router: AppRouter) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/(tabs)");
  }
}
