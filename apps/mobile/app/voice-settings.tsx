import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";

import { Card, IconButton, Screen, Text } from "@/components";
import { goBackOrHome } from "@/lib/navigation";
import { tapLight } from "@/lib/haptics";
import {
  VOICE_REGIONS,
  VOICE_SPEECH_LANGUAGES,
  getVoicePrefs,
  setVoicePrefs,
  subscribeVoicePrefs,
  type VoicePrefs,
} from "@/lib/voicePrefs";
import { useTokens } from "@/theme";

function SettingRow({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const tokens = useTokens();

  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-sunken">
        <Ionicons name={icon} size={18} color={tokens.text} />
      </View>
      <View className="min-w-0 flex-1">
        <Text variant="bodyStrong">{title}</Text>
        {subtitle ? (
          <Text variant="caption" className="mt-0.5 text-text-secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const tokens = useTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        tapLight();
        onPress();
      }}
      className="mr-2 mb-2 rounded-full px-3 py-2 active:opacity-80"
      style={{
        backgroundColor: selected ? tokens.text : tokens.scheme === "dark" ? "#1C1C1C" : "#F0F0F0",
      }}
    >
      <Text
        variant="caption"
        style={{ color: selected ? tokens.onPrimary : tokens.text }}
        className="font-sans-medium"
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function VoiceSettingsScreen() {
  const router = useRouter();
  const tokens = useTokens();
  const [prefs, setPrefs] = useState<VoicePrefs>(getVoicePrefs);
  const [autoListen, setAutoListen] = useState(true);
  const [playbackHints, setPlaybackHints] = useState(true);

  useEffect(() => subscribeVoicePrefs(setPrefs), []);

  return (
    <Screen edges={{ bottom: false }}>
      <View className="flex-row items-center justify-between px-gutter pb-3 pt-1">
        <IconButton
          icon="arrow-back"
          label="Go back"
          onPress={() => {
            tapLight();
            goBackOrHome(router);
          }}
        />
        <Text variant="bodyStrong" className="font-sans-semibold">
          Voice settings
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-gutter pb-10 pt-1"
      >
        <Card tone="sunken">
          <Text variant="micro">Region</Text>
          <Text variant="caption" className="mb-3 mt-1 text-text-secondary">
            Sets which local references Adara looks up (momo in Ghana, NEPA in Nigeria).
          </Text>
          <View className="flex-row flex-wrap">
            {VOICE_REGIONS.map((region) => (
              <ChoiceChip
                key={region.code}
                label={region.label}
                selected={prefs.locale === region.code}
                onPress={() =>
                  setVoicePrefs({
                    locale: region.code,
                    speechLanguage: region.speechDefault,
                  })
                }
              />
            ))}
          </View>
        </Card>

        <Card tone="sunken">
          <Text variant="micro">Speech language</Text>
          <Text variant="caption" className="mb-3 mt-1 text-text-secondary">
            Sent to the speech model as an adapter hint. Use English for mixed Ghanaian /
            Nigerian English; pick Twi or Pidgin for those languages.
          </Text>
          <View className="flex-row flex-wrap">
            {VOICE_SPEECH_LANGUAGES.map((lang) => (
              <ChoiceChip
                key={lang.code}
                label={lang.label}
                selected={prefs.speechLanguage === lang.code}
                onPress={() => setVoicePrefs({ speechLanguage: lang.code })}
              />
            ))}
          </View>
          <Text variant="caption" className="mt-2 text-text-tertiary">
            Re-open the voice screen after changing this so a new session picks it up.
          </Text>
        </Card>

        <Card tone="sunken">
          <Text variant="micro">Input</Text>
          <SettingRow
            icon="mic-outline"
            title="Microphone"
            subtitle="Required for live voice sessions"
            trailing={
              <Text variant="caption" className="text-text-secondary">
                Enabled
              </Text>
            }
          />
          <View className="h-px bg-border" />
          <SettingRow
            icon="ear-outline"
            title="Start listening automatically"
            subtitle="Begin capture when you open voice"
            trailing={
              <Switch
                value={autoListen}
                onValueChange={(value) => {
                  tapLight();
                  setAutoListen(value);
                }}
                trackColor={{ false: tokens.textTertiary, true: tokens.text }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Card>

        <Card tone="sunken">
          <Text variant="micro">Playback</Text>
          <SettingRow
            icon="volume-high-outline"
            title="Spoken response hints"
            subtitle="Play short cues while Adara responds"
            trailing={
              <Switch
                value={playbackHints}
                onValueChange={(value) => {
                  tapLight();
                  setPlaybackHints(value);
                }}
                trackColor={{ false: tokens.textTertiary, true: tokens.text }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}
