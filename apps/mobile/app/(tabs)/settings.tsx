import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Avatar, Card, Chip, Screen, Text } from "@/components";
import { api, type Language } from "@/lib/api";
import { tapLight } from "@/lib/haptics";
import { currentUser } from "@/lib/profile";
import { useTokens } from "@/theme";

function Row({
  icon,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const tokens = useTokens();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={() => {
        if (!onPress) return;
        tapLight();
        onPress();
      }}
      className="flex-row items-center gap-3 py-3 active:opacity-70"
    >
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
      {right ?? <Ionicons name="chevron-forward" size={18} color={tokens.textTertiary} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [reachable, setReachable] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void api.languages().then((result) => {
      if (!active) return;
      setReachable(result.ok);
      if (result.ok) setLanguages(result.data.data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Screen edges={{ bottom: false }}>
      <View className="px-gutter pb-2">
        <Text variant="display">Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-gutter pb-40 pt-2"
      >
        <Card tone="sunken" className="flex-row items-center gap-3">
          <Avatar source={currentUser.avatar} initials={currentUser.initials} size={56} />
          <View className="min-w-0 flex-1">
            <Text variant="heading">{currentUser.fullName}</Text>
            <Text variant="caption" className="mt-0.5 text-text-secondary">
              {currentUser.plan} · {currentUser.location}
            </Text>
          </View>
        </Card>

        <Card tone="sunken">
          <Text variant="micro">Account</Text>
          <Row
            icon="notifications-outline"
            title="Notifications"
            subtitle="Alerts, translations, and session updates"
            onPress={() => router.push("/notifications")}
          />
          <View className="h-px bg-border" />
          <Row
            icon="mic-outline"
            title="Voice input"
            subtitle="Microphone and playback"
            onPress={() => router.push("/voice-settings")}
          />
          <View className="h-px bg-border" />
          <Row icon="shield-checkmark-outline" title="Data and consent" subtitle="What ADARA stores" />
        </Card>

        <Card tone="sunken">
          <Text variant="micro">Languages</Text>
          <Text variant="caption" className="mt-2 text-text-secondary">
            {reachable === false
              ? "Offline — showing nothing until the ADARA API responds."
              : "Coverage is published per language. Planned means not shipped."}
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {languages.map((language) => (
              <Chip key={language.code} label={`${language.name} · ${language.status}`} />
            ))}
          </View>
        </Card>

        <Card tone="sunken">
          <Text variant="micro">About</Text>
          <Row icon="information-circle-outline" title="ADARA AI Lab" subtitle="Version 0.0.0 · Alpha" />
        </Card>
      </ScrollView>
    </Screen>
  );
}
