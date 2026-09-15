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

function Bar({ height, color, delay }: { height: number; color: string; delay: number }) {
  const scale = useSharedValue(0.45);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 380, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return (
    <Animated.View style={[styles.bar, { height, backgroundColor: color }, style]} />
  );
}

/** Nine-bar listening wave — same motion language as the reference Talk screen. */
export function VoiceWave() {
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {BARS.map((b, i) => (
        <Bar key={i} height={b.h} color={b.color} delay={b.delay} />
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
