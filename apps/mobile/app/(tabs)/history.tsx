import { ScrollView, View } from "react-native";

import { Card, Screen, Text, Waveform } from "@/components";
import { useTokens } from "@/theme";

/** Voice sessions grouped by day. Durations are seed data for now. */
const sessions = [
  { id: "s1", day: "Today", title: "Market prices in Twi", length: "01:12", seed: 2 },
  { id: "s2", day: "Today", title: "Invoice draft in Pidgin", length: "00:48", seed: 7 },
  { id: "s3", day: "Yesterday", title: "Clinic directions", length: "02:05", seed: 11 },
];

export default function HistoryScreen() {
  const tokens = useTokens();

  return (
    <Screen edges={{ bottom: false }}>
      <View className="px-gutter pb-2">
        <Text variant="display">Sessions</Text>
        <Text variant="caption" className="mt-1">
          Everything you have asked Adara
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-gutter pb-40 pt-2"
      >
        {sessions.map((session, index) => (
          <View key={session.id} className="gap-3">
            {sessions[index - 1]?.day !== session.day ? (
              <Text variant="micro" className="mt-3">
                {session.day}
              </Text>
            ) : null}
            <Card>
              <View className="flex-row items-center justify-between">
                <Text variant="bodyStrong" className="flex-1 pr-3" numberOfLines={1}>
                  {session.title}
                </Text>
                <Text variant="caption">{session.length}</Text>
              </View>
              <Waveform
                className="mt-3"
                height={28}
                seed={session.seed}
                progress={1}
                color={tokens.primary}
                trackColor={tokens.textTertiary}
              />
            </Card>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
