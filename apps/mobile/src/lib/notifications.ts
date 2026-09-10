import type { Ionicons } from "@expo/vector-icons";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  section: "Today" | "Yesterday" | "Earlier";
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Translation ready",
    body: "Your clinic visit notes were translated into Twi.",
    time: "2m ago",
    section: "Today",
    read: false,
    icon: "language-outline",
  },
  {
    id: "n2",
    title: "MTN complaint draft",
    body: "ADARA saved a follow-up message for your billing issue.",
    time: "1h ago",
    section: "Today",
    read: false,
    icon: "chatbubble-ellipses-outline",
  },
  {
    id: "n3",
    title: "Voice session complete",
    body: "Market price negotiation — 01:12 recorded and transcribed.",
    time: "4h ago",
    section: "Today",
    read: true,
    icon: "mic-outline",
  },
  {
    id: "n4",
    title: "New language coverage",
    body: "Ga is now available for live translation in voice mode.",
    time: "Yesterday",
    section: "Yesterday",
    read: true,
    icon: "globe-outline",
  },
  {
    id: "n5",
    title: "NHIS guide updated",
    body: "Registration steps for 2026 were refreshed in Health topics.",
    time: "Yesterday",
    section: "Yesterday",
    read: true,
    icon: "medkit-outline",
  },
  {
    id: "n6",
    title: "Welcome to ADARA",
    body: "Start with voice or text — ADARA translates as you go.",
    time: "3 days ago",
    section: "Earlier",
    read: true,
    icon: "chatbubble-ellipses-outline",
  },
];

export function groupNotifications(items: NotificationItem[]) {
  const order: NotificationItem["section"][] = ["Today", "Yesterday", "Earlier"];

  return order
    .map((section) => ({
      section,
      items: items.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length > 0);
}
