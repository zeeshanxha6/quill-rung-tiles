/**
 * QuillRungTiles — screen state machine only. All gameplay lives in src/.
 */

import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { theme } from './src/constants/theme';
import { ladderAt, dailyLadderIndex, Ladder } from './src/game/ladders';
import { advanceLadder, getProgress, selectBook } from './src/game/store';
import type { RoundResult } from './src/hooks/useLadderGame';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

type Stats = { ink: number; streak: number; solved: number };

function snapshot(): Stats {
  const p = getProgress();
  return { ink: p.ink, streak: p.streak, solved: p.solved };
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [book, setBook] = useState(0);
  const [round, setRound] = useState(0);
  const [ladder, setLadder] = useState<Ladder>(() => ladderAt(0, 0));
  const [ladderNumber, setLadderNumber] = useState(1);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [stats, setStats] = useState<Stats>(snapshot);

  const goMenu = useCallback(() => {
    setStats(snapshot());
    setScreen('menu');
  }, []);

  const handleSelectBook = useCallback((next: number) => {
    setBook(next);
    selectBook(next);
  }, []);

  const beginRound = useCallback(
    (bookId: number, daily: boolean) => {
      const index = daily
        ? dailyLadderIndex(bookId)
        : getProgress().ladderIndex;
      setLadder(ladderAt(bookId, index));
      setLadderNumber(Math.abs(index) + 1);
      setRound(r => r + 1);
      setStats(snapshot());
      setScreen('game');
    },
    [],
  );

  const handleStart = useCallback(
    (daily: boolean) => beginRound(book, daily),
    [beginRound, book],
  );

  const handleGameOver = useCallback((roundResult: RoundResult) => {
    advanceLadder();
    setResult(roundResult);
    setStats(snapshot());
    setScreen('gameover');
  }, []);

  const handlePlayAgain = useCallback(() => {
    beginRound(book, false);
  }, [beginRound, book]);

  const dark = screen === 'loader' || screen === 'gameover';

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          ink={stats.ink}
          selectedBook={book}
          onSelectBook={handleSelectBook}
          onStart={handleStart}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={`round-${round}`}
          ladder={ladder}
          ladderNumber={ladderNumber}
          onGameOver={handleGameOver}
          onExit={goMenu}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <GameOverScreen
          result={result}
          ink={stats.ink}
          streak={stats.streak}
          solved={stats.solved}
          onPlayAgain={handlePlayAgain}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});

export default App;
