import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { Avatar, IconButton, IconWell, Screen, Text } from "@/components";
import { QuickAccessIcon, type QuickAccessIconName } from "@/components/QuickAccessIcon";
import { ACCENT, brandImages } from "@/lib/brand";
import { tapLight, tapMedium } from "@/lib/haptics";
import { currentUser } from "@/lib/profile";
import { useTokens } from "@/theme";

const DECORATIVE = {
  accessible: false as const,
  accessibilityElementsHidden: true,
  importantForAccessibility: "no-hide-descendants" as const,
};

const ART_SIZE = 148;
const MIC = 92;
const BANNER_WIDTH = 280;
const BANNER_HEIGHT = 112;
const BANNER_GAP = 12;

type BannerIllustration = "voice" | "gift" | "shield" | "trophy";

const RECIPIENTS = [
  { name: "Sonya", image: brandImages.sonya },
  { name: "Mansi", image: brandImages.mansi },
  { name: "Palak", image: brandImages.palak },
  { name: "Sourabh", image: brandImages.sourabh },
];

const QUICK_TALK = [
  { name: "Sonya", image: brandImages.sonya },
  { name: "Mansi", image: brandImages.mansi },
  { name: "Palak", image: brandImages.palak },
  { name: "Sandeepa", image: brandImages.sandeepa },
  { name: "Sourabh", image: brandImages.sourabh },
  { name: "Aisha", image: brandImages.aisha },
];

const QUICK_ACCESS: {
  label: string;
  icon: QuickAccessIconName;
  wash: string;
  available: boolean;
}[] = [
  { label: "Speak", icon: "speak", wash: "#FFF6D9", available: true },
  { label: "Translate", icon: "translate", wash: "#E8F1FF", available: true },
  { label: "Understand", icon: "understand", wash: "#EAF7EC", available: true },
  { label: "Languages", icon: "languages", wash: "#FFF6D9", available: false },
];

function VoiceIllustration() {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 148 148">
      <Circle cx={104} cy={40} r={54} fill="rgba(255,255,255,0.22)" />
      <Circle cx={40} cy={108} r={30} fill="rgba(255,255,255,0.18)" />
      <Circle cx={112} cy={118} r={9} fill="rgba(255,255,255,0.5)" />
      <Circle cx={30} cy={40} r={5} fill="rgba(255,255,255,0.6)" />
      <Circle cx={98} cy={98} r={44} fill="#FFFFFF" opacity={0.92} />
      <Rect x={68} y={78} width={9} height={18} rx={4.5} fill={ACCENT} />
      <Rect x={83} y={62} width={9} height={50} rx={4.5} fill={ACCENT} />
      <Rect x={98} y={70} width={9} height={34} rx={4.5} fill={ACCENT} />
      <Rect x={113} y={82} width={9} height={10} rx={4.5} fill={ACCENT} />
    </Svg>
  );
}

function GiftIllustration() {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 148 148">
      <Circle cx={100} cy={38} r={50} fill="rgba(255,255,255,0.2)" />
      <Circle cx={36} cy={112} r={24} fill="rgba(255,255,255,0.18)" />
      <Circle cx={124} cy={110} r={6} fill="rgba(255,255,255,0.55)" />
      <Circle cx={26} cy={44} r={4} fill="rgba(255,255,255,0.6)" />
      <Rect x={54} y={78} width={64} height={48} rx={8} fill="#FFFFFF" opacity={0.92} />
      <Rect x={54} y={64} width={64} height={20} rx={8} fill={ACCENT} />
      <Rect x={82} y={60} width={12} height={70} fill="rgba(255,255,255,0.6)" />
      <Path d="M82 64c-9-4-15-19-5-22 9-2 12 13 5 22z" fill={ACCENT} />
      <Path d="M94 64c9-4 15-19 5-22-9-2-12 13-5 22z" fill={ACCENT} />
    </Svg>
  );
}

function ShieldIllustration() {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 148 148">
      <Circle cx={102} cy={40} r={52} fill="rgba(255,255,255,0.2)" />
      <Circle cx={34} cy={110} r={26} fill="rgba(255,255,255,0.18)" />
      <Circle cx={30} cy={40} r={5} fill="rgba(255,255,255,0.6)" />
      <Circle cx={122} cy={104} r={7} fill="rgba(255,255,255,0.5)" />
      <Path
        d="M84 46 L118 60 V88 C118 112 102 128 84 135 C66 128 50 112 50 88 V60 Z"
        fill="#FFFFFF"
        opacity={0.92}
      />
      <Path
        d="M84 58 L108 68 V88 C108 105 96 116 84 122 C72 116 60 105 60 88 V68 Z"
        fill={ACCENT}
      />
      <Path
        d="M74 89l7 7 15-16"
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function TrophyIllustration() {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 148 148">
      <Circle cx={102} cy={40} r={52} fill="rgba(255,255,255,0.2)" />
      <Circle cx={34} cy={110} r={26} fill="rgba(255,255,255,0.18)" />
      <Circle cx={30} cy={40} r={5} fill="rgba(255,255,255,0.6)" />
      <Circle cx={122} cy={104} r={7} fill="rgba(255,255,255,0.5)" />
      <Rect x={66} y={112} width={36} height={10} rx={3} fill="#FFFFFF" opacity={0.92} />
      <Rect x={76} y={98} width={16} height={18} fill="#FFFFFF" opacity={0.92} />
      <Path d="M58 52h48v20c0 15-11 27-24 27s-24-12-24-27z" fill="#FFFFFF" opacity={0.92} />
      <Path
        d="M58 56c-10 0-16 6-16 14s7 13 15 13"
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.92}
      />
      <Path
        d="M106 56c10 0 16 6 16 14s-7 13-15 13"
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.92}
      />
      <Path
        d="M82 66l3.6 7.4 8.2 1.2-5.9 5.7 1.4 8.1L82 84.5l-7.3 3.9 1.4-8.1-5.9-5.7 8.2-1.2z"
        fill={ACCENT}
      />
    </Svg>
  );
}

function BannerArt({ kind }: { kind: BannerIllustration }) {
  if (kind === "voice") return <VoiceIllustration />;
  if (kind === "gift") return <GiftIllustration />;
  if (kind === "trophy") return <TrophyIllustration />;
  return <ShieldIllustration />;
}

const MIC_WAVE_BARS = [
  { h: 16, delay: 0, color: "#B57CFF" },
  { h: 32, delay: 90, color: "#9B5CFF" },
  { h: 48, delay: 40, color: "#7B4DFF" },
  { h: 28, delay: 130, color: "#E14BFF" },
  { h: 16, delay: 60, color: "#C45CFF" },
];

function MicWaveBar({ height, delay, color }: { height: number; delay: number; color: string }) {
  const scale = useSharedValue(0.45);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 340, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.45, { duration: 340, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: scale.value }] }));

  return <Animated.View style={[micWaveStyles.bar, { height, backgroundColor: color }, style]} />;
}

function MicWave() {
  return (
    <View style={micWaveStyles.row} {...DECORATIVE}>
      {MIC_WAVE_BARS.map((bar, i) => (
        <MicWaveBar key={i} height={bar.h} delay={bar.delay} color={bar.color} />
      ))}
    </View>
  );
}

const micWaveStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 50,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
});

export default function HomeScreen() {
  const tokens = useTokens();
  const router = useRouter();
  const [selectedTalk, setSelectedTalk] = useState("Mansi");
  const isDark = tokens.scheme === "dark";

  const openTalk = () => {
    tapMedium();
    router.push("/voice");
  };

  const washes = {
    purple: isDark ? "#3A3218" : "#FFF6D9",
    blue: isDark ? "#182338" : "#E8F1FF",
    yellow: isDark ? "#3A3218" : "#FFF6D9",
    green: isDark ? "#16301C" : "#EAF7EC",
  };

  const banners: {
    illustration: BannerIllustration;
    title: string;
    bg: string;
    onPress?: () => void;
  }[] = [
    {
      illustration: "voice",
      title: "Talk. Adara listens in your language",
      bg: washes.purple,
      onPress: openTalk,
    },
    {
      illustration: "gift",
      title: "Invite a friend to try Adara",
      bg: washes.blue,
    },
    {
      illustration: "trophy",
      title: "Practice streak. Keep going",
      bg: washes.yellow,
    },
    {
      illustration: "shield",
      title: "Your words stay yours",
      bg: washes.green,
    },
  ];

  return (
    <Screen edges={{ bottom: false }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        accessibilityLabel="Home"
      >
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Pressable
              onPress={() => {
                tapLight();
                router.push("/settings");
              }}
              accessibilityRole="button"
              accessibilityLabel="Open your profile"
              hitSlop={8}
              style={styles.profileAvatarHit}
            >
              <Avatar source={currentUser.avatar} initials={currentUser.initials} size={42} />
            </Pressable>
            <Text variant="heading" className="min-w-0 flex-1" numberOfLines={1}>
              Hello,{" "}
              <RNText style={{ fontWeight: "800" }}>{currentUser.firstName}!</RNText>
            </Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {
                tapLight();
                Alert.alert("Notifications", "You're all caught up — no new alerts.");
              }}
            />
          </View>
        </View>

        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Adara voice ready"
          style={styles.balanceBlock}
        >
          <Text variant="caption" className="mb-1.5 text-center text-text">
            Ready when you are
          </Text>
          <Text variant="hero" className="text-center font-display-bold" numberOfLines={1}>
            Talk to Adara
          </Text>
        </View>

        <View style={styles.stage}>
          <Image
            source={brandImages.cardStack}
            style={styles.cardStack}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            {...DECORATIVE}
          />
          <View
            collapsable={false}
            style={[
              styles.micWrap,
              // Same frosted disc as Aya in both themes — light gray reads on
              // white canvas and over the card stack; theme-tinted glass does not.
              { backgroundColor: "rgba(228,228,235,0.92)" },
            ]}
          >
            <Pressable
              onPress={openTalk}
              accessibilityRole="button"
              accessibilityLabel="Talk to Adara"
              accessibilityHint="Starts a voice session"
              style={({ pressed }) => [styles.micHit, pressed && styles.micPressed]}
            >
              <MicWave />
            </Pressable>
          </View>
        </View>

        <Text variant="heading" className="mb-2">
          Recent
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
          accessibilityLabel="Recent people"
        >
          {RECIPIENTS.map((person) => (
            <Pressable
              key={person.name}
              onPress={openTalk}
              accessibilityRole="button"
              accessibilityLabel={`Talk about ${person.name}`}
              style={styles.recipientHit}
            >
              <Avatar source={person.image} initials={person.name[0]} size={58} />
            </Pressable>
          ))}
          <Pressable
            onPress={openTalk}
            accessibilityRole="button"
            accessibilityLabel="More people"
            style={styles.moreCircle}
          >
            <Text variant="caption" className="font-sans-semibold text-white">
              5+
            </Text>
          </Pressable>
        </ScrollView>

        <Text variant="heading" className="mb-1">
          Quick access
        </Text>
        <Text variant="caption" className="mb-3 text-text-secondary">
          Shortcuts to Adara. Swipe for more.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAccessRow}
        >
          {QUICK_ACCESS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                if (item.available) {
                  openTalk();
                  return;
                }
                Alert.alert(item.label, "Coming soon in Adara.");
              }}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={styles.quickAccessItem}
              className="active:opacity-85"
            >
              <IconWell
                backgroundColor={isDark ? "#3A3218" : item.wash}
                size={48}
                radius={16}
              >
                <QuickAccessIcon
                  name={item.icon}
                  size={24}
                  color={isDark ? "#FFFFFF" : "#111111"}
                />
              </IconWell>
              <Text variant="caption" className="text-center text-text" numberOfLines={2}>
                {item.label}
              </Text>
              {!item.available ? (
                <Text variant="micro" className="text-center text-text-tertiary">
                  Soon
                </Text>
              ) : null}
            </Pressable>
          ))}
        </ScrollView>

        <Text variant="heading" className="mb-3 text-text-secondary">
          Last session
        </Text>
        <Pressable
          onPress={openTalk}
          accessibilityRole="button"
          accessibilityLabel="Last session, Twi greetings, yesterday"
          style={styles.actionRow}
          className="active:opacity-80"
        >
          <View style={styles.sessionMark}>
            <QuickAccessIcon name="speak" size={20} color="#FFFFFF" />
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="bodyStrong">Twi greetings</Text>
            <Text variant="caption" className="text-text-secondary">
              Yesterday
            </Text>
          </View>
          <Text variant="bodyStrong">2m 14s</Text>
        </Pressable>

        <Text variant="heading" className="mb-2">
          Highlights
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={BANNER_WIDTH + BANNER_GAP}
          snapToAlignment="start"
          contentContainerStyle={styles.bannerRow}
        >
          {banners.map((banner, i) => (
            <Pressable
              key={i}
              onPress={banner.onPress}
              disabled={!banner.onPress}
              accessibilityRole={banner.onPress ? "button" : "text"}
              accessibilityLabel={banner.title}
              style={[styles.bannerCard, { backgroundColor: banner.bg }]}
            >
              <View style={styles.bannerText} {...DECORATIVE}>
                <Text variant="bodyStrong" style={{ color: tokens.text }}>
                  {banner.title}
                </Text>
              </View>
              <View style={styles.bannerArt} {...DECORATIVE}>
                <BannerArt kind={banner.illustration} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.quickHead}>
          <Text variant="heading">Quick talk </Text>
          <Text variant="heading">{QUICK_TALK.length}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
        >
          {QUICK_TALK.map((person) => {
            const selected = person.name === selectedTalk;
            return (
              <Pressable
                key={person.name}
                onPress={() => {
                  setSelectedTalk(person.name);
                  openTalk();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Quick talk with ${person.name}`}
                accessibilityState={{ selected }}
                style={styles.quickItem}
              >
                <Avatar source={person.image} initials={person.name[0]} size={58} />
                <Text variant="caption" className="text-center text-text" numberOfLines={1}>
                  {person.name}
                </Text>
                <View style={[styles.caret, !selected && styles.caretHidden]} />
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  profileRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 12,
    minWidth: 0,
  },
  profileAvatarHit: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceBlock: {
    alignItems: "center",
  },
  stage: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  cardStack: {
    position: "absolute",
    width: 345,
    height: 240,
  },
  micWrap: {
    width: MIC,
    height: MIC,
    borderRadius: MIC / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -130,
    zIndex: 2,
    // Fill + elevation must share this view or Android drops the disc.
    shadowColor: "#5528E8",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 14,
  },
  micHit: {
    width: MIC,
    height: MIC,
    alignItems: "center",
    justifyContent: "center",
  },
  micPressed: {
    opacity: 0.88,
  },
  hRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingRight: 8,
    marginBottom: 24,
  },
  recipientHit: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  moreCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3A3A3A",
    alignItems: "center",
    justifyContent: "center",
  },
  quickAccessRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingRight: 8,
    marginBottom: 24,
  },
  quickAccessItem: {
    width: 84,
    minHeight: 96,
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    marginBottom: 24,
  },
  sessionMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#7B4DFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerRow: {
    gap: BANNER_GAP,
    paddingRight: 8,
    marginBottom: 24,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    maxWidth: BANNER_WIDTH - 70,
  },
  bannerArt: {
    position: "absolute",
    right: -28,
    bottom: -30,
  },
  quickHead: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 12,
  },
  quickItem: {
    width: 64,
    minHeight: 88,
    alignItems: "center",
    gap: 6,
  },
  caret: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: ACCENT,
    marginTop: 2,
  },
  caretHidden: {
    opacity: 0,
  },
});
