import type { Ionicons } from "@expo/vector-icons";

export type Capability = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Use the ChatGPT-style waveform SVG instead of an Ionicon. */
  waveform?: boolean;
  href: string;
};

/** Primary feature card on Home. */
export type PrimaryFeature = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  waveform?: boolean;
  cta: string;
  href: string;
};

/** Quick actions beside the main voice card on Home. */
export const capabilities: Capability[] = [
  {
    id: "voice",
    title: "Voice",
    subtitle: "Live translation",
    icon: "mic-outline",
    waveform: true,
    href: "/",
  },
  {
    id: "text",
    title: "Text",
    subtitle: "Type to translate",
    icon: "chatbubble-ellipses-outline",
    href: "/chat/new",
  },
];

/** Primary feature card on Home. */
export const primaryFeature: PrimaryFeature = {
  title: "Talk with translation",
  subtitle: "Health, telecom, legal & government — in your language",
  icon: "mic-outline",
  waveform: true,
  cta: "Start talking",
  href: "/",
};
