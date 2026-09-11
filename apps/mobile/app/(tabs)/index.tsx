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
  Orb,
  PromoBannerCarousel,
  Screen,
  Text,
  type PromoBanner,
} from "@/components";
import { VoiceWaveformIcon } from "@/components/icons/VoiceWaveformIcon";
import { capabilities, primaryFeature } from "@/lib/capabilities";
import { prompts, topics } from "@/lib/content";
import { currentUser } from "@/lib/profile";
import { tapLight } from "@/lib/haptics";
import { useTokens } from "@/theme";

/** Most recent threads — quick re-entry row under the hero, aya-style. */
const RECENT = prompts.slice(0, 6);

export default function HomeScreen() {
  const tokens = useTokens();
  const router = useRouter();
  const [topicId, setTopicId] = useState(topics[0].id);

  const activeTopic = topics.find((t) => t.id === topicId) ?? topics[0];
  const visible = useMemo(
    () => prompts.filter((prompt) => prompt.topicId === topicId).slice(0, 2),
    [topicId],
  );

  const banners: PromoBanner[] = useMemo(
    () => [
      {
        illustration: "voice",
        title: "Speak — we'll translate instantly",
        accessibilityLabel: "Speak, we will translate instantly",
        onPress: () => router.push("/voice"),
      },
      {
        illustration: "history",
        title: "Every session saved to History",
        accessibilityLabel: "Open your translation history",
        onPress: () => router.push("/history"),
      },
      {
        illustration: "shield",
        title: "Your words stay yours",
        accessibilityLabel: "Your words stay yours — private by default",
      },
      {
        illustration: "globe",
        title: "Health, legal & government — covered",
        accessibilityLabel: "Health, legal and government translations are covered",
      },
    ],
    [router],
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

        <View className="items-center py-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={primaryFeature.cta}
            onPress={() => router.push(primaryFeature.href as never)}
            className="active:opacity-85"
          >
            <Orb size={168} />
          </Pressable>
          <Button
            label={primaryFeature.cta}
            size="lg"
            className="mt-1 px-10"
            onPress={() => router.push(primaryFeature.href as never)}
          />
        </View>

        <View className="mt-6 flex-row gap-3">
          {capabilities.map((capability) => (
            <Link key={capability.id} href={capability.href as never} asChild>
              <Pressable className="flex-1 flex-row items-center gap-3 rounded-full border border-border bg-surface-sunken px-4 py-3 active:opacity-80">
                {capability.waveform ? (
                  <FeatureIcon>
                    <VoiceWaveformIcon size={16} color={tokens.text} />
                  </FeatureIcon>
                ) : (
                  <IonFeatureIcon name={capability.icon} color={tokens.text} glyph={18} />
                )}
                <View className="min-w-0 flex-1">
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {capability.title}
                  </Text>
                  <Text
                    variant="caption"
                    className="text-text-secondary"
                    numberOfLines={1}
                  >
                    {capability.subtitle}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text variant="heading" className="mt-section">
          Continue translating
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-gutter mt-3"
          contentContainerClassName="gap-4 px-gutter"
          role="list"
          accessibilityLabel="Recent translations"
        >
          {RECENT.map((prompt) => {
            const topic = topics.find((t) => t.id === prompt.topicId);

            return (
              <View key={prompt.id} role="listitem" style={{ width: 72 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={prompt.title}
                  onPress={() => {
                    tapLight();
                    router.push(`/chat/${prompt.id}`);
                  }}
                  className="items-center active:opacity-75"
                >
                  <FeatureIcon size="lg">
                    <Ionicons
                      name={topic?.icon ?? "chatbubble-ellipses-outline"}
                      size={22}
                      color={tokens.text}
                    />
                  </FeatureIcon>
                  <Text
                    variant="caption"
                    numberOfLines={1}
                    className="mt-2 text-center"
                  >
                    {prompt.title}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        <View className="mt-section">
          <PromoBannerCarousel banners={banners} />
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
