import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";

import { tapLight } from "@/lib/haptics";
import { useTokens, textFontStyle } from "@/theme";

export type ChatComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onVoice?: () => void;
  onFocus?: () => void;
  onContentSizeChange?: () => void;
  placeholder?: string;
  inputRef?: RefObject<TextInput | null>;
  bottomInset?: number;
};

const MIN_INPUT_HEIGHT = 22;
const MAX_INPUT_HEIGHT = 120;
/** iOS zooms inputs below 16px — keep chat typing stable. */
const INPUT_FONT_SIZE = 16;
const INPUT_LINE_HEIGHT = 22;

/** Minimal OpenAI-style composer — grows with text, send when typing. */
export function ChatComposer({
  value,
  onChangeText,
  onSend,
  onFocus,
  onContentSizeChange,
  placeholder = "Type to translate…",
  inputRef,
  bottomInset = 12,
}: ChatComposerProps) {
  const tokens = useTokens();
  const canSend = value.trim().length > 0;
  const localInputRef = useRef<TextInput>(null);

  const setInputRef = useCallback(
    (node: TextInput | null) => {
      localInputRef.current = node;
      if (inputRef) inputRef.current = node;
    },
    [inputRef],
  );

  const submit = () => {
    if (!canSend) return;
    tapLight();
    onSend();
  };

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const node = localInputRef.current as unknown as HTMLTextAreaElement | null;
    if (!node?.addEventListener) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      if (!value.trim()) return;
      event.preventDefault();
      tapLight();
      onSend();
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [onSend, value]);

  return (
    <View className="bg-bg px-gutter pt-2" style={{ paddingBottom: bottomInset }}>
      <View className="min-h-[46px] flex-row items-end rounded-[24px] border border-border bg-surface-sunken px-3 py-1.5 dark:bg-surface/60">
        <TextInput
          ref={setInputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onContentSizeChange={onContentSizeChange}
          placeholder={placeholder}
          placeholderTextColor={tokens.textTertiary}
          multiline
          blurOnSubmit={false}
          scrollEnabled
          textAlignVertical="center"
          returnKeyType="default"
          autoCorrect
          spellCheck
          autoCapitalize="sentences"
          className="min-w-0 flex-1 bg-transparent text-text"
          style={{
            ...textFontStyle,
            fontSize: INPUT_FONT_SIZE,
            lineHeight: INPUT_LINE_HEIGHT,
            minHeight: MIN_INPUT_HEIGHT,
            maxHeight: MAX_INPUT_HEIGHT,
            minWidth: 0,
            paddingTop: Platform.OS === "ios" || Platform.OS === "web" ? 8 : 6,
            paddingBottom: Platform.OS === "ios" || Platform.OS === "web" ? 8 : 6,
          }}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={canSend ? "Send message" : "Send disabled"}
          onPress={submit}
          disabled={!canSend}
          className="mb-0.5 h-11 w-11 shrink-0 items-center justify-center rounded-full active:opacity-80 disabled:opacity-30"
          style={{ backgroundColor: canSend ? tokens.text : tokens.textTertiary }}
        >
          <Ionicons name="arrow-up" size={18} color={tokens.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
