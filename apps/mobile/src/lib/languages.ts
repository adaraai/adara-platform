import type { Language } from "@/lib/api";

/** Offline catalog — used when the API is unreachable. */
export const fallbackLanguages: Language[] = [
  { code: "en", name: "English", status: "production" },
  { code: "tw", name: "Twi", status: "beta" },
  { code: "ak", name: "Akan", status: "beta" },
  { code: "ga", name: "Ga", status: "beta" },
  { code: "ee", name: "Ewe", status: "beta" },
  { code: "ha", name: "Hausa", status: "experimental" },
  { code: "dag", name: "Dagbani", status: "experimental" },
  { code: "fr", name: "French", status: "planned" },
];

export function isLanguageSelectable(language: Language) {
  return language.status !== "planned";
}

export function languageLabel(name: string) {
  return name.length > 12 ? `${name.slice(0, 11)}…` : name;
}
