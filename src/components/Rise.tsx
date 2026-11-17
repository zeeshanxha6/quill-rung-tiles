import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

type Props = {
  delay?: number;
  from?: 'bottom' | 'left';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * Entrance wrapper. `pointerEvents="box-none"` is mandatory: an Animated.View
 * around a Pressable swallows taps on Android release builds otherwise.
 */
function RiseBase({ delay = 0, from = 'bottom', style, children }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 320,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from === 'left' ? -16 : 18, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        style,
        {
          opacity: progress,
          transform:
            from === 'left'
              ? [{ translateX: offset }]
              : [{ translateY: offset }],
        },
      ]}>
      {children}
    </Animated.View>
  );
}

export const Rise = React.memo(RiseBase);
