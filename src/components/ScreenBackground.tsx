import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { assets } from '../assets';
import { theme } from '../constants/theme';

export type BackgroundVariant = 'loader' | 'parchment' | 'board' | 'result';

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

const GRAIN_OPACITY: Record<BackgroundVariant, number> = {
  loader: 0.18,
  parchment: 0.1,
  board: 0.08,
  result: 0.12,
};

const GRADIENTS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.ink,
  parchment: theme.gradients.parchment,
  board: theme.gradients.board,
  result: theme.gradients.result,
};

/** gradient -> paper grain -> soft blobs -> content: three layers of depth on every screen. */
function ScreenBackgroundBase({ variant, children }: Props) {
  const isInk = variant === 'loader' || variant === 'result';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={variant === 'parchment' ? { x: 0, y: 0 } : { x: 0.5, y: 0 }}
        end={variant === 'parchment' ? { x: 1, y: 1 } : { x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={assets.bgGame}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { opacity: GRAIN_OPACITY[variant] }]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.blobTop,
          {
            backgroundColor: isInk
              ? 'rgba(200,85,61,0.12)'
              : 'rgba(38,56,92,0.045)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.blobBottom,
          {
            backgroundColor: isInk
              ? 'rgba(247,243,234,0.05)'
              : 'rgba(200,85,61,0.06)',
          },
        ]}
      />
      {variant === 'parchment' ? (
        <View pointerEvents="none" style={styles.columnRule} />
      ) : null}
      {variant === 'board' ? (
        <View pointerEvents="none" style={styles.spineRule} />
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  blobTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -70,
    right: -80,
  },
  blobBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    bottom: -60,
    left: -50,
  },
  columnRule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 24,
    width: 1,
    backgroundColor: theme.colors.ui.hairline,
  },
  spineRule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(26,31,43,0.06)',
  },
});

export const ScreenBackground = React.memo(ScreenBackgroundBase);
