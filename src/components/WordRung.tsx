import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { TIMING } from '../constants/config';
import { theme } from '../constants/theme';
import { TILE_GAP } from '../utils/layout';
import { LetterTile, TileState } from './LetterTile';

type Props = {
  word: string;
  tileSize: number;
  changedIndex: number;
  lockedMask: number[];
  isCurrent: boolean;
  dimmed: boolean;
  selectedIndex: number | null;
  hintIndex: number | null;
  shakeTick: number;
  onSelect?: (index: number) => void;
};

function stateFor(
  index: number,
  changedIndex: number,
  lockedMask: number[],
  isCurrent: boolean,
  selectedIndex: number | null,
): TileState {
  if (lockedMask.indexOf(index) !== -1) {
    return 'locked';
  }
  if (isCurrent && selectedIndex === index) {
    return 'selected';
  }
  if (index === changedIndex) {
    return 'changed';
  }
  return isCurrent ? 'current' : 'rest';
}

function WordRungBase({
  word,
  tileSize,
  changedIndex,
  lockedMask,
  isCurrent,
  dimmed,
  selectedIndex,
  hintIndex,
  shakeTick,
  onSelect,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const lastShake = useRef(shakeTick);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: TIMING.rungSlide,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (shakeTick === lastShake.current || !isCurrent) {
      lastShake.current = shakeTick;
      return;
    }
    lastShake.current = shakeTick;
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeTick, isCurrent, shakeX]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 0],
  });

  const letters = word.split('');

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.row,
        {
          opacity: Animated.multiply(enter, dimmed ? 0.55 : 1),
          transform: [
            { translateY },
            { translateX: shakeX },
            { scale: dimmed ? 0.94 : 1 },
          ],
        },
      ]}>
      {letters.map((letter, index) => {
        const state = stateFor(
          index,
          changedIndex,
          lockedMask,
          isCurrent,
          selectedIndex,
        );
        const showHint = isCurrent && hintIndex === index;
        return (
          <View
            key={`${word}-${index}`}
            style={[styles.slot, { width: tileSize, height: tileSize + 7 }]}>
            <LetterTile
              letter={letter}
              size={tileSize}
              state={state}
              onPress={
                isCurrent && onSelect ? () => onSelect(index) : undefined
              }
            />
            {state === 'selected' || showHint ? (
              <View
                style={[
                  styles.underline,
                  {
                    width: tileSize,
                    backgroundColor: showHint
                      ? theme.colors.earth.mustard
                      : theme.colors.earth.terracotta,
                  },
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: TILE_GAP,
  },
  slot: {
    alignItems: 'center',
  },
  underline: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  },
});

export const WordRung = React.memo(WordRungBase);
