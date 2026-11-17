import React, { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { assets } from '../assets';
import { Keyboard } from '../components/Keyboard';
import { LadderBoard } from '../components/LadderBoard';
import { PaperSheet } from '../components/PaperSheet';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatStrip } from '../components/StatStrip';
import { SecondaryButton } from '../components/SecondaryButton';
import { BOOKS } from '../constants/config';
import { theme } from '../constants/theme';
import { REJECT_TEXT } from '../game/ladderLogic';
import type { Ladder } from '../game/ladders';
import { RoundResult, useLadderGame } from '../hooks/useLadderGame';
import { SCREEN_W } from '../utils/layout';

type Props = {
  ladder: Ladder;
  ladderNumber: number;
  onGameOver: (result: RoundResult) => void;
  onExit: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SHEET_BTN_W = Math.min(SCREEN_W - 48, 360) - 36;

export function GameScreen({ ladder, ladderNumber, onGameOver, onExit }: Props) {
  const [paused, setPaused] = useState(false);
  const game = useLadderGame(ladder, onGameOver);

  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);
  const handleGiveUp = useCallback(() => {
    setPaused(false);
    game.giveUp();
  }, [game]);

  const book = BOOKS[ladder.book] || BOOKS[0];

  const message = game.reject
    ? REJECT_TEXT[game.reject]
    : game.selectedIndex === null
    ? 'TAP A TILE TO CHANGE IT'
    : 'NOW PICK A LETTER';

  return (
    <ScreenBackground variant="board">
      <ScreenHeader
        tone="parchment"
        leftSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="library"
            onPress={onExit}
            hitSlop={HIT}
            style={styles.iconButton}>
            <Image source={assets.iconHome} style={styles.navIcon} />
          </Pressable>
        }
        title={`BOOK ${book.name} · LADDER ${ladderNumber}`}
        subtitle={`PAR ${ladder.par}`}
        rightSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="pause"
            onPress={openPause}
            hitSlop={HIT}
            style={styles.iconButton}>
            <Image source={assets.iconPause} style={styles.navIcon} />
          </Pressable>
        }
      />

      <LadderBoard
        path={game.path}
        target={ladder.target}
        cols={game.cols}
        lockedMask={ladder.lockedMask}
        changedIndex={game.changedIndex}
        selectedIndex={game.selectedIndex}
        hintIndex={game.hintIndex}
        shakeTick={game.rejectTick}
        solving={game.solving}
        onSelect={game.selectPosition}
      />

      <View style={styles.messageRow}>
        <Text
          numberOfLines={1}
          style={[
            styles.message,
            game.reject ? styles.messageWarn : null,
          ]}>
          {message}
        </Text>
      </View>

      <StatStrip
        cells={[
          { value: String(ladder.par), label: 'PAR' },
          { value: String(game.moves), label: 'MOVES' },
          {
            value: String(game.rungsLeft),
            label: 'LEFT',
            color:
              game.rungsLeft <= 1
                ? theme.colors.earth.terracotta
                : theme.colors.text.ink,
          },
          { value: String(game.ink), label: 'INK' },
        ]}
      />

      <View style={styles.controls}>
        <Keyboard
          lettersDim={game.selectedIndex === null}
          onKey={game.pressKey}
          onUndo={game.undo}
          onHint={game.useHint}
        />
      </View>

      <PaperSheet
        visible={paused}
        title="PAUSED"
        sprite={assets.sprite5}
        onClose={closePause}>
        <Text style={styles.sheetLine}>
          {`TARGET WORD · ${ladder.target}`}
        </Text>
        <Text style={styles.sheetLine}>{`PAR · ${ladder.par} RUNGS`}</Text>
        <View style={styles.sheetButtons}>
          <SecondaryButton
            label="GIVE UP"
            onPress={handleGiveUp}
            width={SHEET_BTN_W}
          />
          <SecondaryButton
            label="LIBRARY"
            onPress={onExit}
            width={SHEET_BTN_W}
          />
        </View>
      </PaperSheet>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.ui.inkTint,
    borderWidth: 1,
    borderColor: theme.colors.ui.inkTintStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  messageRow: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  messageWarn: {
    color: theme.colors.earth.terracotta,
  },
  controls: {
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    paddingBottom: 16,
    marginTop: 8,
    ...theme.shadows.controls,
  },
  sheetLine: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  sheetButtons: {
    marginTop: 14,
    gap: 10,
    alignItems: 'center',
  },
});
