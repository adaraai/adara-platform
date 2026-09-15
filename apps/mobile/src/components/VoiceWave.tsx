import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const BARS = [
  { h: 18, color: "#B57CFF", delay: 0 },
  { h: 36, color: "#9B5CFF", delay: 80 },
  { h: 58, color: "#7B4DFF", delay: 40 },
  { h: 86, color: "#E14BFF", delay: 120 },
  { h: 48, color: "#C45CFF", delay: 20 },
  { h: 72, color: "#8A4DFF", delay: 100 },
  { h: 32, color: "#D080FF", delay: 60 },
  { h: 54, color: "#6D4AFF", delay: 140 },
  { h: 24, color: "#F07AFF", delay: 30 },
];

/** One bar — breathes slowly when idle, pulses fully when active (recording). */
function Bar({
  height,
  color,
  delay,
  active,
}: {
  height: number;
  color: string;
  delay: number;
  active: boolean;
}) {
  const scale = useSharedValue(0.25);

  useEffect(() => {
    if (active) {
      // Recording: fast, full-range pulse
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, {
              duration: 340,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(0.35, {
              duration: 340,
              easing: Easing.inOut(Easing.sin),
            }),
          ),
          -1,
          true,
        ),
      );
    } else {
      // Idle: slow, gentle breathing — always visible
      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.55, {
              duration: 900,
              easing: Easing.inOut(Easing.sin),
            }),
            withTiming(0.2, {
              duration: 900,
              easing: Easing.inOut(Easing.sin),
            }),
          ),
          -1,
          true,
        ),
      );
    }
  }, [active, delay, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
    opacity: active ? 1 : 0.45,
  }));

  return (
    <Animated.View
      style={[styles.bar, { height, backgroundColor: color }, style]}
    />
  );
}

/**
 * Nine-bar voice wave.
 *
 * - `active={false}` (default) — slow, gentle breathing, always visible
 * - `active={true}` — fast full-range pulse while recording
 */
export function VoiceWave({ active = false }: { active?: boolean }) {
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {BARS.map((b, i) => (
        <Bar
          key={i}
          height={b.h}
          color={b.color}
          delay={b.delay}
          active={active}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    gap: 7,
  },
  bar: {
    width: 10,
    borderRadius: 8,
  },
});
