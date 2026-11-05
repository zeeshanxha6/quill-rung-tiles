import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { assets } from '../assets';
import { TIMING, VISIBLE_RUNGS } from '../constants/config';
import { theme } from '../constants/theme';
import {
  BOARD_FRAME,
  boardWidthFor,
  plaqueTileSizeFor,
  tileSizeFor,
} from '../utils/layout';
import { LetterTile } from './LetterTile';
import { WordRung } from './WordRung';

type Props = {
  path: string[];
  target: string;
  cols: number;
  lockedMask: number[];
  changedIndex: number;
  selectedIndex: number | null;
  hintIndex: number | null;
  shakeTick: number;
  solving: boolean;
  onSelect: (index: number) => void;
};

function Plaque({
  word,
  caption,
  cols,
  withSprite,
}: {
  word: string;
  caption: string;
  cols: number;
  withSprite?: boolean;
}) {
  const size = plaqueTileSizeFor(cols);
  return (
    <View style={styles.plaqueBlock}>
      <View style={styles.captionRow}>
        {withSprite ? (
          <Image source={assets.sprite5} style={styles.captionSprite} />
        ) : null}
        <Text style={styles.caption}>{caption}</Text>
      </View>
      <View style={styles.plaqueRow}>
        {word.split('').map((letter, i) => (
          <LetterTile
            key={`${caption}-${i}`}
            letter={letter}
            size={size}
            state="goal"
          />
        ))}
      </View>
    </View>
  );
}

function LadderBoardBase({
  path,
  target,
  cols,
  lockedMask,
  changedIndex,
  selectedIndex,
  hintIndex,
  shakeTick,
  solving,
  onSelect,
}: Props) {
  const tile = tileSizeFor(cols);
  const boardW = boardWidthFor(cols);
  const solveLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!solving) {
      return;
    }
    Animated.timing(solveLine, {
      toValue: 1,
      duration: TIMING.solveLine,
      // height cannot run on the native driver
      useNativeDriver: false,
    }).start();
  }, [solving, solveLine]);

  // newest rung first, only the last few stay mounted (no ScrollView)
  const visible = path.slice(Math.max(0, path.length - VISIBLE_RUNGS)).reverse();
  const currentWord = path[path.length - 1];

  return (
    <View style={styles.area}>
      <Plaque word={target} caption="TARGET" cols={cols} withSprite />

      <View style={[styles.rungs, { width: boardW }]}>
        <View pointerEvents="none" style={styles.spine} />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.solveLine,
            {
              height: solveLine.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        {visible.map(word => {
          const isCurrent = word === currentWord;
          return (
            <WordRung
              key={word}
              word={word}
              tileSize={tile}
              changedIndex={isCurrent ? changedIndex : -1}
              lockedMask={lockedMask}
              isCurrent={isCurrent}
              dimmed={!isCurrent}
              selectedIndex={selectedIndex}
              hintIndex={hintIndex}
              shakeTick={shakeTick}
              onSelect={onSelect}
            />
          );
        })}
      </View>

      <Plaque word={path[0]} caption="START" cols={cols} />
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  plaqueBlock: {
    alignItems: 'center',
    paddingHorizontal: BOARD_FRAME,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  captionSprite: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  caption: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 3,
    color: theme.colors.text.muted,
  },
  plaqueRow: {
    flexDirection: 'row',
    gap: 5,
  },
  rungs: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  spine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 2,
    marginLeft: -1,
    backgroundColor: 'rgba(38,56,92,0.18)',
  },
  solveLine: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 2,
    marginLeft: -1,
    backgroundColor: theme.colors.earth.terracotta,
  },
});

export const LadderBoard = React.memo(LadderBoardBase);
