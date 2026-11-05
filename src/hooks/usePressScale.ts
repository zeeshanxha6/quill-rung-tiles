import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

import { theme } from '../constants/theme';

/**
 * Press feedback helper. The <Pressable> stays the PARENT and drives this;
 * the <Animated.View> it returns a value for lives INSIDE the Pressable.
 * Only `transform` is animated, so useNativeDriver stays true.
 */
export function usePressScale(pressedScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
