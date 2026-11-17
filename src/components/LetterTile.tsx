import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { theme } from '../constants/theme';

export type TileState =
  | 'rest'
  | 'current'
  | 'changed'
  | 'locked'
  | 'selected'
  | 'goal';

type Props = {
  letter: string;
  size: number;
  state: TileState;
  onPress?: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Skin = { bg: string; border: string; fg: string };

function skinFor(state: TileState): Skin {
  switch (state) {
    case 'changed':
      return {
        bg: theme.colors.earth.terracotta,
        border: theme.colors.earth.terracottaDeep,
        fg: theme.colors.text.onInk,
      };
    case 'locked':
      return {
        bg: theme.colors.earth.stone,
        border: theme.colors.ui.borderStrong,
        fg: theme.colors.text.secondary,
      };
    case 'selected':
      return {
        bg: theme.colors.surface.card,
        border: theme.colors.earth.terracotta,
        fg: theme.colors.text.primary,
      };
    case 'current':
      return {
        bg: theme.colors.surface.card,
        border: theme.colors.bg.ink,
        fg: theme.colors.text.primary,
      };
    case 'goal':
      return {
        bg: theme.colors.bg.tertiary,
        border: theme.colors.earth.stone,
        fg: theme.colors.bg.ink,
      };
    default:
      return {
        bg: theme.colors.surface.card,
        border: theme.colors.ui.border,
        fg: theme.colors.text.primary,
      };
  }
}

function LetterTileBase({ letter, size, state, onPress }: Props) {
  const skin = skinFor(state);
  const fontSize = Math.round(size * 0.46);

  const body = (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: skin.bg,
          borderColor: skin.border,
        },
      ]}>
      <View style={styles.bevelTop} />
      <View style={styles.bevelBottom} />
      <Text
        style={[
          styles.letter,
          { fontSize, lineHeight: size - 4, color: skin.fg },
        ]}>
        {letter}
      </Text>
      {state === 'locked' ? (
        <View style={styles.lockBadge}>
          <Lock size={10} color={theme.colors.text.secondary} strokeWidth={2.5} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`letter ${letter}`}
      onPress={onPress}
      hitSlop={HIT}
      style={{ width: size, height: size }}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bevelTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  bevelBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(26,31,43,0.10)',
  },
  letter: {
    fontFamily: 'monospace',
    fontWeight: '700',
    textAlign: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export const LetterTile = React.memo(LetterTileBase);
