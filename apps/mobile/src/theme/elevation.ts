import { Platform, type ViewStyle } from "react-native";

/**
 * Native shadows. RN cannot express these as Tailwind classes, and the
 * mockup's soft ambient depth needs a tuned y-offset/radius pair per level
 * rather than the platform default.
 */
export type ElevationLevel = "none" | "sm" | "md" | "lg" | "float";

const specs: Record<
  Exclude<ElevationLevel, "none">,
  { offsetY: number; radius: number; opacity: number; android: number }
> = {
  sm: { offsetY: 2, radius: 8, opacity: 0.05, android: 2 },
  md: { offsetY: 4, radius: 16, opacity: 0.08, android: 4 },
  lg: { offsetY: 8, radius: 24, opacity: 0.1, android: 8 },
  float: { offsetY: 8, radius: 20, opacity: 0.22, android: 12 },
};

export function elevation(level: ElevationLevel, color: string): ViewStyle {
  if (level === "none") return {};
  const spec = specs[level];

  return Platform.select<ViewStyle>({
    android: { elevation: spec.android, shadowColor: color },
    web: {
      boxShadow: `0px ${spec.offsetY}px ${spec.radius}px rgba(0, 0, 0, ${spec.opacity})`,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: spec.offsetY },
      shadowRadius: spec.radius,
      shadowOpacity: spec.opacity,
    },
  })!;
}

/** Shared timings so every transition in the app feels like one system. */
export const motion = {
  fast: 160,
  base: 240,
  slow: 420,
  /** Orb breathing and waveform loops. */
  ambient: 2400,
} as const;
