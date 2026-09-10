import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import {
  Avatar,
  Button,
  Card,
  Chip,
  FeatureIcon,
  IconButton,
  IonFeatureIcon,
  LanguagePair,
  Screen,
  Text,
} from "@/components";
import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { capabilities, primaryFeature } from "@/lib/capabilities";
import { prompts, topics } from "@/lib/content";
import { currentUser } from "@/lib/profile";
import { tapLight } from "@/lib/haptics";
import { useTokens } from "@/theme";

export default function HomeScreen() {
  const tokens = useTokens();
  const router = useRouter();
  const [topicId, setTopicId] = useState(topics[0].id);

  const activeTopic = topics.find((t) => t.id === topicId) ?? topics[0];
  const visible = useMemo(
    () => prompts.filter((prompt) => prompt.topicId === topicId).slice(0, 2),
    [topicId],
  );

  return (
    <Screen edges={{ bottom: false }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-gutter pb-40 pt-2"
      >
        <View className="mb-6 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => {
              tapLight();
              router.push("/settings");
            }}
            className="min-w-0 flex-1 flex-row items-center gap-3 active:opacity-80"
          >
            <Avatar source={currentUser.avatar} initials={currentUser.initials} size={48} />
            <View className="min-w-0 flex-1">
              <Text variant="bodyStrong">Hi, {currentUser.firstName}</Text>
              <Text variant="caption" className="text-text-secondary">
                Welcome back
              </Text>
            </View>
          </Pressable>
          <IconButton
            icon="notifications-outline"
            label="Notifications"
            badge
            onPress={() => {
              tapLight();
              router.push("/notifications");
            }}
          />
        </View>

        <View className="flex-row gap-3">
          <Card tone="sunken" className="min-h-[228px] flex-1 justify-between p-4">
            <View>
              {primaryFeature.waveform ? (
                <FeatureIcon size="lg">
                  <VoiceWaveformIcon size={23} color={tokens.text} />
                </FeatureIcon>
              ) : (
                <IonFeatureIcon
                  name={primaryFeature.icon}
                  size="lg"
                  color={tokens.text}
                  glyph={23}
                />
              )}
              <Text variant="heading" className="mt-4">
                {primaryFeature.title}
              </Text>
              <Text variant="caption" className="mt-1.5 leading-snug text-text-secondary">
                {primaryFeature.subtitle}
              </Text>
            </View>
            <Button
              label={primaryFeature.cta}
              size="md"
              className="mt-5"
              fullWidth
              onPress={() => router.push(primaryFeature.href as never)}
            />
          </Card>

          <View className="min-h-[228px] flex-1 gap-3">
            {capabilities.map((capability) => (
              <Link key={capability.id} href={capability.href as never} asChild>
                <Pressable className="flex-1 active:opacity-80">
                  <Card tone="sunken" className="h-full justify-between p-3.5">
                    {capability.waveform ? (
                      <FeatureIcon>
                        <VoiceWaveformIcon size={18} color={tokens.text} />
                      </FeatureIcon>
                    ) : (
                      <IonFeatureIcon name={capability.icon} color={tokens.text} />
                    )}
                    <View className="mt-3 flex-row items-end justify-between gap-2">
                      <View className="min-w-0 flex-1">
                        <Text variant="bodyStrong">{capability.title}</Text>
                        <Text
                          variant="caption"
                          className="mt-0.5 text-text-secondary"
                          numberOfLines={1}
                        >
                          {capability.subtitle}
                        </Text>
                      </View>
                      <Ionicons name="arrow-forward" size={16} color={tokens.textTertiary} />
                    </View>
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View className="mt-section flex-row items-center justify-between">
          <Text variant="heading">Topics</Text>
          <Pressable accessibilityRole="button" className="active:opacity-60">
            <Text variant="caption" className="font-sans-medium text-text">
              See all
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-gutter mt-3"
          contentContainerClassName="gap-2 px-gutter"
        >
          {topics.map((topic) => (
            <Chip
              key={topic.id}
              label={topic.label}
              selected={topic.id === topicId}
              onPress={() => setTopicId(topic.id)}
            />
          ))}
        </ScrollView>

        <View className="mt-4 flex-row gap-3">
          {visible.map((prompt) => (
            <Card key={prompt.id} tone="sunken" className="flex-1 p-4">
              <IonFeatureIcon name={activeTopic.icon} color={tokens.text} glyph={18} />
              <View className="mt-3 self-start">
                <LanguagePair
                  fromLang={prompt.fromLang}
                  toLang={prompt.toLang}
                  compact
                />
              </View>
              <Text variant="bodyStrong" className="mt-3 leading-snug" numberOfLines={2}>
                {prompt.title}
              </Text>
              <Text variant="caption" className="mt-1.5 leading-snug text-text-secondary" numberOfLines={3}>
                {prompt.preview}
              </Text>
              <Button
                label="Translate"
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onPress={() => router.push(`/chat/${prompt.id}`)}
              />
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
