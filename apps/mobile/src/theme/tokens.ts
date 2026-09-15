import { useResolvedColorScheme } from "./appearance";
import { ramp } from "./palette";

/**
 * JS-side tokens for values className cannot reach (SVG fills, blur, shadows).
 * Flat colors still live in `global.css` for Tailwind.
 */
export type Tokens = {
  scheme: "light" | "dark";
  primary: string;
  onPrimary: string;
  accent: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  blurTint: "light" | "dark";
  blurIntensity: number;
  shadowColor: string;
};

const light: Omit<Tokens, "scheme"> = {
  primary: ramp.slate[900],
  onPrimary: ramp.slate[0],
  accent: ramp.sand[400],
  text: ramp.slate[900],
  textSecondary: ramp.slate[500],
  textTertiary: ramp.slate[400],
  blurTint: "light",
  blurIntensity: 40,
  shadowColor: ramp.slate[900],
};

const dark: Omit<Tokens, "scheme"> = {
  primary: "#FFFFFF",
  onPrimary: ramp.slate[950],
  accent: ramp.sand[300],
  text: "#ECECEC",
  textSecondary: ramp.slate[300],
  textTertiary: ramp.slate[400],
  blurTint: "dark",
  blurIntensity: 48,
  shadowColor: "#000000",
};

export function useTokens(): Tokens {
  const scheme = useResolvedColorScheme();
  return { scheme, ...(scheme === "dark" ? dark : light) };
}
