import { useEffect, useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/cn";

/** Deterministic bar heights — same seed always draws the same wave shape. */
function heights(count: number, seed: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.9) * Math.cos((i + seed) * 0.31);
    return 0.28 + Math.abs(wave) * 0.72;
  });
}

function fitBarCount(
  width: number,
  maxBars: number,
  barWidth: number,
  barGap: number,
): number {
  if (width <= 0) return 0;
  const slot = barWidth + barGap;
  let count = Math.floor((width + barGap) / slot);
  count = Math.max(6, Math.min(maxBars, count));

  while (count > 6 && count * barWidth + (count - 1) * barGap > width) {
    count -= 1;
  }

  return count;
}

type BarProps = {
  barHeight: number;
  index: number;
  animated: boolean;
  color: string;
  width: number;
};

function Bar({ barHeight, index, animated, color, width }: BarProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!animated) {
      pulse.value = 1;
      return;
    }
    pulse.value = withDelay(
      index * 45,
      withRepeat(
        withTiming(0.35, { duration: 520, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [animated, index, pulse]);

  const style = useAnimatedStyle(() => ({
    height: Math.max(3, barHeight * pulse.value),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          flexShrink: 0,
          borderRadius: width / 2,
          backgroundColor: color,
          alignSelf: "center",
        },
        animated ? style : { height: barHeight },
      ]}
    />
  );
}

export type WaveformProps = {
  bars?: number;
  progress?: number;
  animated?: boolean;
  color?: string;
  trackColor?: string;
  height?: number;
  seed?: number;
  barWidth?: number;
  barGap?: number;
  className?: string;
};

/** Wave bars that always fit inside the container — no squashing or overlap. */
export function Waveform({
  bars = 34,
  progress = 1,
  animated = false,
  color = "#FFFFFF",
  trackColor = "rgba(255,255,255,0.28)",
  height = 34,
  seed = 3,
  barWidth = 2.5,
  barGap = 2,
  className,
}: WaveformProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);

  const barCount = useMemo(
    () => fitBarCount(layoutWidth, bars, barWidth, barGap),
    [layoutWidth, bars, barWidth, barGap],
  );

  const scales = useMemo(
    () => (barCount > 0 ? heights(barCount, seed) : []),
    [barCount, seed],
  );
  const played = Math.round(barCount * progress);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next !== layoutWidth) setLayoutWidth(next);
  };

  return (
    <View
      className={cn("w-full overflow-hidden", className)}
      style={{ height }}
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
    >
      {barCount > 0 ? (
        <View
          className="flex-row items-center"
          style={{ height, width: layoutWidth, columnGap: barGap }}
        >
          {scales.map((scale, i) => (
            <Bar
              key={`${barCount}-${i}`}
              index={i}
              barHeight={scale * height}
              animated={animated}
              width={barWidth}
              color={i < played ? color : trackColor}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
