import { useResolvedColorScheme } from "./appearance";
import { ramp } from "./palette";

/**
 * JS-side mirror of the CSS variables in `global.css`.
 *
 * Tailwind classes cover layout and flat color. This exists only for the
 * things a className cannot reach: gradient stops, SVG fills, blur tints and
 * native shadow objects. Keep it in sync with `global.css` — that file is
 * still the source of truth for anything styleable with a class.
 */
export type AuroraBlob = {
  id: string;
  cx: string;
  cy: string;
  r: string;
  inner: string;
  outer: string;
  innerOpacity: number;
};

export type Tokens = {
  scheme: "light" | "dark";
  /** Neutral canvas under the mesh blooms. */
  auroraBase: string;
  /** Diffused radial colour spots. */
  auroraBlobs: AuroraBlob[];
  /** Vertical wash layered on top of the mesh. */
  auroraWash: [string, string, string, string];
  /** @deprecated — kept for any legacy linear use */
  aurora: [string, string, string, string];
  primaryGradient: [string, string];
  orbGradient: [string, string, string, string];
  tabBarFade: [string, string];
  primary: string;
  onPrimary: string;
  accent: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  /** BlurView tint; RN needs the literal, not a class. */
  blurTint: "light" | "dark";
  blurIntensity: number;
  shadowColor: string;
};

const light: Omit<Tokens, "scheme"> = {
  auroraBase: "#FFFFFF",
  auroraBlobs: [
    {
      id: "violet-tr",
      cx: "92%",
      cy: "-2%",
      r: "58%",
      inner: "#DDD6FE",
      outer: "#C4B5FD",
      innerOpacity: 0.72,
    },
    {
      id: "rose-mid",
      cx: "18%",
      cy: "38%",
      r: "52%",
      inner: "#FBCFE8",
      outer: "#F9A8D4",
      innerOpacity: 0.55,
    },
    {
      id: "sky-bl",
      cx: "-8%",
      cy: "88%",
      r: "55%",
      inner: "#BFDBFE",
      outer: "#93C5FD",
      innerOpacity: 0.62,
    },
    {
      id: "lavender-br",
      cx: "95%",
      cy: "72%",
      r: "48%",
      inner: "#E9D5FF",
      outer: "#D8B4FE",
      innerOpacity: 0.45,
    },
    {
      id: "peach-center",
      cx: "55%",
      cy: "22%",
      r: "40%",
      inner: "#FECDD3",
      outer: "#FDA4AF",
      innerOpacity: 0.28,
    },
  ],
  auroraWash: [
    "rgba(255,255,255,0.72)",
    "rgba(250,250,252,0.35)",
    "rgba(250,250,252,0.08)",
    "rgba(255,255,255,0.42)",
  ],
  aurora: ["#FAFAFC", "#EDE9FE", "#FCE7F3", "#DBEAFE"],
  primaryGradient: ["#000000", "#000000"],
  orbGradient: ["#C9B6FF", "#9FD8F0", "#F3C9DE", "#A594F9"],
  tabBarFade: ["rgba(255,255,255,0)", "rgba(255,255,255,0.96)"],
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
  auroraBase: "#000000",
  auroraBlobs: [
    {
      id: "violet-tr",
      cx: "90%",
      cy: "0%",
      r: "55%",
      inner: "#4C1D95",
      outer: "#5B21B6",
      innerOpacity: 0.55,
    },
    {
      id: "rose-mid",
      cx: "15%",
      cy: "40%",
      r: "50%",
      inner: "#831843",
      outer: "#9D174D",
      innerOpacity: 0.35,
    },
    {
      id: "sky-bl",
      cx: "-5%",
      cy: "85%",
      r: "52%",
      inner: "#1E3A5F",
      outer: "#1E40AF",
      innerOpacity: 0.4,
    },
    {
      id: "lavender-br",
      cx: "92%",
      cy: "75%",
      r: "45%",
      inner: "#3B0764",
      outer: "#581C87",
      innerOpacity: 0.3,
    },
    {
      id: "peach-center",
      cx: "50%",
      cy: "25%",
      r: "38%",
      inner: "#4A044E",
      outer: "#701A75",
      innerOpacity: 0.22,
    },
  ],
  auroraWash: [
    "rgba(14,11,26,0.55)",
    "rgba(14,11,26,0.15)",
    "rgba(14,11,26,0.05)",
    "rgba(14,11,26,0.35)",
  ],
  aurora: [ramp.slate[950], "#1A1330", "#231A3D", "#140F26"],
  primaryGradient: ["#FFFFFF", "#FFFFFF"],
  orbGradient: ["#7C5CF6", "#3FB6C4", "#F4577B", "#5A3FD6"],
  tabBarFade: ["rgba(0,0,0,0)", "rgba(0,0,0,0.96)"],
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
