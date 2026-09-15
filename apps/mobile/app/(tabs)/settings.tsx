import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Switch, View } from "react-native";

import { Avatar, Card, Screen, Text } from "@/components";
import { ACCENT } from "@/lib/brand";
import { tapLight } from "@/lib/haptics";
import { currentUser } from "@/lib/profile";
import { useTokens } from "@/theme";

type IonName = keyof typeof Ionicons.glyphMap;

type Badge = {
  icon: IonName;
  label: string;
  desc: string;
  wash: string;
  earned: boolean;
};

type LinkItem = {
  icon: IonName;
  label: string;
  desc: string;
  onPress: () => void;
};

function IconWell({
  backgroundColor,
  children,
  size = 44,
  radius = 14,
}: {
  backgroundColor: string;
  children: React.ReactNode;
  size?: number;
  radius?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const tokens = useTokens();
  const isDark = tokens.scheme === "dark";
  const [a11yOn, setA11yOn] = useState(false);

  const wash = {
    yellow: isDark ? "#3A3218" : "#FFF6D9",
    green: isDark ? "#16301C" : "#EAF7EC",
    purple: isDark ? "#3A3218" : "#FFF6D9",
    blue: isDark ? "#182338" : "#E8F1FF",
    ghost: isDark ? "#242132" : "#F3F2F8",
    danger: isDark ? "#3A1818" : "#FDECEC",
  };

  const badges: Badge[] = [
    {
      icon: "mic",
      label: "First voice session",
      desc: "Completed a spoken turn with Adara",
      wash: wash.yellow,
      earned: true,
    },
    {
      icon: "shield-checkmark",
      label: "Private by default",
      desc: "Kept consent settings locked down",
      wash: wash.green,
      earned: true,
    },
    {
      icon: "swap-horizontal",
      label: "Code-switch pro",
      desc: "Mixed Twi and English in one sentence",
      wash: wash.purple,
      earned: true,
    },
    {
      icon: "trending-up",
      label: "5 sessions in a week",
      desc: "Used Adara voice 5 times this week",
      wash: wash.blue,
      earned: false,
    },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  const links: LinkItem[] = [
    {
      icon: "notifications-outline",
      label: "Notifications",
      desc: "Alerts and session updates",
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "mic-outline",
      label: "Voice input",
      desc: "Microphone and playback",
      onPress: () => router.push("/voice-settings"),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Security & Privacy",
      desc: "Consent, data, and how Adara protects you",
      onPress: () =>
        Alert.alert("Security & Privacy", "Adara keeps your words private by default."),
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      desc: "FAQs and talk to support",
      onPress: () => Alert.alert("Help", "Email support@adara.ai for help."),
    },
  ];

  const confirmLogout = () => {
    const message = "You'll need to sign in again to use Adara.";
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm(`Log out?\n\n${message}`)) {
        Alert.alert("Logged out", "Sign-in will return in a later build.");
      }
      return;
    }
    Alert.alert("Log out?", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => Alert.alert("Logged out", "Sign-in will return in a later build."),
      },
    ]);
  };

  return (
    <Screen edges={{ bottom: false }}>
      <View className="flex-row items-center gap-2 px-gutter pb-2 pt-1">
        <Pressable
          onPress={() => {
            tapLight();
            router.push("/");
          }}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          hitSlop={8}
          className="h-11 w-11 items-center justify-center active:opacity-70"
        >
          <Ionicons name="chevron-back" size={26} color={tokens.text} />
        </Pressable>
        <Text variant="display" className="flex-1">
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-gutter pb-40 pt-2"
      >
        <Card tone="sunken" className="flex-row items-center gap-4">
          <Avatar source={currentUser.avatar} initials={currentUser.initials} size={64} />
          <View className="min-w-0 flex-1">
            <Text variant="bodyStrong" numberOfLines={1}>
              {currentUser.fullName}
            </Text>
            <Text variant="caption" className="text-text-secondary" numberOfLines={1}>
              {currentUser.accountHint}
            </Text>
            <Text variant="micro" className="mt-1 text-text-tertiary">
              Speaking {currentUser.language}
            </Text>
          </View>
        </Card>

        <Pressable
          onPress={() => {
            tapLight();
            setA11yOn((v) => !v);
          }}
          accessibilityRole="button"
          accessibilityState={{ selected: a11yOn }}
          accessibilityLabel={`Accessibility mode: ${a11yOn ? "on" : "off"}`}
        >
          <Card tone="sunken" className="flex-row items-center gap-3.5">
            <IconWell backgroundColor={wash.purple}>
              <Ionicons name="accessibility" size={22} color={tokens.text} />
            </IconWell>
            <View className="min-w-0 flex-1">
              <Text variant="bodyStrong">Accessibility mode</Text>
              <Text variant="caption" className="text-text-secondary">
                Voice-first, large text, high contrast, captions
              </Text>
            </View>
            <View pointerEvents="none">
              <Switch
                value={a11yOn}
                onValueChange={() => {}}
                trackColor={{ false: "#D8D6E2", true: ACCENT }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </Pressable>

        <Card tone="sunken" className="flex-row items-center gap-4">
          <IconWell backgroundColor={wash.purple} size={56} radius={20}>
            <Ionicons name="flame" size={26} color={tokens.text} />
          </IconWell>
          <View className="min-w-0 flex-1">
            <Text variant="bodyStrong">5-day practice streak</Text>
            <Text variant="caption" className="text-text-secondary">
              {earnedCount} of {badges.length} badges earned
            </Text>
          </View>
        </Card>

        <Text variant="heading" className="mt-1">
          Badges
        </Text>
        <View className="gap-2">
          {badges.map((badge) => (
            <Card
              key={badge.label}
              tone="sunken"
              className="flex-row items-center gap-3.5"
              style={!badge.earned ? { opacity: 0.6 } : undefined}
            >
              <IconWell backgroundColor={badge.earned ? badge.wash : wash.ghost}>
                <Ionicons
                  name={badge.earned ? badge.icon : "lock-closed"}
                  size={20}
                  color={badge.earned ? tokens.text : tokens.textTertiary}
                />
              </IconWell>
              <View className="min-w-0 flex-1">
                <Text
                  variant="bodyStrong"
                  className={badge.earned ? "text-text" : "text-text-secondary"}
                >
                  {badge.label}
                </Text>
                <Text variant="caption" className="text-text-secondary">
                  {badge.desc}
                </Text>
              </View>
              {badge.earned ? (
                <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
              ) : null}
            </Card>
          ))}
        </View>

        <View className="gap-2">
          {links.map((link) => (
            <Pressable
              key={link.label}
              onPress={() => {
                tapLight();
                link.onPress();
              }}
              accessibilityRole="button"
              accessibilityLabel={link.label}
            >
              <Card tone="sunken" className="flex-row items-center gap-3.5">
                <IconWell backgroundColor={wash.purple}>
                  <Ionicons name={link.icon} size={22} color={tokens.text} />
                </IconWell>
                <View className="min-w-0 flex-1">
                  <Text variant="bodyStrong">{link.label}</Text>
                  <Text variant="caption" className="text-text-secondary">
                    {link.desc}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={tokens.textTertiary} />
              </Card>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => {
            tapLight();
            confirmLogout();
          }}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Card tone="sunken" className="flex-row items-center gap-3.5">
            <IconWell backgroundColor={wash.danger}>
              <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
            </IconWell>
            <View className="min-w-0 flex-1">
              <Text variant="bodyStrong" className="text-danger">
                Log out
              </Text>
              <Text variant="caption" className="text-text-secondary">
                Sign out of this account
              </Text>
            </View>
          </Card>
        </Pressable>

        <Text variant="caption" className="mt-2 text-center text-text-tertiary">
          Adara · Version 0.1.0
        </Text>
      </ScrollView>
    </Screen>
  );
}
