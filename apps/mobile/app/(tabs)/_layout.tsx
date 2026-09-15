import { Tabs, useRouter } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, Text, type IonName } from "@/components";
import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { ACCENT } from "@/lib/brand";
import { tapMedium } from "@/lib/haptics";
import { webRootStyle } from "@/lib/webLayout";
import { useTokens } from "@/theme";

type TabMeta = {
  icon: IonName;
  activeIcon: IonName;
  label: string;
};

/** Home · Talk · Profile — Talk opens voice; sized like the other tabs. */
const TAB_ORDER = ["index", "settings"] as const;

const tabs: Record<(typeof TAB_ORDER)[number], TabMeta> = {
  index: { icon: "home", activeIcon: "home", label: "Home" },
  settings: { icon: "person", activeIcon: "person", label: "Profile" },
};

const TAB_ICON_SIZE = 22;
const WELL = 40;

function TabItem({
  meta,
  focused,
  onPress,
}: {
  meta: TabMeta;
  focused: boolean;
  onPress: () => void;
}) {
  const tokens = useTokens();
  const inactive = tokens.textTertiary;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={meta.label}
      onPress={onPress}
      hitSlop={6}
      style={{ flex: 1, alignItems: "center", gap: 4, paddingVertical: 2, minWidth: 0 }}
      className="active:opacity-70"
    >
      <View
        style={{
          width: WELL,
          height: WELL,
          borderRadius: WELL / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? ACCENT : "transparent",
        }}
      >
        <Icon
          name={focused ? meta.activeIcon : meta.icon}
          size={TAB_ICON_SIZE}
          color={focused ? "#000000" : inactive}
        />
      </View>
      <Text
        variant="micro"
        className="font-sans-medium"
        style={{ color: focused ? tokens.text : inactive }}
      >
        {meta.label}
      </Text>
    </Pressable>
  );
}

function TalkTabItem({ onPress }: { onPress: () => void }) {
  const tokens = useTokens();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: true }}
      accessibilityLabel="Talk"
      accessibilityHint="Starts a voice session with Adara"
      onPress={onPress}
      hitSlop={6}
      style={{ flex: 1, alignItems: "center", gap: 4, paddingVertical: 2, minWidth: 0 }}
      className="active:opacity-70"
    >
      <View
        style={{
          width: WELL,
          height: WELL,
          borderRadius: WELL / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ACCENT,
        }}
      >
        <VoiceWaveformIcon size={TAB_ICON_SIZE} color="#000000" />
      </View>
      <Text variant="micro" className="font-sans-medium" style={{ color: tokens.text }}>
        Talk
      </Text>
    </Pressable>
  );
}

function TabBar({ state, navigation }: BottomTabBarProps) {
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const openVoice = () => {
    tapMedium();
    router.push("/voice");
  };

  const renderTab = (name: (typeof TAB_ORDER)[number]) => {
    const route = state.routes.find((r: { name: string }) => r.name === name);
    if (!route) return null;
    const meta = tabs[name];
    const index = state.routes.findIndex((r: { name: string }) => r.name === name);
    const focused = state.index === index;

    return (
      <TabItem
        key={route.key}
        meta={meta}
        focused={focused}
        onPress={() => {
          tapMedium();
          if (!focused) navigation.navigate(route.name);
        }}
      />
    );
  };

  return (
    <View
      role="navigation"
      accessibilityLabel="Main navigation"
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingHorizontal: 4,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: tokens.scheme === "dark" ? "#14121C" : "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: tokens.scheme === "dark" ? "#2A2736" : "#F0EEF6",
      }}
    >
      {renderTab("index")}
      <TalkTabItem onPress={openVoice} />
      {renderTab("settings")}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View style={webRootStyle}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "transparent", flex: 1 },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="chat" options={{ href: null }} />
        <Tabs.Screen name="history" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
