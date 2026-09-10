import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components";
import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { tapMedium } from "@/lib/haptics";
import { webRootStyle } from "@/lib/webLayout";
import { elevation, useTokens } from "@/theme";

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

const BAR_HEIGHT = 72;
const FAB_SIZE = 56;
const FAB_LIFT = 22;
const TAB_ICON_SIZE = 26;

function TabItem({
  meta,
  focused,
  onPress,
  activeColor,
  inactiveColor,
}: {
  meta: TabMeta;
  focused: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
}) {
  const color = focused ? activeColor : inactiveColor;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={meta.label}
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", height: "100%" }}
      className="active:opacity-70"
    >
      <Ionicons name={focused ? meta.activeIcon : meta.icon} size={TAB_ICON_SIZE} color={color} />
      <Text variant="micro" className="mt-0.5 font-sans-medium" style={{ color }}>
        {meta.label}
      </Text>
    </Pressable>
  );
}

function TabBar({ state, navigation }: BottomTabBarProps) {
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isDark = tokens.scheme === "dark";
  const barBg = isDark ? "#141414" : "#FFFFFF";
  const barBorder = isDark ? "#2E2E2E" : "#EBEBEB";
  const activeColor = isDark ? "#FFFFFF" : "#000000";
  const inactiveColor = isDark ? "#8E8E8E" : "#8E8E8E";
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
        onPress={() => {
          tapMedium();
          if (!focused) navigation.navigate(route.name);
        }}
      />
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Platform.OS === "web" ? 10 : Math.max(insets.bottom, 10),
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <View
        style={[
          {
            width: "100%",
            maxWidth: 480,
            height: BAR_HEIGHT,
            borderRadius: BAR_HEIGHT / 2,
            backgroundColor: barBg,
            borderWidth: 1,
            borderColor: barBorder,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 6,
          },
          elevation("md", tokens.shadowColor),
        ]}
      >
        {TAB_ORDER.slice(0, 2).map(renderTab)}
        <View style={{ width: FAB_SIZE + 8 }} />
        {TAB_ORDER.slice(2).map(renderTab)}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voice"
        onPress={openVoice}
        style={[
          {
            position: "absolute",
            top: -FAB_LIFT,
            alignSelf: "center",
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: fabBg,
          },
          elevation("float", tokens.shadowColor),
        ]}
        className="active:opacity-90"
      >
        <VoiceWaveformIcon size={26} color={fabIcon} />
      </Pressable>
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
