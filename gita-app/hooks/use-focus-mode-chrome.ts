import {
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FocusModeChromeOptions = {
  topHeight: number;
  bottomHeight: number;
  hideAfterOffset?: number;
  hideDurationMs?: number;
  deltaThreshold?: number;
};

export function useFocusModeChrome({
  topHeight,
  bottomHeight,
  hideAfterOffset = 16,
  hideDurationMs = 220,
  deltaThreshold = 2,
}: FocusModeChromeOptions) {
  const chromeVisibility = useSharedValue(1);
  const lastScrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = Math.max(0, event.contentOffset.y);
      const delta = y - lastScrollY.value;

      if (delta > deltaThreshold && y > hideAfterOffset && chromeVisibility.value !== 0) {
        chromeVisibility.value = withTiming(0, {
          duration: hideDurationMs,
          easing: Easing.out(Easing.cubic),
        });
      } else if (delta < -deltaThreshold && chromeVisibility.value !== 1) {
        chromeVisibility.value = withTiming(1, {
          duration: 0,
        });
      }

      lastScrollY.value = y;
    },
  });

  const topChromeStyle = useAnimatedStyle(() => {
    return {
      opacity: chromeVisibility.value,
      transform: [
        {
          translateY: interpolate(chromeVisibility.value, [0, 1], [-topHeight, 0]),
        },
      ],
    };
  }, [topHeight]);

  const bottomChromeStyle = useAnimatedStyle(() => {
    return {
      opacity: chromeVisibility.value,
      transform: [
        {
          translateY: interpolate(chromeVisibility.value, [0, 1], [bottomHeight, 0]),
        },
      ],
    };
  }, [bottomHeight]);

  return {
    onScroll,
    topChromeStyle,
    bottomChromeStyle,
  };
}
