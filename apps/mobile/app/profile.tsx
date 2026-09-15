import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";

import { Avatar, Card, IconButton, Screen, Text } from "@/components";
import { tapLight } from "@/lib/haptics";
import { goBackOrHome } from "@/lib/navigation";
import { currentUser } from "@/lib/profile";
import { useTokens } from "@/theme";

type IonName = keyof typeof Ionicons.glyphMap;

function IconWell({
  backgroundColor,
  children,
}: {
  backgroundColor: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

type SettingsRow = {
  icon: IonName;
  title: string;
  description: string;
  onPress: () => void;
};

/** Profile — identity + settings, ChatGPT-style hierarchy. */
export default function ProfileScreen() {
  const router = useRouter();
  const tokens = useTokens();
  const isDark = tokens.scheme === "dark";

  const wash = {
    purple: isDark ? "#2A2438" : "#F3F0FA",
    danger: isDark ? "#3A1818" : "#FDECEC",
  };

  const preferences: SettingsRow[] = [
    {
      icon: "mic-outline",
      title: "Voice",
      description: "Language, locale, and microphone",
      onPress: () => router.push("/voice-settings"),
    },
    {
      icon: "shield-checkmark-outline",
      title: "Privacy",
      description: "How Adara handles your voice and chats",
      onPress: () =>
        Alert.alert(
          "Privacy",
          "Your voice stays on this session by default. We don’t use it to train models unless you opt in later.",
        ),
    },
  ];

  const confirmLogout = () => {
    const message = "You’ll need to sign in again to keep talking with Adara.";
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm(`Log out?\n\n${message}`)
      ) {
        Alert.alert("Logged out", "Sign-in will return in a later build.");
      }
      return;
    }
    Alert.alert("Log out?", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () =>
          Alert.alert("Logged out", "Sign-in will return in a later build."),
      },
    ]);
  };

  const languageLine = `Speaks ${currentUser.language}`;
  const planLine = currentUser.plan;

  return (
    <Screen edges={{ bottom: false }}>
      <View className="flex-row items-center gap-2 px-gutter pb-2 pt-3">
        <IconButton
          icon="chevron-back"
          label="Back"
          onPress={() => goBackOrHome(router)}
        />
        <Text
          variant="display"
          accessibilityRole="header"
          accessibilityLabel="Profile"
        >
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-gutter pb-10 pt-2"
      >
        {/* Identity */}
        <Card
          tone="sunken"
          className="flex-row items-center gap-4"
          accessibilityRole="text"
          accessibilityLabel={`${currentUser.fullName}. ${planLine}. ${languageLine}.`}
        >
          <Avatar
            source={currentUser.avatar}
            initials={currentUser.initials}
            size={64}
          />
          <View className="min-w-0 flex-1 gap-0.5">
            <Text variant="title" numberOfLines={1}>
              {currentUser.fullName}
            </Text>
            <Text variant="callout" numberOfLines={1}>
              {planLine}
            </Text>
            <Text variant="caption" className="text-text-tertiary" numberOfLines={1}>
              {languageLine}
            </Text>
          </View>
        </Card>

        {/* Preferences */}
        <View className="gap-2">
          <Text
            variant="label"
            className="px-1 text-text-tertiary"
            accessibilityRole="header"
          >
            Preferences
          </Text>
          {preferences.map((row) => (
            <Pressable
              key={row.title}
              onPress={() => {
                tapLight();
                row.onPress();
              }}
              accessibilityRole="button"
              accessibilityLabel={row.title}
              accessibilityHint={row.description}
            >
              <Card tone="sunken" className="flex-row items-center gap-3.5">
                <IconWell backgroundColor={wash.purple}>
                  <Ionicons name={row.icon} size={22} color={tokens.text} />
                </IconWell>
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text variant="bodyStrong">{row.title}</Text>
                  <Text variant="callout">{row.description}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={tokens.textTertiary}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                />
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Account */}
        <View className="gap-2">
          <Text
            variant="label"
            className="px-1 text-text-tertiary"
            accessibilityRole="header"
          >
            Account
          </Text>
          <Pressable
            onPress={() => {
              tapLight();
              confirmLogout();
            }}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            accessibilityHint="Signs you out of Adara on this device"
          >
            <Card tone="sunken" className="flex-row items-center gap-3.5">
              <IconWell backgroundColor={wash.danger}>
                <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
              </IconWell>
              <View className="min-w-0 flex-1 gap-0.5">
                <Text variant="bodyStrong" className="text-danger">
                  Log out
                </Text>
                <Text variant="callout">Sign out of this device</Text>
              </View>
            </Card>
          </Pressable>
        </View>

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
