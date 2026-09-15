import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  View,
  type ListRenderItem,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/Text";
import type { Language } from "@/lib/api";
import { tapLight } from "@/lib/haptics";
import { isLanguageSelectable, languageLabel } from "@/lib/languages";
import { cn } from "@/lib/cn";
import { useTokens } from "@/theme";

export type LanguagePairPickerProps = {
  fromLang: string;
  toLang: string;
  languages: Language[];
  onChangeFrom: (name: string) => void;
  onChangeTo: (name: string) => void;
  /** Compact pill — tap to change languages. */
  minimized?: boolean;
  className?: string;
};

type PickerSide = "from" | "to";

function LanguageChip({
  label,
  onPress,
  active,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const tokens = useTokens();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Select ${label}`}
      onPress={() => {
        tapLight();
        onPress();
      }}
      className={cn(
        "min-h-[36px] flex-1 flex-row items-center justify-center rounded-full px-2 active:opacity-75",
        active ? "bg-bg" : undefined,
      )}
    >
      <Text
        numberOfLines={1}
        className="font-medium text-body text-text"
        style={{ flexShrink: 1 }}
      >
        {languageLabel(label)}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={tokens.textTertiary}
        style={{ marginLeft: 2, flexShrink: 0 }}
      />
    </Pressable>
  );
}

/** Tap-to-change source/target languages in one unified bar. */
export function LanguagePairPicker({
  fromLang,
  toLang,
  languages,
  onChangeFrom,
  onChangeTo,
  minimized = false,
  className,
}: LanguagePairPickerProps) {
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<PickerSide>("from");

  const selectable = useMemo(
    () => languages.filter(isLanguageSelectable),
    [languages],
  );

  const selected = side === "from" ? fromLang : toLang;

  const openPicker = (next: PickerSide) => {
    tapLight();
    setSide(next);
    setOpen(true);
  };

  const swap = () => {
    tapLight();
    onChangeFrom(toLang);
    onChangeTo(fromLang);
  };

  const pick = (name: string) => {
    tapLight();
    if (side === "from") {
      onChangeFrom(name);
      if (name === toLang) {
        onChangeTo(fromLang);
      }
    } else {
      onChangeTo(name);
      if (name === fromLang) {
        onChangeFrom(toLang);
      }
    }
    setOpen(false);
  };

  const renderItem: ListRenderItem<Language> = ({ item }) => {
    const enabled = isLanguageSelectable(item);
    const isSelected = item.name === selected;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !enabled }}
        disabled={!enabled}
        onPress={() => pick(item.name)}
        className={cn(
          "flex-row items-center justify-between px-gutter py-3.5 active:opacity-70",
          !enabled && "opacity-40",
        )}
      >
        <View className="min-w-0 flex-1">
          <Text variant="bodyStrong">{item.name}</Text>
          <Text variant="caption" className="mt-0.5 capitalize text-text-tertiary">
            {item.status}
          </Text>
        </View>
        {isSelected ? (
          <Ionicons name="checkmark" size={20} color={tokens.text} />
        ) : null}
      </Pressable>
    );
  };

  if (minimized) {
    return (
      <>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${fromLang} to ${toLang}. Change languages`}
          onPress={() => openPicker("from")}
          className={cn(
            "flex-row items-center rounded-full border border-border bg-surface-sunken px-2.5 py-1 active:opacity-75",
            className,
          )}
        >
          <Text
            numberOfLines={1}
            className="font-medium text-caption text-text"
            style={{ flexShrink: 0 }}
          >
            {languageLabel(fromLang)}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={11}
            color={tokens.textTertiary}
            style={{ marginHorizontal: 4, flexShrink: 0 }}
          />
          <Text
            numberOfLines={1}
            className="font-medium text-caption text-text"
            style={{ flexShrink: 0 }}
          >
            {languageLabel(toLang)}
          </Text>
          <Ionicons
            name="chevron-down"
            size={12}
            color={tokens.textTertiary}
            style={{ marginLeft: 4, flexShrink: 0 }}
          />
        </Pressable>

        <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
          <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)} />
          <View
            className="max-h-[72%] rounded-t-2xl bg-bg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="flex-row items-center justify-between border-b border-border px-gutter py-4">
              <Text variant="heading" accessibilityRole="header">
                {side === "from" ? "Translate from" : "Translate to"}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close language picker"
                onPress={() => setOpen(false)}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={22} color={tokens.text} />
              </Pressable>
            </View>

            <FlatList
              data={selectable}
              keyExtractor={(item) => item.code}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View className="mx-gutter h-px bg-border" />}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <View
        className={cn(
          "flex-row items-center rounded-full border border-border bg-surface-sunken p-1",
          className,
        )}
      >
        <LanguageChip label={fromLang} onPress={() => openPicker("from")} active={open && side === "from"} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Swap languages"
          onPress={swap}
          className="h-9 w-9 shrink-0 items-center justify-center rounded-full active:opacity-70"
        >
          <Ionicons name="swap-horizontal" size={18} color={tokens.text} />
        </Pressable>

        <LanguageChip label={toLang} onPress={() => openPicker("to")} active={open && side === "to"} />
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)} />
        <View
          className="max-h-[72%] rounded-t-2xl bg-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-row items-center justify-between border-b border-border px-gutter py-4">
            <Text variant="heading" accessibilityRole="header">
              {side === "from" ? "Translate from" : "Translate to"}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close language picker"
              onPress={() => setOpen(false)}
              className="active:opacity-70"
            >
              <Ionicons name="close" size={22} color={tokens.text} />
            </Pressable>
          </View>

          <FlatList
            data={selectable}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View className="mx-gutter h-px bg-border" />}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
    </>
  );
}
