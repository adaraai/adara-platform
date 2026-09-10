import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  View,
  type TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ChatBubble,
  ChatComposer,
  IconButton,
  LanguagePairPicker,
  Screen,
  Text,
  TranslationBlock,
  VoiceNote,
} from "@/components";
import { useChatScroll } from "@/hooks/useChatScroll";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { api, type Language } from "@/lib/api";
import {
  getThreadMeta,
  sampleThread,
  type ChatMessage,
} from "@/lib/content";
import { tapLight } from "@/lib/haptics";
import { fallbackLanguages } from "@/lib/languages";

const MESSAGE_GAP = 24;

function MessageSeparator() {
  return <View style={{ height: MESSAGE_GAP }} />;
}

function Turn({ message }: { message: ChatMessage }) {
  if (message.kind === "voice") {
    return (
      <View className="w-full items-end">
        <View className="w-full max-w-[88%]">
          <VoiceNote duration={message.duration} lang={message.lang} />
        </View>
      </View>
    );
  }

  if (message.kind === "translation") {
    return (
      <TranslationBlock
        fromLang={message.fromLang}
        toLang={message.toLang}
        source={message.source}
        translation={message.translation}
      />
    );
  }

  return (
    <ChatBubble role={message.role} lang={message.lang}>
      <Text variant="body">{message.text}</Text>
    </ChatBubble>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useMemo(() => getThreadMeta(id), [id]);
  const keyboardHeight = useKeyboardHeight();

  const [fromLang, setFromLang] = useState(thread.fromLang);
  const [toLang, setToLang] = useState(thread.toLang);
  const [languages, setLanguages] = useState<Language[]>(fallbackLanguages);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    id === "new" ? [] : sampleThread,
  );

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const inputRef = useRef<TextInput>(null);
  const {
    onScroll,
    scrollToBottomIfPinned,
    scrollToBottomAndPin,
  } = useChatScroll(listRef);

  const keyboardOpen = keyboardHeight > 0;

  useEffect(() => {
    setFromLang(thread.fromLang);
    setToLang(thread.toLang);
  }, [thread.fromLang, thread.toLang]);

  useEffect(() => {
    let active = true;
    void api.languages().then((result) => {
      if (!active || !result.ok || result.data.data.length === 0) return;
      setLanguages(result.data.data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottomAndPin(false);
  }, [scrollToBottomAndPin]);

  useEffect(() => {
    if (!keyboardOpen) return;
    scrollToBottomIfPinned(true);
  }, [keyboardOpen, keyboardHeight, scrollToBottomIfPinned]);

  useEffect(() => {
    if (!draft) return;
    scrollToBottomIfPinned(false);
  }, [draft, scrollToBottomIfPinned]);

  useEffect(() => {
    scrollToBottomIfPinned(true);
  }, [messages.length, scrollToBottomIfPinned]);

  const handleDraftChange = useCallback(
    (text: string) => {
      setDraft(text);
      scrollToBottomIfPinned(false);
    },
    [scrollToBottomIfPinned],
  );

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    tapLight();
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        role: "user",
        kind: "text",
        lang: fromLang,
        text,
      },
    ]);
    setDraft("");
    scrollToBottomAndPin(true);
  };

  const composerPlaceholder = `Type in ${fromLang}…`;
  const composerBottomInset = keyboardOpen ? 8 : Math.max(insets.bottom, 12);
  /** Android resizes the window; iOS + web lift the composer manually. */
  const composerBottom = Platform.OS === "android" ? 0 : keyboardHeight;

  return (
    <Screen edges={{ bottom: false }}>
      <View className="min-h-0 flex-1">
        <View className="flex-row items-center px-gutter pb-2 pt-1">
          <View className="w-11 shrink-0">
            <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
          </View>

          <View className="min-w-0 flex-1 items-center px-2">
            <LanguagePairPicker
              minimized
              fromLang={fromLang}
              toLang={toLang}
              languages={languages}
              onChangeFrom={setFromLang}
              onChangeTo={setToLang}
            />
          </View>

          <View className="w-11 shrink-0 items-end">
            <IconButton
              icon="ellipsis-horizontal"
              tone="ghost"
              label="Translation options"
            />
          </View>
        </View>

        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Turn message={item} />}
          ItemSeparatorComponent={MessageSeparator}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={() => scrollToBottomIfPinned(false)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 8,
            flexGrow: 1,
            justifyContent: messages.length === 0 ? "center" : "flex-end",
          }}
          ListEmptyComponent={
            <View className="py-16">
              <Text variant="bodyStrong" className="text-center">
                Translate between languages
              </Text>
              <Text
                variant="body"
                className="mt-2 text-center leading-relaxed text-text-secondary"
              >
                Type or paste text in {fromLang}. ADARA will translate it to {toLang}.
              </Text>
            </View>
          }
        />

        <View style={{ paddingBottom: composerBottom }}>
          <ChatComposer
            inputRef={inputRef}
            value={draft}
            onChangeText={handleDraftChange}
            onSend={send}
            placeholder={composerPlaceholder}
            bottomInset={composerBottomInset}
            onFocus={() => {
              scrollToBottomAndPin(true);
              if (Platform.OS === "web") {
                requestAnimationFrame(() => scrollToBottomAndPin(false));
                setTimeout(() => scrollToBottomAndPin(false), 120);
              }
            }}
            onContentSizeChange={() => scrollToBottomIfPinned(false)}
          />
        </View>
      </View>
    </Screen>
  );
}
