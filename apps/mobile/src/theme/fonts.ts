import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Font face map for expo-font — same Sora + Nunito set as the Aya app,
 * plus Ionicons so vector icons do not render as blank/tofu glyphs.
 */
export const fontMap = {
  "Sora-Regular": require("../../assets/fonts/Sora-Regular.ttf"),
  "Sora-Medium": require("../../assets/fonts/Sora-Medium.ttf"),
  "Sora-SemiBold": require("../../assets/fonts/Sora-SemiBold.ttf"),
  "Sora-Bold": require("../../assets/fonts/Sora-Bold.ttf"),
  "Sora-ExtraBold": require("../../assets/fonts/Sora-ExtraBold.ttf"),
  "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  "Nunito-Medium": require("../../assets/fonts/Nunito-Medium.ttf"),
  "Nunito-SemiBold": require("../../assets/fonts/Nunito-SemiBold.ttf"),
  "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
  "Nunito-ExtraBold": require("../../assets/fonts/Nunito-ExtraBold.ttf"),
  // Tailwind / NativeWind aliases used across existing classNames
  Outfit_500Medium: require("../../assets/fonts/Sora-Medium.ttf"),
  Outfit_600SemiBold: require("../../assets/fonts/Sora-SemiBold.ttf"),
  Outfit_700Bold: require("../../assets/fonts/Sora-Bold.ttf"),
  Inter_400Regular: require("../../assets/fonts/Nunito-Regular.ttf"),
  Inter_500Medium: require("../../assets/fonts/Nunito-Medium.ttf"),
  Inter_600SemiBold: require("../../assets/fonts/Nunito-SemiBold.ttf"),
  Inter_700Bold: require("../../assets/fonts/Nunito-Bold.ttf"),
  ...Ionicons.font,
} as const;

export const fonts = {
  display: {
    regular: "Sora-Regular",
    medium: "Sora-Medium",
    semiBold: "Sora-SemiBold",
    bold: "Sora-Bold",
    extraBold: "Sora-ExtraBold",
  },
  body: {
    regular: "Nunito-Regular",
    medium: "Nunito-Medium",
    semiBold: "Nunito-SemiBold",
    bold: "Nunito-Bold",
    extraBold: "Nunito-ExtraBold",
  },
} as const;
