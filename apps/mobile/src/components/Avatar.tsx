import { Image, View, type ImageSourcePropType } from "react-native";

import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";

export type AvatarProps = {
  uri?: string;
  /** Bundled asset from `require(...)`. */
  source?: ImageSourcePropType;
  /** Shown when there is no image — first letters of the person's name. */
  initials: string;
  size?: number;
  className?: string;
};

export function Avatar({ uri, source, initials, size = 48, className }: AvatarProps) {
  const imageSource = source ?? (uri ? { uri } : null);

  return (
    <View
      className={cn(
        "items-center justify-center overflow-hidden rounded-full bg-primary-soft",
        className,
      )}
      style={{ height: size, width: size }}
      accessibilityRole="image"
      accessibilityLabel={initials}
    >
      {imageSource ? (
        <Image source={imageSource} style={{ height: size, width: size }} />
      ) : (
        <Text variant="heading" className="text-primary">
          {initials}
        </Text>
      )}
    </View>
  );
}
