import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { tapLight } from "@/lib/haptics";
import { currentUser } from "@/lib/profile";
import { useTokens } from "@/theme";

type VoiceMenuBarProps = {
  onOpenHistory: () => void;
  onOpenProfile: () => void;
};

/** ChatGPT Voice top bar — history menu on the left, profile on the right. */
export function VoiceMenuBar({ onOpenHistory, onOpenProfile }: VoiceMenuBarProps) {
  const tokens = useTokens();
  const isDark = tokens.scheme === "dark";
  const btnBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        height: 52,
      }}
    >
      <Pressable
        onPress={() => {
          tapLight();
          onOpenHistory();
        }}
        accessibilityRole="button"
        accessibilityLabel="Chat history"
        hitSlop={10}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: btnBg,
        }}
        className="active:opacity-70"
      >
        <Ionicons name="menu" size={22} color={tokens.text} />
      </Pressable>

      <Pressable
        onPress={() => {
          tapLight();
          onOpenProfile();
        }}
        accessibilityRole="button"
        accessibilityLabel="Profile"
        hitSlop={8}
        className="active:opacity-80"
      >
        <Avatar
          source={currentUser.avatar}
          initials={currentUser.initials}
          size={34}
        />
      </Pressable>
    </View>
  );
}
