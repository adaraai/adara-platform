import { Platform, type TextStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * ChatGPT product typography uses the platform UI stack (SF Pro on iOS,
 * Roboto on Android, Segoe / system-ui on web). Only Ionicons need expo-font.
 */
export const fontMap = {
  ...Ionicons.font,
} as const;

/** CSS stack matching ChatGPT’s web fallbacks (Söhne → system-ui). */
export const chatGptFontStack =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const systemFontFamily = Platform.select<string | undefined>({
  ios: undefined,
  android: "sans-serif",
  web: undefined,
  default: undefined,
});

/** Spread onto Text / TextInput / Animated.Text for ChatGPT system type. */
export const textFontStyle: TextStyle =
  Platform.OS === "web"
    ? { fontFamily: chatGptFontStack }
    : systemFontFamily
    ? { fontFamily: systemFontFamily }
    : {};
