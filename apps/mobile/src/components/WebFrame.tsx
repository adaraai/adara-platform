import type { ReactNode } from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import { getWebViewportWidth } from "@/lib/webLayout";
import { useTokens } from "@/theme";

/**
 * Holds the web build to a phone-sized column.
 *
 * Every screen is laid out for a handset — absolute tab bar, full-bleed orb,
 * bottom-anchored composer — so letting it stretch across a laptop is what
 * makes the desktop build read as broken. Width is the only thing constrained:
 * the column runs the full height of the viewport so nothing is letterboxed.
 * On a narrow browser (a real phone) the frame gets out of the way entirely.
 */
const FRAME_WIDTH = 420;
/** Above this the viewport is wider than any handset, so show the column. */
const FRAME_BREAKPOINT = 480;

const frameFillStyle = { flex: 1, height: "100%", minHeight: 0, width: "100%" } as const;

export function WebFrame({ children }: { children: ReactNode }) {
  const { width: measuredWidth } = useWindowDimensions();
  const tokens = useTokens();
  const isDark = tokens.scheme === "dark";

  const width =
    Platform.OS === "web"
      ? measuredWidth > 0
        ? measuredWidth
        : getWebViewportWidth(FRAME_BREAKPOINT + 1)
      : measuredWidth;

  if (Platform.OS !== "web" || width <= FRAME_BREAKPOINT) {
    return <View style={frameFillStyle}>{children}</View>;
  }

  return (
    <View
      style={{
        ...frameFillStyle,
        alignItems: "center",
        backgroundColor: isDark ? "#161616" : "#F1F1F3",
      }}
    >
      <View
        style={{
          width: FRAME_WIDTH,
          height: "100%",
          flex: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: isDark ? "#343434" : "#E5E5E5",
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
          // `hidden` keeps the tab bar and voice modal inside the column.
          overflow: "hidden",
          boxShadow: isDark
            ? "0px 0px 48px rgba(0, 0, 0, 0.55)"
            : "0px 0px 48px rgba(0, 0, 0, 0.10)",
        }}
      >
        {children}
      </View>
    </View>
  );
}
