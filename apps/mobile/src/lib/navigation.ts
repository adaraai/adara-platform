import type { useRouter } from "expo-router";

type AppRouter = ReturnType<typeof useRouter>;

/** Prefer history back; otherwise land on the Talk home screen. */
export function goBackOrHome(router: AppRouter) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}
