import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { IconButton, LanguagePair, Screen, Text } from "@/components";
import { prompts } from "@/lib/content";
import { tapLight } from "@/lib/haptics";

/** Saved translation threads — opens the chat-style translator. */
export default function ChatListScreen() {
  const router = useRouter();

  return (
    <Screen edges={{ bottom: false }}>
      <View className="flex-row items-center px-gutter pb-3 pt-1">
        <View className="min-w-0 flex-1 pr-3">
          <Text variant="display">Translate</Text>
          <Text variant="caption" className="mt-1 text-text-secondary">
            Type in one language, get another back
          </Text>
        </View>
        <IconButton
          icon="add"
          tone="ghost"
          label="Start a new translation"
          onPress={() => router.push("/chat/new")}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {prompts.map((prompt, index) => (
          <View key={prompt.id}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                tapLight();
                router.push(`/chat/${prompt.id}`);
              }}
              className="active:opacity-70"
            >
              <View className="px-gutter py-4">
                <Text variant="bodyStrong" numberOfLines={1}>
                  {prompt.title}
                </Text>

                <View className="mt-2 self-start">
                  <LanguagePair
                    fromLang={prompt.fromLang}
                    toLang={prompt.toLang}
                    compact
                  />
                </View>

                <Text
                  variant="body"
                  numberOfLines={2}
                  className="mt-2 leading-snug text-text-secondary"
                >
                  {prompt.preview}
                </Text>
              </View>
            </Pressable>

            {index < prompts.length - 1 ? (
              <View className="mx-gutter h-px bg-border" />
            ) : null}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
