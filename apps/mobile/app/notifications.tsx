import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Card, IconButton, Screen, Text } from "@/components";
import {
  groupNotifications,
  notifications as seedNotifications,
  type NotificationItem,
} from "@/lib/notifications";
import { tapLight } from "@/lib/haptics";
import { useTokens } from "@/theme";

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: () => void;
}) {
  const tokens = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint={item.body}
      onPress={onPress}
      className="active:opacity-75"
    >
      <View className="flex-row items-start gap-3 py-3">
        <View className="h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken">
          <Ionicons name={item.icon} size={20} color={tokens.text} />
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <View className="flex-row items-start justify-between gap-2">
            <Text variant="bodyStrong" className="min-w-0 flex-1">
              {item.title}
            </Text>
            {!item.read ? (
              <View className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-text" />
            ) : null}
          </View>
          <Text variant="callout">{item.body}</Text>
          <Text variant="caption" className="mt-1 text-text-tertiary">
            {item.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState(seedNotifications);

  const groups = useMemo(() => groupNotifications(items), [items]);
  const unreadCount = items.filter((item) => !item.read).length;

  const markRead = (id: string) => {
    tapLight();
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllRead = () => {
    tapLight();
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <Screen edges={{ bottom: false }}>
      <View className="flex-row items-center gap-2 px-gutter pb-2 pt-3">
        <IconButton
          icon="chevron-back"
          label="Back"
          onPress={() => router.back()}
        />
        <Text
          variant="display"
          className="min-w-0 flex-1"
          accessibilityRole="header"
        >
          Notifications
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mark all as read"
          onPress={markAllRead}
          disabled={unreadCount === 0}
          className="active:opacity-60 disabled:opacity-30"
        >
          <Text variant="label">Read all</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-gutter pb-10 pt-2"
      >
        {unreadCount > 0 ? (
          <Card tone="sunken" className="py-3">
            <Text variant="callout">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </Text>
          </Card>
        ) : null}

        {groups.map((group) => (
          <View key={group.section} className="gap-2">
            <Text
              variant="label"
              className="px-1 text-text-tertiary"
              accessibilityRole="header"
            >
              {group.section}
            </Text>
            <Card tone="sunken" className="px-4 py-1">
              {group.items.map((item, index) => (
                <View key={item.id}>
                  <NotificationRow
                    item={item}
                    onPress={() => markRead(item.id)}
                  />
                  {index < group.items.length - 1 ? (
                    <View className="h-px bg-border" />
                  ) : null}
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
