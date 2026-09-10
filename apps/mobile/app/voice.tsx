import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Orb, Screen, Text } from "@/components";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import { tapLight, tapMedium } from "@/lib/haptics";
import { goBackOrHome } from "@/lib/navigation";
import { getVoicePrefs } from "@/lib/voicePrefs";
import { elevation, motion, useTokens } from "@/theme";

const BAR_HEIGHT = 52;
const CLOSE_SIZE = 48;
const FOOTER_GAP = 10;
const FOOTER_PAD = 20;

function HeaderButton({
  icon,
  label,
  onPress,
  variant = "surface",
  size = 44,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: "surface" | "close";
  size?: number;
}) {
  const tokens = useTokens();
  const isClose = variant === "close";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tapLight();
        onPress?.();
      }}
      className="items-center justify-center rounded-full active:opacity-70"
      style={[
        { width: size, height: size, flexShrink: 0 },
        isClose
          ? {
              backgroundColor: tokens.scheme === "dark" ? tokens.text : "#111111",
            }
          : [{ backgroundColor: tokens.scheme === "dark" ? "#262626" : "#FFFFFF" }, elevation("sm", tokens.shadowColor)],
      ]}
    >
      <Ionicons
        name={icon}
        size={isClose ? 20 : 22}
        color={isClose ? (tokens.scheme === "dark" ? "#111111" : "#FFFFFF") : tokens.text}
      />
    </Pressable>
  );
}

function VoiceFooter({
  chipBg,
  shadowColor,
  bottomInset,
  animatedStyle,
  draft,
  onChangeDraft,
  onSendText,
  onMic,
  onClose,
  micIcon = "mic",
  sending = false,
}: {
  chipBg: string;
  shadowColor: string;
  bottomInset: number;
  animatedStyle?: StyleProp<ViewStyle>;
  draft: string;
  onChangeDraft: (text: string) => void;
  onSendText: () => void;
  onMic: () => void;
  onClose: () => void;
  micIcon?: keyof typeof Ionicons.glyphMap;
  sending?: boolean;
}) {
  const tokens = useTokens();
  const canSend = draft.trim().length > 0 && !sending;

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: FOOTER_GAP,
    paddingHorizontal: FOOTER_PAD,
    paddingBottom: bottomInset,
    width: "100%",
  };

  const pillStyle: ViewStyle = {
    flex: 1,
    minWidth: 0,
    minHeight: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BAR_HEIGHT / 2,
    paddingHorizontal: 16,
    backgroundColor: chipBg,
    ...elevation("sm", shadowColor),
  };

  const iconButtonStyle: ViewStyle = {
    width: BAR_HEIGHT,
    height: BAR_HEIGHT,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: chipBg,
    ...elevation("sm", shadowColor),
  };

  const content = (
    <>
      <View style={pillStyle}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={tokens.text} />
        <TextInput
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Ask ADARA"
          placeholderTextColor={tokens.textTertiary}
          editable={!sending}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={() => {
            if (!canSend) return;
            tapLight();
            onSendText();
          }}
          accessibilityLabel="Type a message"
          className="ml-2 min-w-0 flex-1 font-sans text-body text-text"
          style={{
            fontSize: 16,
            lineHeight: 22,
            paddingVertical: Platform.OS === "ios" ? 14 : 10,
          }}
        />
        {canSend ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send"
            onPress={() => {
              tapLight();
              onSendText();
            }}
            className="ml-1 h-8 w-8 items-center justify-center rounded-full active:opacity-70"
            style={{ backgroundColor: tokens.text }}
          >
            <Ionicons name="arrow-up" size={16} color={tokens.onPrimary} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voice input"
        onPress={onMic}
        style={iconButtonStyle}
        className="active:opacity-80"
      >
        <Ionicons name={micIcon} size={24} color={tokens.text} />
      </Pressable>

      <HeaderButton
        icon="close-outline"
        label="Close voice session"
        variant="close"
        size={CLOSE_SIZE}
        onPress={onClose}
      />
    </>
  );

  if (Platform.OS === "web") {
    return <View style={[rowStyle, animatedStyle]}>{content}</View>;
  }

  return (
    <Animated.View style={[rowStyle, animatedStyle]} className="shrink-0">
      {content}
    </Animated.View>
  );
}

export default function VoiceScreen() {
  const router = useRouter();
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const chipBg = tokens.scheme === "dark" ? "#1C1C1C" : "#F7F7F8";
  const isWeb = Platform.OS === "web";
  const [draft, setDraft] = useState("");

  const {
    micState,
    session,
    turns,
    capabilities,
    error,
    loading,
    startRecording,
    stopAndSend,
    sendText,
    speakReply,
  } = useVoiceSession();
  const prefs = getVoicePrefs();
  const regionLabel = session?.locale ?? prefs.locale;
  const speechLabel = prefs.speechLanguage === "en" ? "English" : prefs.speechLanguage;

  const closeVoice = () => {
    tapLight();
    goBackOrHome(router);
  };

  const openVoiceSettings = () => {
    tapLight();
    router.push("/voice-settings");
  };

  const handleMic = async () => {
    tapMedium();
    if (micState === "idle") {
      await startRecording();
    } else if (micState === "recording") {
      await stopAndSend();
    }
  };

  const handleSendText = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void sendText(text);
  };

  // Derive Orb state from mic state
  const orbState =
    micState === "recording"
      ? "listening"
      : micState === "processing"
        ? "thinking"
        : "idle";

  const headerIn = useSharedValue(isWeb ? 1 : 0);
  const footerIn = useSharedValue(isWeb ? 1 : 0);

  useEffect(() => {
    if (isWeb) return;
    headerIn.value = withTiming(1, { duration: motion.base, easing: Easing.out(Easing.cubic) });
    footerIn.value = withDelay(
      140,
      withTiming(1, { duration: motion.slow, easing: Easing.out(Easing.cubic) }),
    );
  }, [footerIn, headerIn, isWeb]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerIn.value,
    transform: [{ translateY: (1 - headerIn.value) * -10 }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerIn.value,
    transform: [{ translateY: (1 - footerIn.value) * 18 }],
  }));

  const headerRowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: FOOTER_PAD,
    paddingTop: 8,
    width: "100%",
  };

  const micIcon =
    micState === "recording"
      ? "stop-circle-outline"
      : micState === "processing"
        ? "hourglass-outline"
        : "mic";

  const canRecord = !loading && (capabilities?.transcribe ?? false);

  const header =
    Platform.OS === "web" ? (
      <View style={headerRowStyle}>
        <HeaderButton icon="menu-outline" label="Menu" onPress={closeVoice} />
        <HeaderButton icon="settings-outline" label="Voice settings" onPress={openVoiceSettings} />
      </View>
    ) : (
      <Animated.View style={[headerRowStyle, headerStyle]} className="shrink-0">
        <HeaderButton icon="menu-outline" label="Menu" onPress={closeVoice} />
        <HeaderButton icon="settings-outline" label="Voice settings" onPress={openVoiceSettings} />
      </Animated.View>
    );

  // Latest replied/failed turn for inline display
  const latestTurn = [...turns].reverse().find((t) => t.status === "replied" || t.status === "failed");

  return (
    <Screen edges={{ bottom: false }}>
      <View className="min-h-0 flex-1 flex-col">
        {header}

        {/* Orb + turn transcript */}
        <View className="min-h-0 flex-1 items-center justify-center px-6">
          <Orb size={240} state={orbState} animateIn={!isWeb} />

          <Text className="mt-3 text-center text-xs text-text-tertiary">
            {regionLabel} · {speechLabel} ASR — change in settings
          </Text>

          {/* Session error */}
          {error && (
            <View className="mt-4 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
              <Text className="text-center text-sm text-red-600 dark:text-red-400">{error}</Text>
            </View>
          )}

          {/* No mic available */}
          {!loading && !canRecord && !error && (
            <Text className="mt-4 text-center text-sm text-text-tertiary">
              Speech is not available — use the keyboard below.
            </Text>
          )}

          {/* Latest turn reply */}
          {latestTurn?.reply?.text ? (
            <ScrollView
              className="mt-6 w-full"
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {latestTurn.text ? (
                <Text className="mb-2 text-center text-sm text-text-tertiary">
                  "{latestTurn.text}"
                </Text>
              ) : null}
              <Text className="text-center text-base text-text">{latestTurn.reply.text}</Text>
              {latestTurn.reply.warnings?.length > 0 && (
                <Text className="mt-2 text-center text-xs text-text-tertiary">
                  ⚠ {latestTurn.reply.warnings[0]}
                </Text>
              )}
              {/* Re-listen button — only shown when TTS is available */}
              {capabilities?.synthesize ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Replay reply"
                  onPress={() => {
                    tapLight();
                    speakReply(
                      latestTurn.reply!.text,
                      latestTurn.meaning?.language ?? null,
                    );
                  }}
                  className="mt-3 self-center active:opacity-60"
                >
                  <Ionicons name="volume-medium-outline" size={22} color="#888" />
                </Pressable>
              ) : null}
            </ScrollView>
          ) : null}

          {/* Turn error */}
          {latestTurn?.error?.message ? (
            <Text className="mt-4 text-center text-sm text-text-tertiary">
              {latestTurn.error.message}
            </Text>
          ) : null}
        </View>

        <VoiceFooter
          chipBg={chipBg}
          shadowColor={tokens.shadowColor}
          bottomInset={
            Platform.OS === "android"
              ? Math.max(insets.bottom, 32)
              : keyboardHeight > 0
                ? 8
                : Math.max(insets.bottom, 32)
          }
          animatedStyle={
            Platform.OS === "android"
              ? footerStyle
              : [footerStyle, { marginBottom: keyboardHeight }]
          }
          draft={draft}
          onChangeDraft={setDraft}
          onSendText={handleSendText}
          onMic={canRecord ? handleMic : () => tapLight()}
          onClose={closeVoice}
          micIcon={micIcon}
          sending={micState === "processing"}
        />
      </View>
    </Screen>
  );
}
