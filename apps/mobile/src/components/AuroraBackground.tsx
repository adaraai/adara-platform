import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { Gradient } from "@/components/primitives";
import { useTokens } from "@/theme";

type Blob = {
  id: string;
  cx: string;
  cy: string;
  r: string;
  inner: string;
  outer: string;
  innerOpacity: number;
};

/**
 * Soft mesh-style canvas: a neutral base with several diffused radial blooms
 * and a light vignette so cards float above colour instead of sitting on a
 * flat diagonal stripe.
 */
export function AuroraBackground() {
  const { width, height } = useWindowDimensions();
  const tokens = useTokens();
  const blobs = tokens.auroraBlobs;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {blobs.map((blob) => (
            <RadialGradient
              key={blob.id}
              id={blob.id}
              cx={blob.cx}
              cy={blob.cy}
              r={blob.r}
            >
              <Stop
                offset="0%"
                stopColor={blob.inner}
                stopOpacity={blob.innerOpacity}
              />
              <Stop offset="55%" stopColor={blob.outer} stopOpacity={0.18} />
              <Stop offset="100%" stopColor={blob.outer} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>

        <Rect width={width} height={height} fill={tokens.auroraBase} />
        {blobs.map((blob) => (
          <Rect
            key={`fill-${blob.id}`}
            width={width}
            height={height}
            fill={`url(#${blob.id})`}
          />
        ))}
      </Svg>

      {/* Top light wash — keeps headers readable and adds depth */}
      <Gradient
        colors={tokens.auroraWash}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Corner bloom for the glassmorphic mockup sheen */}
      <Gradient
        colors={["rgba(255,255,255,0.55)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 0.5 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
      />
    </View>
  );
}

export type { Blob };
