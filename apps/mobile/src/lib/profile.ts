import type { ImageSourcePropType } from "react-native";

import { avatars } from "@/lib/avatars";

export type UserProfile = {
  id: string;
  firstName: string;
  fullName: string;
  initials: string;
  avatar: ImageSourcePropType;
  location: string;
  plan: string;
};

export const currentUser: UserProfile = {
  id: "alex",
  firstName: "Alex",
  fullName: "Alex Mensah",
  initials: "A",
  avatar: avatars.alex,
  location: "Accra",
  plan: "Early access",
};
