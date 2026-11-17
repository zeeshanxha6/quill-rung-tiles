import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  name: string;
  letters: number;
  done: number;
  total: number;
  selected: boolean;
  width: number;
  onPress: () => void;
};

const CARD_H = 104;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function BookCardBase({
  name,
  letters,
  done,
  total,
  selected,
  width,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const ratio = total > 0 ? Math.min(1, done / total) : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name} letter book`}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={{ width, height: CARD_H }}>
      <Animated.View
        style={[
          styles.card,
          theme.shadows.card,
          {
            width,
            height: CARD_H,
            transform: [{ scale }],
            borderColor: selected
              ? theme.colors.earth.terracotta
              : theme.colors.ui.border,
            borderWidth: selected ? 2 : 1,
          },
        ]}>
        {selected ? <View style={styles.dot} /> : null}

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.caption}>{`${letters} LETTERS`}</Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
        </View>
        <Text style={styles.count}>{`${done}/${total}`}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
    justifyContent: 'flex-start',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.terracotta,
  },
  name: {
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  caption: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.bg.tertiary,
    marginTop: 14,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.bg.ink,
  },
  count: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    marginTop: 6,
  },
});

export const BookCard = React.memo(BookCardBase);
