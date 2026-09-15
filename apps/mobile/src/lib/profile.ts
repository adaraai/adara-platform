import type { ImageSourcePropType } from "react-native";

import { brandImages } from "@/lib/brand";

export type UserProfile = {
  id: string;
  firstName: string;
  fullName: string;
  initials: string;
  avatar: ImageSourcePropType;
  location: string;
  plan: string;
  accountHint: string;
  language: string;
};

export const currentUser: UserProfile = {
  id: "pratik",
  firstName: "Pratik",
  fullName: "Pratik",
  initials: "P",
  avatar: brandImages.pratik,
  location: "Accra",
  plan: "Early access",
  accountHint: "Ac no. 8050530XXX",
  language: "Twi",
};
