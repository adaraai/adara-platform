import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components";
import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { tapMedium } from "@/lib/haptics";
import { webRootStyle } from "@/lib/webLayout";
import { useTokens } from "@/theme";

type TabIcon = keyof typeof Ionicons.glyphMap;

type TabMeta = {
  icon: TabIcon;
  activeIcon: TabIcon;
  label: string;
};

const TAB_ORDER = ["index", "chat", "history", "settings"] as const;

const tabs: Record<(typeof TAB_ORDER)[number], TabMeta> = {
  index: { icon: "home-outline", activeIcon: "home", label: "Home" },
  chat: { icon: "chatbubble-outline", activeIcon: "chatbubble", label: "Trans" },
  history: { icon: "time-outline", activeIcon: "time", label: "History" },
  settings: { icon: "person-outline", activeIcon: "person", label: "Profile" },
};

const TAB_ICON_SIZE = 22;
const SPEECH_SIZE = 56;

function TabItem({
  meta,
  focused,
  onPress,
  activeColor,
  inactiveColor,
  activeBg,
}: {
  meta: TabMeta;
  focused: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  activeBg: string;
}) {
  const color = focused ? activeColor : inactiveColor;

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
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? activeBg : "transparent",
        }}
      >
        <Ionicons name={focused ? meta.activeIcon : meta.icon} size={TAB_ICON_SIZE} color={color} />
      </View>
      <Text variant="micro" className="font-sans-medium" style={{ color }}>
        {meta.label}
      </Text>
    </Pressable>
  );
}

/** Flat, edge-to-edge bar with the Talk action inline — same layout as the reference app's tab bar. */
function TabBar({ state, navigation }: BottomTabBarProps) {
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isDark = tokens.scheme === "dark";
  const barBg = isDark ? "#141414" : "#FFFFFF";
  const barBorder = isDark ? "#2E2E2E" : "#EBEBEB";
  const activeColor = isDark ? "#FFFFFF" : "#000000";
  const inactiveColor = "#8E8E8E";
  const activeBg = isDark ? "#262626" : "#F5F5F5";
  const fabBg = isDark ? "#FFFFFF" : "#000000";
  const fabIcon = isDark ? "#000000" : "#FFFFFF";

  const openVoice = () => {
    tapMedium();
    router.push("/voice");
  };

  const renderTab = (name: (typeof TAB_ORDER)[number]) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return null;
    const meta = tabs[name];
    const index = state.routes.findIndex((r) => r.name === name);
    const focused = state.index === index;

    return (
      <TabItem
        key={route.key}
        meta={meta}
        focused={focused}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        activeBg={activeBg}
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
        backgroundColor: barBg,
        borderTopWidth: 1,
        borderTopColor: barBorder,
      }}
    >
      {TAB_ORDER.slice(0, 2).map(renderTab)}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Talk"
        onPress={openVoice}
        hitSlop={6}
        style={{ flex: 1, alignItems: "center", gap: 4, paddingVertical: 2, minWidth: 0 }}
        className="active:opacity-90"
      >
        <View
          style={{
            width: SPEECH_SIZE,
            height: SPEECH_SIZE,
            borderRadius: SPEECH_SIZE / 2,
            marginTop: -14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: fabBg,
          }}
        >
          <VoiceWaveformIcon size={24} color={fabIcon} />
        </View>
        <Text variant="micro" className="font-sans-semibold" style={{ color: inactiveColor }}>
          Talk
        </Text>
      </Pressable>

      {TAB_ORDER.slice(2).map(renderTab)}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View style={webRootStyle}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: "transparent", flex: 1 } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}
