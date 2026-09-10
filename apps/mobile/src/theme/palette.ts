/**
 * ADARA raw color ramps.
 *
 * These are the only literal hex values in the app. Everything else consumes
 * semantic tokens from `colors.ts`, so a rebrand touches this file alone.
 *
 * Violet is the product signature. Sand is the African-warmth counterweight
 * used for secondary accents so the UI never reads as purely synthetic.
 */

export const ramp = {
  violet: {
    50: "#F8F6FC",
    100: "#EDE8FF",
    200: "#DDD4FF",
    300: "#C4B6FF",
    400: "#B0A0FA",
    500: "#A594F9",
    600: "#9580F0",
    700: "#7A66D6",
    800: "#5E4FA8",
    900: "#433875",
  },
  sand: {
    50: "#FDF6EF",
    100: "#FAE9D7",
    200: "#F3D2AE",
    300: "#E9B67F",
    400: "#DD9550",
    500: "#C97A33",
    600: "#A65F26",
    700: "#7E471C",
  },
  aqua: {
    100: "#DAF3F5",
    300: "#8ED9E0",
    500: "#3FB6C4",
    700: "#1F7F8C",
  },
  rose: {
    100: "#FFE1E8",
    300: "#FFA6BA",
    500: "#F4577B",
    700: "#C22B4E",
  },
  lime: {
    100: "#E3F7DF",
    300: "#A7E39A",
    500: "#5CBF4A",
    700: "#357A2B",
  },
  /** Cool neutrals carrying a trace of violet so greys sit inside the brand. */
  slate: {
    0: "#FFFFFF",
    25: "#FBFAFE",
    50: "#F5F3FB",
    100: "#EDEAF5",
    200: "#DFDBEC",
    300: "#C4BEDA",
    400: "#9791B0",
    500: "#6F6987",
    600: "#4E4963",
    700: "#373248",
    800: "#241F33",
    900: "#171326",
    950: "#0E0B1A",
  },
} as const;

/** Fixed alpha values used for glass, scrims and hairlines. */
export const alpha = {
  white04: "rgba(255,255,255,0.04)",
  white08: "rgba(255,255,255,0.08)",
  white12: "rgba(255,255,255,0.12)",
  white24: "rgba(255,255,255,0.24)",
  white40: "rgba(255,255,255,0.40)",
  white56: "rgba(255,255,255,0.56)",
  white72: "rgba(255,255,255,0.72)",
  white88: "rgba(255,255,255,0.88)",
  ink06: "rgba(23,19,38,0.06)",
  ink10: "rgba(23,19,38,0.10)",
  ink16: "rgba(23,19,38,0.16)",
  ink32: "rgba(23,19,38,0.32)",
  ink56: "rgba(23,19,38,0.56)",
  violet16: "rgba(110,86,248,0.16)",
  violet24: "rgba(110,86,248,0.24)",
  violet40: "rgba(110,86,248,0.40)",
} as const;
