import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

type Cell = { value: string; label: string; color?: string };

type Props = {
  cells: Cell[];
};

/** One divided strip of three — never isolated pills. */
function StatStripBase({ cells }: Props) {
  return (
    <View style={styles.strip}>
      {cells.map((cell, i) => (
        <View
          key={cell.label}
          style={[styles.cell, i > 0 ? styles.cellDivided : null]}>
          <Text
            style={[
              styles.value,
              { color: cell.color || theme.colors.text.ink },
            ]}>
            {cell.value}
          </Text>
          <Text style={styles.label}>{cell.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  cellDivided: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.ui.border,
  },
  value: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 2,
    color: theme.colors.text.muted,
    marginTop: 1,
  },
});

export const StatStrip = React.memo(StatStripBase);
