import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
  tone?: 'parchment' | 'ink';
};

/**
 * No raster icon inside — colour carries the semantics, the number is the hero.
 * `width: '100%'` (never flex:1) so the card keeps its intrinsic content height
 * inside a flex:1 row slot.
 */
function StatCardBase({ value, label, valueColor, tone = 'ink' }: Props) {
  const ink = tone === 'ink';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: ink
            ? theme.colors.surface.inkCard
            : theme.colors.surface.card,
          borderColor: `${valueColor}55`,
        },
      ]}>
      <View style={[styles.accentDot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { color: ink ? theme.colors.text.onInkMuted : theme.colors.text.secondary },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontFamily: 'serif',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});

export const StatCard = React.memo(StatCardBase);
