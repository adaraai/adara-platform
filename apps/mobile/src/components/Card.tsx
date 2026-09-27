import type { ReactNode } from "react";
import { Platform, View, type ViewProps } from "react-native";

import { Blur } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { useTokens, type ElevationLevel } from "@/theme";

export type CardTone = "solid" | "glass" | "sunken" | "primary";

const tones: Record<CardTone, string> = {
  solid: "overflow-hidden bg-surface/72 dark:bg-surface/55",
  glass: "overflow-hidden bg-surface/60 dark:bg-surface/45",
  sunken: "bg-surface-sunken/80",
  primary: "bg-primary",
};

/** expo-blur has no web implementation — use opaque fills instead. */
const webTones: Record<CardTone, string> = {
  solid: "overflow-hidden bg-surface",
  glass: "overflow-hidden bg-surface",
  sunken: "bg-surface-sunken",
  primary: "bg-primary",
};

export type CardProps = ViewProps & {
  children: ReactNode;
  tone?: CardTone;
  /** Kept for API compat; cards on the aurora canvas no longer cast shadows. */
  level?: ElevationLevel;
  className?: string;
};

export function Card({
  children,
  tone = "glass",
  className,
  style,
  ...rest
}: CardProps) {
  const tokens = useTokens();
  const onWeb = Platform.OS === "web";
  const palette = onWeb ? webTones : tones;
  const frosted = !onWeb && (tone === "solid" || tone === "glass");

  return (
    <View
      className={cn("rounded-md p-4", palette[tone], className)}
      style={style}
      {...rest}
    >
      {frosted ? (
        <Blur
          intensity={tokens.blurIntensity}
          tint={tokens.blurTint}
          className="absolute bottom-0 left-0 right-0 top-0"
        />
      ) : null}
      {children}
    </View>
  );
}
