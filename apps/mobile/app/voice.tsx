import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Screen, Text, VoiceWave } from "@/components";
import { tapLight, tapMedium } from "@/lib/haptics";
import { goBackOrHome } from "@/lib/navigation";
import { useTokens } from "@/theme";

const FIRST_WORD_DELAY_MS = 800;
const WORD_STEP_MS = 220;
const MUTE_POLL_MS = 150;

/** Demo transcript for the Talk listening shell (Twi + English). */
const TRANSCRIPT =
  "Me pɛ sɛ me talk to Adara about market prices in Accra today";

export default function VoiceScreen() {
  const router = useRouter();
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const words = useMemo(() => TRANSCRIPT.split(" "), []);
  const [revealedCount, setRevealedCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const transcriptSoFar = words.slice(0, revealedCount).join(" ");
  const done = revealedCount >= words.length && words.length > 0;

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    setRevealedCount(0);

    const revealNext = (i: number) => {
      if (cancelled) return;
      if (mutedRef.current) {
        timeoutId = setTimeout(() => revealNext(i), MUTE_POLL_MS);
        return;
      }
      setRevealedCount(i);
      if (i < words.length) {
        timeoutId = setTimeout(() => revealNext(i + 1), WORD_STEP_MS);
      }
    };

    timeoutId = setTimeout(() => revealNext(1), FIRST_WORD_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [words]);

  const close = () => {
    tapLight();
    goBackOrHome(router);
  };

  const finish = () => {
    tapMedium();
    goBackOrHome(router);
  };

  const cardBg = tokens.scheme === "dark" ? "#1C1928" : "#F6F5FB";

  return (
    <Screen edges={{ top: true, bottom: true }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          minHeight: 52,
        }}
      >
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
          className="active:opacity-70"
        >
          <Ionicons name="chevron-back" size={26} color={tokens.text} />
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => {
              tapLight();
              setMuted((m) => !m);
            }}
            accessibilityRole="button"
            accessibilityLabel={muted ? "Unmute microphone" : "Mute microphone"}
            hitSlop={8}
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
            className="active:opacity-70"
          >
            <Ionicons name={muted ? "mic-off" : "mic"} size={22} color={tokens.text} />
          </Pressable>
          <Pressable
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Close listening"
            hitSlop={8}
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
            className="active:opacity-70"
          >
            <Ionicons name="close" size={24} color={tokens.text} />
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            gap: 28,
          }}
        >
          <View style={{ width: "100%", alignItems: "center", opacity: muted ? 0.35 : 1 }}>
            <VoiceWave />
          </View>
          <Text variant="title" className="text-center font-sans-semibold text-text-secondary">
            {muted ? "Muted" : done ? "Got it" : "Listening..."}
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: cardBg,
            borderRadius: 24,
            paddingVertical: 20,
            paddingHorizontal: 20,
            minHeight: 72,
            justifyContent: "center",
          }}
        >
          <Text variant="body" style={{ color: tokens.text }}>
            {transcriptSoFar || " "}
            {!done ? "…" : ""}
          </Text>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 8,
        }}
      >
        <Button
          label="I'm done speaking"
          size="lg"
          fullWidth
          disabled={revealedCount === 0}
          leading={<Ionicons name="checkmark" size={20} color="#000000" />}
          onPress={finish}
        />
      </View>
    </Screen>
  );
}
