import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { SCREEN_W } from '../utils/layout';

export type ButtonIcon = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  colors?: string[];
  shadow?: 'primary' | 'accent';
  width?: number;
};

const ICON_SIZE = 24;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  colors = theme.gradients.primaryButton,
  shadow = 'primary',
  width = Math.min(SCREEN_W - 48, 420),
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[
        styles.press,
        { width, height: 60 },
        shadow === 'accent' ? theme.shadows.accent : theme.shadows.primary,
      ]}>
      <Animated.View
        style={[styles.fill, { width, height: 60, transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.row}>
          {Icon ? (
            <Icon size={ICON_SIZE} color={theme.colors.text.onInk} strokeWidth={2} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.md,
  },
  fill: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(26,31,43,0.30)',
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
    fontFamily: 'serif',
    fontSize: 19,
    lineHeight: ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.onInk,
  },
});

export const PrimaryButton = React.memo(PrimaryButtonBase);
