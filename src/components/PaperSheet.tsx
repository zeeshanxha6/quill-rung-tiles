import React from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '../constants/theme';
import { SCREEN_W } from '../utils/layout';

type Props = {
  visible: boolean;
  title: string;
  sprite?: ImageSourcePropType;
  onClose: () => void;
  children: React.ReactNode;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SHEET_W = Math.min(SCREEN_W - 48, 360);

/** One parchment sheet reused by every in-screen surface. */
function PaperSheetBase({ visible, title, sprite, onClose, children }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="dismiss"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { width: SHEET_W }]}>
        <View style={styles.header}>
          {sprite ? <Image source={sprite} style={styles.sprite} /> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rule} />
        <View style={styles.body}>{children}</View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="close"
          onPress={onClose}
          hitSlop={HIT}
          style={styles.close}>
          <Text style={styles.closeLabel}>CLOSE</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sprite: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  rule: {
    height: 2,
    width: 48,
    backgroundColor: theme.colors.earth.terracotta,
    marginTop: 10,
  },
  body: {
    marginTop: 14,
  },
  close: {
    marginTop: 18,
    height: 44,
    width: '100%',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.inkTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.ink,
  },
});

export const PaperSheet = React.memo(PaperSheetBase);
