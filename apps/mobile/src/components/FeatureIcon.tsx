import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { View } from "react-native";

import { cn } from "@/lib/cn";

type FeatureIconProps = {
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
};

/** Consistent icon badge used on home feature cards. */
export function FeatureIcon({ children, size = "md", className }: FeatureIconProps) {
  const box = size === "lg" ? "h-12 w-12" : "h-10 w-10";

  return (
    <View
      className={cn(
        "items-center justify-center rounded-full border border-border bg-bg",
        box,
        className,
      )}
    >
      {children}
    </View>
  );
}

type IonFeatureIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: "md" | "lg";
  color: string;
  glyph?: number;
};

export function IonFeatureIcon({ name, size = "md", color, glyph }: IonFeatureIconProps) {
  const iconSize = glyph ?? (size === "lg" ? 24 : 20);

  return (
    <FeatureIcon size={size}>
      <Ionicons name={name} size={iconSize} color={color} />
    </FeatureIcon>
  );
}
