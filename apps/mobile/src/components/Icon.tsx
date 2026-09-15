import type { ComponentProps } from "react";
import { type StyleProp, type TextStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTokens } from "@/theme";

export type IonName = ComponentProps<typeof Ionicons>["name"];

type IconProps = {
  name: IonName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** Primary app icon set — Ionicons. */
export function Icon({ name, size = 24, color, style }: IconProps) {
  const tokens = useTokens();
  return <Ionicons name={name} size={size} color={color ?? tokens.text} style={style} />;
}
