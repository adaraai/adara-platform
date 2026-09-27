import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { Appearance, useColorScheme as useRNColorScheme } from "react-native";

/** Resolved light/dark — always follows the device setting. */
export function useResolvedColorScheme(): "light" | "dark" {
  const { colorScheme: nwScheme } = useNativeWindColorScheme();
  const rnScheme = useRNColorScheme();

  const resolved = nwScheme ?? rnScheme ?? Appearance.getColorScheme() ?? "light";
  return resolved === "dark" ? "dark" : "light";
}
