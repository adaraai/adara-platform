import { useCallback, useRef, type RefObject } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const PIN_THRESHOLD = 96;

/** ChatGPT-style scroll: auto-follow only when the user is already at the bottom. */
export function useChatScroll<T>(listRef: RefObject<FlatList<T> | null>) {
  const pinnedRef = useRef(true);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    pinnedRef.current = distanceFromBottom <= PIN_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, [listRef]);

  const pinToBottom = useCallback(() => {
    pinnedRef.current = true;
  }, []);

  const scrollToBottomIfPinned = useCallback(
    (animated = true) => {
      if (!pinnedRef.current) return;
      scrollToBottom(animated);
    },
    [scrollToBottom],
  );

  const scrollToBottomAndPin = useCallback(
    (animated = true) => {
      pinToBottom();
      scrollToBottom(animated);
    },
    [pinToBottom, scrollToBottom],
  );

  return {
    onScroll,
    scrollToBottom,
    scrollToBottomIfPinned,
    scrollToBottomAndPin,
    pinToBottom,
  };
}
