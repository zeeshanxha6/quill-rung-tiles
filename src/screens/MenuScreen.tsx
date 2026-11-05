import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ArrowUp, BookOpen, CalendarCheck, Settings } from 'lucide-react-native';

import { assets } from '../assets';
import { BookCard } from '../components/BookCard';
import { InkBadge } from '../components/InkBadge';
import { PaperSheet } from '../components/PaperSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { Rise } from '../components/Rise';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { BOOKS } from '../constants/config';
import { theme } from '../constants/theme';
import { getProgress } from '../game/store';
import { SCREEN_W } from '../utils/layout';

type Props = {
  ink: number;
  selectedBook: number;
  onSelectBook: (book: number) => void;
  onStart: (daily: boolean) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const GUTTER = 24;
const CARD_GAP = 10;
const CARD_W = Math.floor((SCREEN_W - GUTTER * 2 - CARD_GAP * 2) / 3);
const CTA_W = Math.min(SCREEN_W - GUTTER * 2, 420);
const SECONDARY_W = Math.floor((CTA_W - CARD_GAP) / 2);

export function MenuScreen({ ink, selectedBook, onSelectBook, onStart }: Props) {
  const [sheet, setSheet] = useState<'none' | 'settings' | 'journal'>('none');
  const float = useRef(new Animated.Value(0)).current;
  const progress = getProgress();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const openSettings = useCallback(() => setSheet('settings'), []);
  const openJournal = useCallback(() => setSheet('journal'), []);
  const closeSheet = useCallback(() => setSheet('none'), []);
  const startClimb = useCallback(() => onStart(false), [onStart]);
  const startDaily = useCallback(() => onStart(true), [onStart]);

  const heroY = float.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });

  return (
    <ScreenBackground variant="parchment">
      <ScreenHeader
        tone="parchment"
        leftSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="settings"
            onPress={openSettings}
            hitSlop={HIT}
            style={styles.iconButton}>
            <Settings size={20} color={theme.colors.text.ink} strokeWidth={2} />
          </Pressable>
        }
        rightSlot={<InkBadge value={ink} tone="parchment" />}
      />

      <View pointerEvents="none" style={styles.heroWrap}>
        <Animated.Image
          source={assets.sprite1}
          style={[styles.hero, { transform: [{ translateY: heroY }] }]}
        />
      </View>

      <View style={styles.content}>
        <Rise from="left" delay={0} style={styles.titleBlock}>
          <Text style={styles.titleInk}>QUILL</Text>
        </Rise>
        <Rise from="left" delay={60} style={styles.titleBlock}>
          <Text style={styles.titleNavy}>RUNG</Text>
        </Rise>
        <Rise from="left" delay={120} style={styles.titleBlock}>
          <Text style={styles.titleAccent}>TILES</Text>
        </Rise>

        <View style={styles.titleRule} />
        <Text style={styles.tagline}>CLIMB WORD TO WORD · 27 LADDERS</Text>

        <View style={styles.spacer} />

        <View style={styles.sectionRow}>
          <Image source={assets.sprite3} style={styles.sectionSprite} />
          <Text style={styles.sectionLabel}>THE LIBRARY</Text>
          <View style={styles.sectionRule} />
        </View>

        <View style={styles.shelf}>
          {BOOKS.map((book, i) => (
            <Rise key={book.name} delay={160 + i * 70}>
              <BookCard
                name={book.name}
                letters={book.letters}
                done={progress.solvedPerBook[book.id] || 0}
                total={book.total}
                selected={selectedBook === book.id}
                width={CARD_W}
                onPress={() => onSelectBook(book.id)}
              />
            </Rise>
          ))}
        </View>

        <Text style={styles.hint}>
          HOW TO PLAY · CHANGE ONE LETTER PER RUNG
        </Text>

        <Rise delay={320} style={styles.ctaWrap}>
          <PrimaryButton
            label="START CLIMB"
            Icon={ArrowUp}
            onPress={startClimb}
            width={CTA_W}
          />
        </Rise>

        <Rise delay={380} style={styles.secondaryRow}>
          <SecondaryButton
            label="DAILY LADDER"
            Icon={CalendarCheck}
            onPress={startDaily}
            width={SECONDARY_W}
          />
          <SecondaryButton
            label="JOURNAL"
            Icon={BookOpen}
            onPress={openJournal}
            width={SECONDARY_W}
          />
        </Rise>
      </View>

      <PaperSheet
        visible={sheet === 'settings'}
        title="SETTINGS"
        sprite={assets.iconHome}
        onClose={closeSheet}>
        <Text style={styles.sheetLine}>SOUND · PAPER RUSTLE ON</Text>
        <Text style={styles.sheetLine}>THEME · PARCHMENT</Text>
        <Text style={styles.sheetLine}>HINTS COST 1 INK DROP</Text>
        <Text style={styles.sheetNote}>
          No ads, no purchases, nothing is locked behind ink.
        </Text>
      </PaperSheet>

      <PaperSheet
        visible={sheet === 'journal'}
        title="WORD JOURNAL"
        sprite={assets.sprite3}
        onClose={closeSheet}>
        {progress.journal.length > 0 ? (
          progress.journal.slice(0, 6).map(entry => (
            <View key={entry.word} style={styles.journalRow}>
              <Text style={styles.journalWord}>{entry.word}</Text>
              <Text style={styles.journalNote}>{entry.note}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sheetNote}>
            Every rung you climb is written down here.
          </Text>
        )}
      </PaperSheet>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.ui.inkTint,
    borderWidth: 1,
    borderColor: theme.colors.ui.inkTintStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: {
    position: 'absolute',
    width: 158,
    height: 158,
    right: 10,
    top: 206,
  },
  hero: {
    width: 158,
    height: 158,
    opacity: 0.95,
    resizeMode: 'contain',
  },
  titleBlock: {
    paddingLeft: GUTTER,
  },
  titleInk: {
    fontFamily: 'serif',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  titleNavy: {
    fontFamily: 'serif',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.bg.ink,
  },
  titleAccent: {
    fontFamily: 'serif',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.earth.terracotta,
  },
  titleRule: {
    width: 64,
    height: 2,
    backgroundColor: theme.colors.earth.terracotta,
    marginLeft: GUTTER,
    marginTop: 12,
  },
  tagline: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 2.5,
    color: theme.colors.text.secondary,
    marginLeft: GUTTER,
    marginTop: 12,
  },
  spacer: {
    flex: 1,
    minHeight: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: GUTTER,
    marginBottom: 10,
  },
  sectionSprite: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  sectionLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 3,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.ui.border,
  },
  shelf: {
    flexDirection: 'row',
    gap: CARD_GAP,
    paddingHorizontal: GUTTER,
  },
  hint: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  ctaWrap: {
    alignItems: 'center',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: CARD_GAP,
    marginTop: 10,
  },
  sheetLine: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  sheetNote: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 18,
    color: theme.colors.text.secondary,
    marginTop: 10,
  },
  journalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  journalWord: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  journalNote: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
});
