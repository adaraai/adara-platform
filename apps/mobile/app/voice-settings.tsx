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
  description,
  trailing,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
}) {
  const tokens = useTokens();

  return (
    <View
      className="flex-row items-center gap-3 py-3"
      accessibilityLabel={description ? `${title}. ${description}` : title}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-sunken">
        <Ionicons name={icon} size={18} color={tokens.text} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="bodyStrong">{title}</Text>
        {description ? <Text variant="callout">{description}</Text> : null}
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
      accessibilityLabel={label}
      onPress={() => {
        tapLight();
        onPress();
      }}
      className="mb-2 mr-2 rounded-full px-3.5 py-2 active:opacity-80"
      style={{
        backgroundColor: selected
          ? tokens.text
          : tokens.scheme === "dark"
          ? "#1C1C1C"
          : "#F0F0F0",
      }}
    >
      <Text
        variant="label"
        style={{ color: selected ? tokens.onPrimary : tokens.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card tone="sunken" className="gap-1">
      <Text
        variant="label"
        className="text-text-tertiary"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {description ? (
        <Text variant="callout" className="mb-2">
          {description}
        </Text>
      ) : null}
      {children}
    </Card>
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
      <View className="flex-row items-center gap-2 px-gutter pb-2 pt-3">
        <IconButton
          icon="chevron-back"
          label="Back"
          onPress={() => {
            tapLight();
            goBackOrHome(router);
          }}
        />
        <Text
          variant="display"
          accessibilityRole="header"
          accessibilityLabel="Voice settings"
        >
          Voice
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-gutter pb-10 pt-2"
      >
        <SettingsSection
          title="Region"
          description="Local references Adara should know — like momo in Ghana or NEPA in Nigeria."
        >
          <View
            className="mt-1 flex-row flex-wrap"
            accessibilityRole="radiogroup"
            accessibilityLabel="Region"
          >
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
        </SettingsSection>

        <SettingsSection
          title="Speech language"
          description="Hint for the speech model. Use English for mixed Ghanaian or Nigerian English; pick Twi or Pidgin when you speak those."
        >
          <View
            className="mt-1 flex-row flex-wrap"
            accessibilityRole="radiogroup"
            accessibilityLabel="Speech language"
          >
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
            Re-open Talk after changing this so a new session picks it up.
          </Text>
        </SettingsSection>

        <SettingsSection title="Input">
          <SettingRow
            icon="mic-outline"
            title="Microphone"
            description="Required for live voice sessions"
            trailing={
              <Text variant="caption" className="text-text-secondary">
                On
              </Text>
            }
          />
          <View className="h-px bg-border" />
          <SettingRow
            icon="ear-outline"
            title="Listen automatically"
            description="Start capturing when you open Talk"
            trailing={
              <Switch
                value={autoListen}
                onValueChange={(value) => {
                  tapLight();
                  setAutoListen(value);
                }}
                trackColor={{ false: tokens.textTertiary, true: tokens.text }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Listen automatically"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Playback">
          <SettingRow
            icon="volume-high-outline"
            title="Spoken response hints"
            description="Play short cues while Adara responds"
            trailing={
              <Switch
                value={playbackHints}
                onValueChange={(value) => {
                  tapLight();
                  setPlaybackHints(value);
                }}
                trackColor={{ false: tokens.textTertiary, true: tokens.text }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Spoken response hints"
              />
            }
          />
        </SettingsSection>

        <Text
          variant="caption"
          className="mt-1 text-center text-text-tertiary"
          accessibilityRole="text"
        >
          Adara Voice
        </Text>
      </ScrollView>
    </Screen>
  );
}
