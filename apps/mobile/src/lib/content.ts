import type { Ionicons } from "@expo/vector-icons";

/**
 * Presentation copy and seed data for Adara — translation across
 * daily life, health, telecom, government, and legal situations.
 */

export type Topic = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

export const topics: Topic[] = [
  {
    id: "daily",
    label: "Daily life",
    icon: "sunny-outline",
    description: "Markets, transport, neighbours, and everyday errands.",
  },
  {
    id: "health",
    label: "Health",
    icon: "medkit-outline",
    description: "Clinics, NHIS, symptoms, and talking to care staff.",
  },
  {
    id: "telecom",
    label: "Telecom",
    icon: "cellular-outline",
    description: "Billing, outages, SIM issues, and provider support.",
  },
  {
    id: "government",
    label: "Government",
    icon: "business-outline",
    description: "Local assembly, permits, utilities, and public services.",
  },
  {
    id: "legal",
    label: "Legal",
    icon: "document-text-outline",
    description: "Contracts, disputes, police reports, and your rights.",
  },
];

export type Prompt = {
  id: string;
  topicId: string;
  /** Short label for the translation thread list. */
  title: string;
  /** Preview of what the user wanted translated. */
  preview: string;
  fromLang: string;
  toLang: string;
};

export const defaultLanguagePair = {
  fromLang: "English",
  toLang: "Twi",
} as const;

export const prompts: Prompt[] = [
  {
    id: "clinic-twi",
    topicId: "health",
    title: "Clinic symptoms",
    preview: "I have chest pain and a fever since yesterday.",
    fromLang: "English",
    toLang: "Twi",
  },
  {
    id: "nhis-twi",
    topicId: "health",
    title: "NHIS registration",
    preview: "I want to register for NHIS at this clinic.",
    fromLang: "English",
    toLang: "Twi",
  },
  {
    id: "billing-twi",
    topicId: "telecom",
    title: "MTN billing complaint",
    preview: "I was charged twice for the same data bundle.",
    fromLang: "English",
    toLang: "Twi",
  },
  {
    id: "outage-ga",
    topicId: "telecom",
    title: "Mobile money outage",
    preview: "My mobile money transfer failed but money was deducted.",
    fromLang: "English",
    toLang: "Ga",
  },
  {
    id: "assembly-twi",
    topicId: "government",
    title: "Streetlight report",
    preview: "The streetlight on our road has been broken for two weeks.",
    fromLang: "English",
    toLang: "Twi",
  },
  {
    id: "permit-hausa",
    topicId: "government",
    title: "Business permit",
    preview: "What documents do I need for a small shop permit?",
    fromLang: "English",
    toLang: "Hausa",
  },
  {
    id: "lease-twi",
    topicId: "legal",
    title: "Lease questions",
    preview: "Can the landlord increase rent before the lease ends?",
    fromLang: "English",
    toLang: "Twi",
  },
  {
    id: "market-ga",
    topicId: "daily",
    title: "Market negotiation",
    preview: "How much for three tomatoes? That is too expensive.",
    fromLang: "English",
    toLang: "Ga",
  },
  {
    id: "trotro-twi",
    topicId: "daily",
    title: "Directions to Kaneshie",
    preview: "Please take me to Kaneshie market. How much is the fare?",
    fromLang: "English",
    toLang: "Twi",
  },
];

export type ChatMessage =
  | { id: string; role: "user"; kind: "text"; text: string; lang: string }
  | {
      id: string;
      role: "assistant";
      kind: "translation";
      fromLang: string;
      toLang: string;
      source: string;
      translation: string;
    }
  | { id: string; role: "user"; kind: "voice"; duration: string; lang: string };

export const sampleThread: ChatMessage[] = [
  {
    id: "m3",
    role: "user",
    kind: "voice",
    lang: "English",
    duration: "00:08",
  },
  {
    id: "m2",
    role: "user",
    kind: "text",
    lang: "English",
    text: "Tell them I want a refund and an explanation.",
  },
  {
    id: "m4",
    role: "assistant",
    kind: "translation",
    fromLang: "English",
    toLang: "Twi",
    source: "Tell them I want a refund and an explanation.",
    translation:
      "Ka kyerɛ wɔn sɛ mepɛ sɛ wɔsan ma me me sika, na wɔnkyerɛ me adanseɛ adiysɛ dɛn nti saa.",
  },
  {
    id: "m5",
    role: "user",
    kind: "text",
    lang: "English",
    text: "Hello",
  },
];

export type ThreadMeta = {
  title: string;
  fromLang: string;
  toLang: string;
};

export function getThreadMeta(id: string | undefined): ThreadMeta {
  if (!id || id === "new") {
    return {
      title: "New translation",
      ...defaultLanguagePair,
    };
  }

  const prompt = prompts.find((entry) => entry.id === id);
  if (!prompt) {
    return {
      title: "Translation",
      ...defaultLanguagePair,
    };
  }

  return {
    title: prompt.title,
    fromLang: prompt.fromLang,
    toLang: prompt.toLang,
  };
}

/** Rotating prompts under the orb while the mic is open. */
export const voiceSuggestions = [
  "Translate what the nurse is saying in real time.",
  "Help me talk to the assembly about a water leak.",
  "Draft a legal letter about my tenancy dispute.",
];

/** Example transcription shown on the voice screen. */
export const voiceTranscript = voiceSuggestions[0];
