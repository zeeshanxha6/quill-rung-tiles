import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { ButtonIcon } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  tone?: 'parchment' | 'ink';
  width: number;
};

const ICON_SIZE = 20;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SecondaryButtonBase({ label, onPress, Icon, tone = 'parchment', width }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const ink = tone === 'ink';
  const fg = ink ? theme.colors.text.onInk : theme.colors.text.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[styles.press, { width, height: 48 }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width,
            height: 48,
            transform: [{ scale }],
            backgroundColor: ink
              ? 'rgba(247,243,234,0.08)'
              : theme.colors.ui.inkTint,
            borderColor: ink
              ? 'rgba(247,243,234,0.20)'
              : theme.colors.ui.border,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_SIZE} color={fg} strokeWidth={2} /> : null}
          <Text numberOfLines={1} style={[styles.label, { color: fg }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.sm,
  },
  fill: {
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export const SecondaryButton = React.memo(SecondaryButtonBase);
