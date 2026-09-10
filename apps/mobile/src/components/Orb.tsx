import { VideoView } from "expo-video";
import { useEffect, useMemo } from "react";
import { Platform, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { getOrbPlayer, isOrbVideoReady } from "@/lib/orbPlayer";
import { motion, useTokens } from "@/theme";

export type OrbProps = {
  size?: number;
  state?: "idle" | "listening" | "thinking";
  /** ChatGPT-style fade + scale when the voice screen opens. */
  animateIn?: boolean;
};

const VIDEO_ZOOM = 1.72;
const ENTRANCE_MS = 520;
const isWeb = Platform.OS === "web";

/** White video backgrounds key out on light canvas only. */
function videoBlend(scheme: "light" | "dark"): ViewStyle["mixBlendMode"] | undefined {
  if (scheme === "dark") return undefined;
  return "multiply";
}

/** ChatGPT-style cloud — loops `assets/adara.mp4`, always silent. */
export function Orb({ size = 260, state = "idle", animateIn = false }: OrbProps) {
  const tokens = useTokens();
  const blend = videoBlend(tokens.scheme);
  const player = useMemo(() => getOrbPlayer(), []);
  const ready = isOrbVideoReady(player);

  const entrance = useSharedValue(animateIn && !isWeb ? 0 : 1);
  const videoReveal = useSharedValue(isWeb || ready ? 1 : 0);
  const breathe = useSharedValue(0);
  const drift = useSharedValue(0);

  const breatheAmp =
    state === "listening" ? 0.035 : state === "thinking" ? 0.02 : 0.012;
  const breatheMs =
    state === "listening" ? motion.ambient * 0.7 : motion.ambient;

  const frame = size * VIDEO_ZOOM;
  const inset = (frame - size) / 2;
  const clipBg =
    tokens.scheme === "light" && blend ? "#FFFFFF" : "transparent";

  useEffect(() => {
    player.muted = true;
    player.volume = 0;
    player.loop = true;
    player.play();
  }, [player]);

  useEffect(() => {
    if (isWeb) {
      videoReveal.value = 1;
      return;
    }

    if (isOrbVideoReady(player)) {
      videoReveal.value = 1;
      return;
    }

    const subscription = player.addListener("statusChange", ({ status }) => {
      if (status !== "readyToPlay") return;
      videoReveal.value = withTiming(1, {
        duration: motion.base,
        easing: Easing.out(Easing.cubic),
      });
    });

    return () => subscription.remove();
  }, [player, videoReveal]);

  useEffect(() => {
    if (!animateIn || isWeb) {
      entrance.value = 1;
      return;
    }

    entrance.value = 0;
    entrance.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [animateIn, entrance]);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: breatheMs, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breathe, breatheMs]);

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [drift]);

  const shellStyle = useAnimatedStyle(() => {
    const enterScale = 0.84 + entrance.value * 0.16;
    const breatheScale = 1 + breathe.value * breatheAmp;

    return {
      opacity: isWeb ? 1 : entrance.value,
      transform: [{ scale: enterScale * breatheScale }],
    };
  });

  const videoDriftStyle = useAnimatedStyle(() => ({
    opacity: isWeb ? 1 : videoReveal.value * entrance.value,
    transform: [
      { translateX: (drift.value - 0.5) * size * 0.025 },
      { translateY: (drift.value - 0.5) * -size * 0.018 },
    ],
  }));

  const revealVideo = () => {
    videoReveal.value = withTiming(1, {
      duration: motion.base,
      easing: Easing.out(Easing.cubic),
    });
    player.play();
  };

  return (
    <Animated.View
      style={[{ width: size, height: size }, shellStyle]}
      accessibilityRole="image"
      accessibilityLabel={
        state === "listening" ? "Listening" : state === "thinking" ? "Thinking" : "Idle"
      }
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          backgroundColor: clipBg,
        }}
      >
        <Animated.View
          style={[
            {
              width: frame,
              height: frame,
              marginLeft: -inset,
              marginTop: -inset,
            },
            videoDriftStyle,
          ]}
        >
          <VideoView
            player={player}
            style={{
              width: frame,
              height: frame,
              ...(blend ? { mixBlendMode: blend } : null),
            }}
            contentFit="cover"
            nativeControls={false}
            playsInline
            fullscreenOptions={{ enable: false }}
            allowsPictureInPicture={false}
            onFirstFrameRender={revealVideo}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}
