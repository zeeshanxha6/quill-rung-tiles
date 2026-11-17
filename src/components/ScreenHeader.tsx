import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { HEADER_CONTENT_H, HEADER_PAD_TOP } from '../utils/layout';

type Props = {
  tone: 'parchment' | 'ink';
  leftSlot?: React.ReactNode;
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

/**
 * One header for every screen. Screens differ only by the slots they pass —
 * never by re-implementing the markup.
 */
function ScreenHeaderBase({ tone, leftSlot, title, subtitle, rightSlot }: Props) {
  const ink = tone === 'ink';

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: ink ? 'rgba(18,27,46,0.42)' : theme.colors.ui.glass,
          borderBottomColor: ink
            ? theme.colors.ui.hairlineInk
            : theme.colors.ui.border,
        },
      ]}>
      <View style={styles.side}>{leftSlot}</View>

      <View style={styles.center}>
        {title ? (
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: ink ? theme.colors.text.onInk : theme.colors.text.primary },
            ]}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                color: ink
                  ? theme.colors.text.onInkMuted
                  : theme.colors.text.secondary,
              },
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + HEADER_CONTENT_H,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  side: {
    width: 96,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 2,
  },
});

export const ScreenHeader = React.memo(ScreenHeaderBase);
