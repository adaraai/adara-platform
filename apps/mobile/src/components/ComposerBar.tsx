import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { Text } from "@/components/Text";
import { tapLight } from "@/lib/haptics";
import { cn } from "@/lib/cn";
import { useTokens } from "@/theme";

export type ComposerBarProps = {
  placeholder?: string;
  onPress?: () => void;
  onVoicePress?: () => void;
  className?: string;
};

/** Standard AI-app message composer — tap to type, mic for voice. */
export function ComposerBar({
  placeholder = "Ask ADARA anything…",
  onPress,
  onVoicePress,
  className,
}: ComposerBarProps) {
  const tokens = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      onPress={() => {
        tapLight();
        onPress?.();
      }}
      className={cn(
        "h-12 flex-row items-center rounded-full border border-border bg-surface-sunken px-4 active:opacity-80",
        className,
      )}
    >
      <Ionicons name="chatbubble-ellipses-outline" size={20} color={tokens.text} />
      <Text variant="body" className="ml-2.5 flex-1 text-text-tertiary">
        {placeholder}
      </Text>
      {onVoicePress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start voice"
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation?.();
            tapLight();
            onVoicePress();
          }}
          className="h-9 w-9 items-center justify-center rounded-full bg-text active:opacity-80"
        >
          <VoiceWaveformIcon size={16} color={tokens.onPrimary} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
