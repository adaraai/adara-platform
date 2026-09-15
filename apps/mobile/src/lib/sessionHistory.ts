/** Seed session list — wired to real history later. */
export type SessionHistoryItem = {
  id: string;
  day: string;
  title: string;
  length: string;
  seed: number;
};

export const sessionHistory: SessionHistoryItem[] = [
  { id: "s1", day: "Today", title: "Market prices in Twi", length: "01:12", seed: 2 },
  { id: "s2", day: "Today", title: "Invoice draft in Pidgin", length: "00:48", seed: 7 },
  { id: "s3", day: "Yesterday", title: "Clinic directions", length: "02:05", seed: 11 },
];
