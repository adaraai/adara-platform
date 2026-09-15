import type { ComponentProps } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTokens } from "@/theme";

export type IonName = ComponentProps<typeof Ionicons>["name"];

type IconProps = {
  name: IonName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** Primary app icon set — same Ionicons import path as Aya. */
export function Icon({ name, size = 24, color, style }: IconProps) {
  const tokens = useTokens();
  return <Ionicons name={name} size={size} color={color ?? tokens.text} style={style} />;
}

/** Circular / rounded icon well used in lists and quick access. */
export function IconWell({
  children,
  backgroundColor,
  size = 48,
  radius,
  style,
}: {
  children: React.ReactNode;
  backgroundColor: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.well,
        {
          width: size,
          height: size,
          borderRadius: radius ?? size * 0.33,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "visible",
  },
});
