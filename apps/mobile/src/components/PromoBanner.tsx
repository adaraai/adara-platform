import { Pressable, ScrollView, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { ramp, useTokens, type Tokens } from "@/theme";

/**
 * Illustrated promo carousel for Home — same "soft blob + white glyph card"
 * illustration language as the reference app, redrawn with Adara's violet /
 * sand / aqua / lime ramps instead of borrowing its brand colors.
 */

export type PromoIllustration = "voice" | "history" | "shield" | "globe";

const ART_SIZE = 132;

function VoiceArt({ accent }: { accent: string }) {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 132 132">
      <Circle cx={94} cy={36} r={48} fill="rgba(255,255,255,0.24)" />
      <Circle cx={36} cy={98} r={26} fill="rgba(255,255,255,0.18)" />
      <Circle cx={100} cy={104} r={7} fill="rgba(255,255,255,0.5)" />
      <Circle cx={26} cy={36} r={4} fill="rgba(255,255,255,0.6)" />
      <Circle cx={88} cy={88} r={40} fill="#FFFFFF" opacity={0.92} />
      <Rect x={62} y={70} width={8} height={16} rx={4} fill={accent} />
      <Rect x={76} y={56} width={8} height={44} rx={4} fill={accent} />
      <Rect x={90} y={64} width={8} height={30} rx={4} fill={accent} />
      <Rect x={104} y={74} width={8} height={10} rx={4} fill={accent} />
    </Svg>
  );
}

function HistoryArt({ accent }: { accent: string }) {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 132 132">
      <Circle cx={92} cy={34} r={46} fill="rgba(255,255,255,0.22)" />
      <Circle cx={32} cy={100} r={24} fill="rgba(255,255,255,0.18)" />
      <Circle cx={112} cy={98} r={6} fill="rgba(255,255,255,0.5)" />
      <Circle cx={24} cy={38} r={4} fill="rgba(255,255,255,0.6)" />
      <Circle cx={88} cy={86} r={38} fill="#FFFFFF" opacity={0.92} />
      <Circle cx={88} cy={86} r={27} stroke={accent} strokeWidth={5} fill="none" />
      <Path
        d="M88 70v18l13 8"
        stroke={accent}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function ShieldArt({ accent }: { accent: string }) {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 132 132">
      <Circle cx={92} cy={34} r={46} fill="rgba(255,255,255,0.22)" />
      <Circle cx={30} cy={98} r={24} fill="rgba(255,255,255,0.18)" />
      <Circle cx={26} cy={34} r={4} fill="rgba(255,255,255,0.6)" />
      <Circle cx={110} cy={92} r={6} fill="rgba(255,255,255,0.5)" />
      <Path
        d="M88 42 L118 54 V78 C118 100 104 114 88 120 C72 114 58 100 58 78 V54 Z"
        fill="#FFFFFF"
        opacity={0.92}
      />
      <Path d="M88 52 L108 60 V78 C108 93 98 103 88 108 C78 103 68 93 68 78 V60 Z" fill={accent} />
      <Path
        d="M80 79l6 6 13-14"
        stroke="#FFFFFF"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function GlobeArt({ accent }: { accent: string }) {
  return (
    <Svg width={ART_SIZE} height={ART_SIZE} viewBox="0 0 132 132">
      <Circle cx={90} cy={34} r={46} fill="rgba(255,255,255,0.22)" />
      <Circle cx={30} cy={98} r={24} fill="rgba(255,255,255,0.18)" />
      <Circle cx={110} cy={92} r={6} fill="rgba(255,255,255,0.5)" />
      <Circle cx={24} cy={36} r={4} fill="rgba(255,255,255,0.6)" />
      <Circle cx={88} cy={86} r={38} fill="#FFFFFF" opacity={0.92} />
      <Circle cx={88} cy={86} r={27} stroke={accent} strokeWidth={4.5} fill="none" />
      <Path d="M61 86h54" stroke={accent} strokeWidth={4.5} strokeLinecap="round" />
      <Path
        d="M88 59c10 8 10 46 0 54M88 59c-10 8-10 46 0 54"
        stroke={accent}
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function BannerArt({ kind, accent }: { kind: PromoIllustration; accent: string }) {
  if (kind === "voice") return <VoiceArt accent={accent} />;
  if (kind === "history") return <HistoryArt accent={accent} />;
  if (kind === "shield") return <ShieldArt accent={accent} />;
  return <GlobeArt accent={accent} />;
}

export type PromoBanner = {
  illustration: PromoIllustration;
  title: string;
  accessibilityLabel: string;
  onPress?: () => void;
};

/** Wash + accent pulled from the brand ramp so this stays on-palette in both themes. */
function washFor(illustration: PromoIllustration, tokens: Tokens): { bg: string; accent: string } {
  const dark = tokens.scheme === "dark";
  switch (illustration) {
    case "voice":
      return { bg: dark ? ramp.violet[800] : ramp.violet[100], accent: ramp.violet[600] };
    case "history":
      return { bg: dark ? ramp.aqua[700] : ramp.aqua[100], accent: ramp.aqua[500] };
    case "shield":
      return { bg: dark ? ramp.lime[700] : ramp.lime[100], accent: ramp.lime[500] };
    case "globe":
    default:
      return { bg: dark ? ramp.sand[700] : ramp.sand[100], accent: ramp.sand[500] };
  }
}

const CARD_WIDTH = 264;
const CARD_HEIGHT = 116;
const CARD_GAP = 12;

export function PromoBannerCarousel({
  banners,
  className,
}: {
  banners: PromoBanner[];
  className?: string;
}) {
  const tokens = useTokens();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + CARD_GAP}
      snapToAlignment="start"
      className={cn("-mx-gutter", className)}
      contentContainerClassName="gap-3 px-gutter"
      role="list"
      accessibilityLabel="Promotions"
    >
      {banners.map((banner, i) => {
        const { bg, accent } = washFor(banner.illustration, tokens);
        const style: ViewStyle = {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 26,
          overflow: "hidden",
          backgroundColor: bg,
        };

        return (
          <Pressable
            key={i}
            onPress={banner.onPress}
            disabled={!banner.onPress}
            accessibilityRole={banner.onPress ? "button" : undefined}
            accessibilityLabel={banner.accessibilityLabel}
            style={style}
            className={banner.onPress ? "active:opacity-85" : undefined}
          >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, padding: 16, maxWidth: CARD_WIDTH - 60 }}>
              <Text
                variant="bodyStrong"
                style={{ color: tokens.text }}
                className="leading-snug"
              >
                {banner.title}
              </Text>
            </View>
            <View style={{ position: "absolute", right: -26, bottom: -26 }}>
              <BannerArt kind={banner.illustration} accent={accent} />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
