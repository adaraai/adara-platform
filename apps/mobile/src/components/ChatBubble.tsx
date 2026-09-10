import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/components/Text";
import { Waveform } from "@/components/Waveform";
import { cn } from "@/lib/cn";
import { useTokens } from "@/theme";

export type BubbleRole = "assistant" | "user";

export type ChatBubbleProps = {
  role: BubbleRole;
  lang?: string;
  children: React.ReactNode;
  className?: string;
};

function LangLabel({ children, align = "left" }: { children: string; align?: "left" | "right" }) {
  return (
    <Text
      variant="caption"
      className={cn(
        "mb-1 font-sans-semibold text-text-tertiary",
        align === "right" ? "text-right" : undefined,
      )}
    >
      {children}
    </Text>
  );
}

/** User pill or plain assistant block. */
export function ChatBubble({ role, lang, children, className }: ChatBubbleProps) {
  if (role === "assistant") {
    return <View className={cn("w-full py-1", className)}>{children}</View>;
  }

  return (
    <View className="w-full items-end py-1">
      {lang ? <LangLabel align="right">{lang}</LangLabel> : null}
      <View className="max-w-[88%] rounded-[20px] bg-surface-sunken px-4 py-2.5 dark:bg-surface/60">
        {children}
      </View>
    </View>
  );
}

export type TranslationBlockProps = {
  fromLang: string;
  toLang: string;
  source: string;
  translation: string;
};

/** Bilingual turn — source language then translation. */
export function TranslationBlock({
  fromLang,
  toLang,
  source,
  translation,
}: TranslationBlockProps) {
  return (
    <View className="w-full py-1">
      <View className="mb-4">
        <LangLabel>{fromLang}</LangLabel>
        <Text variant="body" className="leading-relaxed text-text-secondary">
          {source}
        </Text>
      </View>
      <View>
        <LangLabel>{toLang}</LangLabel>
        <Text variant="body" className="leading-relaxed">
          {translation}
        </Text>
      </View>
    </View>
  );
}

export type LanguagePairProps = {
  fromLang: string;
  toLang: string;
  compact?: boolean;
};

/** Shows the active translation direction. */
export function LanguagePair({ fromLang, toLang, compact }: LanguagePairProps) {
  const tokens = useTokens();
  const fontSize = compact ? 12 : 13;
  const lineHeight = compact ? 16 : 18;
  const iconSize = compact ? 11 : 13;
  const spacer = compact ? 4 : 6;

  return (
    <View
      className={cn(
        "flex-row items-center rounded-full border border-border bg-surface-sunken",
        compact ? "px-2 py-1" : "px-3 py-1.5",
      )}
      style={{ alignSelf: "flex-start" }}
    >
      <Text
        numberOfLines={1}
        style={{ fontSize, lineHeight, flexShrink: 0 }}
        className="font-sans-medium text-text"
      >
        {fromLang}
      </Text>
      <View style={{ width: spacer }} />
      <Ionicons name="arrow-forward" size={iconSize} color={tokens.textTertiary} />
      <View style={{ width: spacer }} />
      <Text
        numberOfLines={1}
        style={{ fontSize, lineHeight, flexShrink: 0 }}
        className="font-sans-medium text-text"
      >
        {toLang}
      </Text>
    </View>
  );
}

export function AssistantMark({ size = 36 }: { size?: number }) {
  const tokens = useTokens();
  const glyph = Math.round(size * 0.46);

  return (
    <View
      className="items-center justify-center rounded-full border border-border bg-surface-sunken"
      style={{ height: size, width: size }}
    >
      <Ionicons name="language-outline" size={glyph} color={tokens.text} />
    </View>
  );
}

export type VoiceNoteProps = {
  duration: string;
  lang?: string;
  progress?: number;
  seed?: number;
};

export function VoiceNote({ duration, lang, progress = 0.62, seed = 5 }: VoiceNoteProps) {
  const tokens = useTokens();

  return (
    <View className="w-full">
      {lang ? <LangLabel align="right">{`${lang} · voice`}</LangLabel> : null}
      <View className="flex-row items-center rounded-[20px] bg-surface-sunken px-3 py-2.5 dark:bg-surface/60">
        <View className="min-w-0 flex-1" style={{ marginRight: 8 }}>
          <Waveform
            height={24}
            bars={36}
            barWidth={2.5}
            barGap={2}
            progress={progress}
            seed={seed}
            color={tokens.text}
            trackColor={tokens.textTertiary}
          />
        </View>

        <Text
          variant="caption"
          className="shrink-0 font-sans-medium text-text-secondary"
          style={{ marginRight: 8 }}
        >
          {duration}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Play voice note"
          className="h-7 w-7 shrink-0 items-center justify-center rounded-full bg-text active:opacity-70"
        >
          <Ionicons name="play" size={12} color={tokens.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
