import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Haptics are best-effort: unsupported hardware and web both reject, and a
 * failed buzz should never surface as an error to the user.
 */
const safe = (run: () => Promise<void>) => {
  if (Platform.OS === "web") return;
  void run().catch(() => {});
};

export const tapLight = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

export const tapMedium = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

export const notifySuccess = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
