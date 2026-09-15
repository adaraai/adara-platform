import { Pressable, View, type PressableProps } from "react-native";

import { Icon, type IonName } from "@/components/Icon";
import { cn } from "@/lib/cn";
import { tapLight } from "@/lib/haptics";
import { elevation, useTokens } from "@/theme";

export type IconButtonTone = "surface" | "primary" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

const sizes: Record<IconButtonSize, { box: string; glyph: number }> = {
  sm: { box: "h-10 w-10", glyph: 18 },
  md: { box: "h-11 w-11", glyph: 20 },
  lg: { box: "h-16 w-16", glyph: 26 },
};

const tones: Record<IconButtonTone, string> = {
  surface: "bg-surface/75",
  primary: "bg-primary",
  ghost: "bg-transparent",
};

export type IconButtonProps = PressableProps & {
  icon: IonName;
  tone?: IconButtonTone;
  size?: IconButtonSize;
  /** Small dot in the top-right, for unread notifications. */
  badge?: boolean;
  label: string;
  className?: string;
};

/** Circular control used for back, menu, notifications and overlay actions. */
export function IconButton({
  icon,
  tone = "surface",
  size = "md",
  badge,
  label,
  className,
  onPress,
  ...rest
}: IconButtonProps) {
  const tokens = useTokens();
  const dims = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={(event) => {
        tapLight();
        onPress?.(event);
      }}
      className={cn(
        "items-center justify-center rounded-full active:opacity-80",
        tone !== "primary" && dims.box,
        tone === "ghost" ? tones.ghost : tone === "surface" ? cn(dims.box, tones.surface) : dims.box,
        className,
      )}
      style={tone === "primary" ? elevation("sm", tokens.shadowColor) : undefined}
      {...rest}
    >
      {tone === "primary" ? (
        <View className={cn("items-center justify-center rounded-full bg-primary", dims.box)}>
          <Icon name={icon} size={dims.glyph} color={tokens.onPrimary} />
        </View>
      ) : (
        <Icon name={icon} size={dims.glyph} color={tokens.text} />
      )}
      {badge ? (
        <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" />
      ) : null}
    </Pressable>
  );
}
