import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/cn";

export type ScreenProps = {
  children: ReactNode;
  edges?: { top?: boolean; bottom?: boolean };
  className?: string;
};

export function Screen({ children, edges, className }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className={cn("flex-1 bg-bg", className)}>
      <View
        className="min-h-0 flex-1 flex-col"
        style={{
          paddingTop: edges?.top === false ? 0 : insets.top,
          paddingBottom: edges?.bottom === false ? 0 : insets.bottom,
        }}
      >
        {children}
      </View>
    </View>
  );
}
