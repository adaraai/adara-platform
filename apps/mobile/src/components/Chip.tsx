import { Pressable } from "react-native";

import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { tapLight } from "@/lib/haptics";

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

/** Pill filter used for the topic rail and language selection. */
export function Chip({ label, selected, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        tapLight();
        onPress?.();
      }}
      className={cn(
        "h-10 items-center justify-center rounded-full px-5 active:opacity-80",
        selected
          ? "bg-text"
          : "bg-surface-sunken border border-border",
        className,
      )}
    >
      <Text
        className={cn(
          "font-sans-medium text-callout",
          selected ? "text-text-inverse" : "text-text-secondary",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
