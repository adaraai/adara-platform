import { Pressable, View, type PressableProps } from "react-native";

import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { elevation, useTokens } from "@/theme";
import { tapLight } from "@/lib/haptics";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Radius lives on the outer Pressable as well as the inner fill: iOS derives
 * the shadow path from the outer shape, and `overflow-hidden` on that same
 * view would clip the shadow away.
 */
const sizes: Record<ButtonSize, { box: string; radius: string; label: string }> = {
  sm: { box: "h-9 px-4", radius: "rounded-full", label: "text-caption" },
  md: { box: "h-12 px-5", radius: "rounded-full", label: "text-callout" },
  lg: { box: "h-14 px-6", radius: "rounded-full", label: "text-body" },
};

const surfaces: Record<Exclude<ButtonVariant, "primary">, string> = {
  secondary: "bg-surface/70",
  ghost: "bg-transparent",
  danger: "bg-danger",
};

const labels: Record<ButtonVariant, string> = {
  primary: "text-on-primary",
  secondary: "text-text",
  ghost: "text-text",
  danger: "text-white",
};

export type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label — an icon, badge or dot. */
  leading?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
};

/**
 * Primary buttons use the violet gradient from the design tokens; the other
 * variants are flat so the gradient stays reserved for the single most
 * important action on a screen.
 */
export function Button({
  label,
  variant = "primary",
  size = "md",
  leading,
  fullWidth,
  className,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const tokens = useTokens();
  const dims = sizes[size];

  const content = (
    <View className="flex-row items-center justify-center gap-2">
      {leading}
      <Text className={cn("font-sans-semibold", dims.label, labels[variant])}>
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={(event) => {
        tapLight();
        onPress?.(event);
      }}
      className={cn(
        "active:opacity-90",
        dims.radius,
        fullWidth && "w-full",
        disabled && "opacity-40",
        className,
      )}
      style={variant === "primary" ? elevation("sm", tokens.shadowColor) : undefined}
      {...rest}
    >
      {variant === "primary" ? (
        <View
          className={cn(
            "items-center justify-center bg-primary",
            dims.box,
            dims.radius,
          )}
        >
          {content}
        </View>
      ) : (
        <View
          className={cn(
            "items-center justify-center",
            dims.box,
            dims.radius,
            surfaces[variant],
          )}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}
