import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WebFrame } from "@/components";
import { fontMap, useResolvedColorScheme } from "@/theme";
import { webRootStyle } from "@/lib/webLayout";

import "../global.css";

// Hold the native splash until icon fonts are ready. Body type is system UI
// (ChatGPT product stack), so we only wait on Ionicons.
void SplashScreen.preventAutoHideAsync();

const webSafeAreaMetrics =
  Platform.OS === "web" && typeof window !== "undefined"
    ? {
        frame: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }
    : undefined;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);
  const { setColorScheme } = useColorScheme();
  const scheme = useResolvedColorScheme();

  useEffect(() => {
    setColorScheme("system");
  }, [setColorScheme]);

  useEffect(() => {
    if (Platform.OS === "web") {
      void SplashScreen.hideAsync();
      return;
    }
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  const waitingOnFonts = !fontsLoaded && !fontError && Platform.OS !== "web";
  if (waitingOnFonts) return null;

  return (
    <GestureHandlerRootView style={webRootStyle}>
      <SafeAreaProvider style={webRootStyle} initialMetrics={webSafeAreaMetrics}>
        <View style={webRootStyle}>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <WebFrame>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent", flex: 1 } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="profile" options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="voice-settings" options={{ animation: "slide_from_right" }} />
            </Stack>
          </WebFrame>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
