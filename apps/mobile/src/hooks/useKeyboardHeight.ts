import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

function getWebKeyboardHeight(): number {
  if (typeof window === "undefined") return 0;

  const viewport = window.visualViewport;
  if (!viewport) return 0;

  return Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
}

/** Tracks visible keyboard height in pixels. */
export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === "web") {
      const viewport = window.visualViewport;
      if (!viewport) return;

      const update = () => setHeight(getWebKeyboardHeight());

      update();
      viewport.addEventListener("resize", update);
      viewport.addEventListener("scroll", update);
      window.addEventListener("focusin", update);
      window.addEventListener("focusout", update);

      return () => {
        viewport.removeEventListener("resize", update);
        viewport.removeEventListener("scroll", update);
        window.removeEventListener("focusin", update);
        window.removeEventListener("focusout", update);
      };
    }

    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      setHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
