import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { ArrowUp } from 'lucide-react-native';

import { assets } from '../assets';
import { InkBadge } from '../components/InkBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { Rise } from '../components/Rise';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { DROPS_UNDER_PAR } from '../constants/config';
import { theme } from '../constants/theme';
import { VERDICT_LABEL, verdictFor } from '../game/ladderLogic';
import type { RoundResult } from '../hooks/useLadderGame';
import { SCREEN_W } from '../utils/layout';

type Props = {
  result: RoundResult;
  ink: number;
  streak: number;
  solved: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const GUTTER = 24;
const CTA_W = Math.min(SCREEN_W - GUTTER * 2, 420);
const MAX_LINES = 4;

const VERDICT_COLOR = {
  under: theme.colors.earth.mustard,
  match: theme.colors.earth.sage,
  over: theme.colors.earth.terracotta,
};

function PathColumn({
  title,
  words,
  color,
  matchColor,
  reference,
}: {
  title: string;
  words: string[];
  color: string;
  matchColor: string;
  reference: string[];
}) {
  const shown = words.slice(0, MAX_LINES);
  const extra = words.length - shown.length;

  return (
    <View style={styles.column}>
      <Text style={styles.columnTitle}>{title}</Text>
      {shown.map((word, i) => (
        <Text
          key={`${title}-${word}-${i}`}
          style={[
            styles.columnWord,
            { color: reference.indexOf(word) !== -1 ? matchColor : color },
          ]}>
          {word}
        </Text>
      ))}
      {extra > 0 ? (
        <Text style={styles.columnMore}>{`+${extra} MORE`}</Text>
      ) : null}
    </View>
  );
}

export function GameOverScreen({
  result,
  ink,
  streak,
  solved,
  onPlayAgain,
  onMenu,
}: Props) {
  const drops = useRef(
    [0, 1, 2].map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.stagger(
      140,
      drops.map(value =>
        Animated.spring(value, {
          toValue: 1,
          tension: theme.animation.pop.tension,
          friction: theme.animation.pop.friction,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [drops]);

  const verdict = verdictFor(result.moves, result.par);
  const headline = result.won ? 'LADDER SOLVED' : 'NO RUNGS LEFT';

  const cards = [
    result.moves > 0
      ? {
          value: String(result.moves),
          label: 'MOVES',
          color: theme.colors.earth.gold,
        }
      : null,
    streak > 0
      ? {
          value: String(streak),
          label: 'STREAK',
          color: theme.colors.earth.sage,
        }
      : null,
    solved > 0
      ? {
          value: String(solved),
          label: 'SOLVED',
          color: theme.colors.earth.terracotta,
        }
      : null,
  ].filter(Boolean) as { value: string; label: string; color: string }[];

  return (
    <ScreenBackground variant="result">
      <ScreenHeader
        tone="ink"
        title="RESULT"
        rightSlot={<InkBadge value={ink} tone="ink" />}
      />

      <View style={styles.content}>
        <Image source={assets.sprite4} style={styles.ribbon} />

        <Text style={styles.headline}>{headline}</Text>
        <View style={styles.headlineRule} />
        <Text style={[styles.verdict, { color: VERDICT_COLOR[verdict] }]}>
          {result.won ? VERDICT_LABEL[verdict] : 'THE LADDER RAN OUT'}
        </Text>

        <Rise delay={80} style={styles.card}>
          <View style={styles.columns}>
            <PathColumn
              title="YOUR PATH"
              words={result.path}
              color={theme.colors.text.onInk}
              matchColor={theme.colors.earth.sage}
              reference={result.parPath}
            />
            <View style={styles.columnRule} />
            <PathColumn
              title="PAR PATH"
              words={result.parPath}
              color={theme.colors.text.onInkMuted}
              matchColor={theme.colors.earth.sage}
              reference={result.path}
            />
          </View>
        </Rise>

        <View style={styles.dropsRow}>
          {drops.map((value, i) => (
            <Animated.View
              key={`drop-${i}`}
              pointerEvents="none"
              style={{
                opacity: i < result.drops ? 1 : 0.25,
                transform: [{ scale: value }],
              }}>
              <Image source={assets.sprite2} style={styles.drop} />
            </Animated.View>
          ))}
          <Text style={styles.dropsLabel}>
            {`INK EARNED ${result.drops} OF ${DROPS_UNDER_PAR}`}
          </Text>
        </View>

        <View style={styles.spacer} />

        {cards.length >= 2 ? (
          <View style={styles.statsRow}>
            {cards.map(card => (
              <View key={card.label} style={styles.statSlot}>
                <StatCard
                  value={card.value}
                  label={card.label}
                  valueColor={card.color}
                  tone="ink"
                />
              </View>
            ))}
          </View>
        ) : null}

        <Rise delay={180} style={styles.ctaWrap}>
          <PrimaryButton
            label="CLIMB AGAIN"
            Icon={ArrowUp}
            onPress={onPlayAgain}
            colors={theme.gradients.accentButton}
            shadow="accent"
            width={CTA_W}
          />
        </Rise>

        <Rise delay={240} style={styles.ctaWrap}>
          <SecondaryButton
            label="LIBRARY"
            onPress={onMenu}
            tone="ink"
            width={CTA_W}
          />
        </Rise>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: 'center',
  },
  ribbon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  headline: {
    fontFamily: 'serif',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.onInk,
    textAlign: 'center',
  },
  headlineRule: {
    width: 72,
    height: 2,
    backgroundColor: theme.colors.earth.terracotta,
    marginTop: 10,
  },
  verdict: {
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 2,
    marginTop: 10,
  },
  card: {
    width: '100%',
    marginTop: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.inkCard,
    borderWidth: 1,
    borderColor: theme.colors.ui.hairlineInk,
    padding: 14,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnRule: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.ui.hairlineInk,
    marginHorizontal: 10,
  },
  columnTitle: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    marginBottom: 6,
  },
  columnWord: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: 2,
  },
  columnMore: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  dropsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  drop: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  dropsLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.5,
    color: theme.colors.text.onInkMuted,
    marginLeft: 4,
  },
  spacer: {
    flex: 1,
    minHeight: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 14,
  },
  statSlot: {
    flex: 1,
  },
  ctaWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
});
