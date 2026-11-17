import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Droplet } from 'lucide-react-native';

import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';

type Props = {
  value: number;
  tone?: 'parchment' | 'ink';
};

/** Ink drops. Plain integer, no currency symbol — nothing here is purchasable. */
function InkBadgeBase({ value, tone = 'parchment' }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) {
      return;
    }
    previous.current = value;
    scale.setValue(1.2);
    Animated.timing(scale, {
      toValue: 1,
      duration: TIMING.pulse,
      useNativeDriver: true,
    }).start();
  }, [value, scale]);

  const ink = tone === 'ink';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.pill,
        {
          transform: [{ scale }],
          backgroundColor: ink
            ? 'rgba(247,243,234,0.08)'
            : theme.colors.ui.inkTint,
          borderColor: ink
            ? theme.colors.ui.hairlineInk
            : theme.colors.ui.inkTintStrong,
        },
      ]}>
      <View style={styles.row}>
        <Droplet
          size={16}
          color={theme.colors.earth.terracotta}
          strokeWidth={2.4}
        />
        <Text
          style={[
            styles.value,
            { color: ink ? theme.colors.text.onInk : theme.colors.text.ink },
          ]}>
          {String(value)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 34,
    minWidth: 72,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  value: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export const InkBadge = React.memo(InkBadgeBase);
