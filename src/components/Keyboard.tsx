import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lightbulb, Undo2 } from 'lucide-react-native';

import { QWERTY_ROWS } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { KEY_GAP, KEY_H, KEY_W, KEYBOARD_PAD, WIDE_KEY_W } from '../utils/layout';
import type { ButtonIcon } from './PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type KeyProps = {
  label: string;
  width: number;
  onPress: (label: string) => void;
  dim?: boolean;
  Icon?: ButtonIcon;
};

function KeyBase({ label, width, onPress, dim, Icon }: KeyProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const handlePress = useCallback(() => onPress(label), [onPress, label]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={{ width, height: KEY_H }}>
      <Animated.View
        style={[
          styles.key,
          {
            width,
            height: KEY_H,
            opacity: dim ? 0.45 : 1,
            transform: [{ scale }],
          },
        ]}>
        <View style={[styles.keyRow, Icon ? styles.keyStack : null]}>
          {Icon ? (
            <Icon size={20} color={theme.colors.text.primary} strokeWidth={2} />
          ) : null}
          <Text
            style={[
              styles.keyLabel,
              Icon ? styles.keyLabelSmall : null,
            ]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const Key = React.memo(KeyBase);

type Props = {
  lettersDim: boolean;
  onKey: (letter: string) => void;
  onUndo: () => void;
  onHint: () => void;
};

function KeyboardBase({ lettersDim, onKey, onUndo, onHint }: Props) {
  const handleUndo = useCallback(() => onUndo(), [onUndo]);
  const handleHint = useCallback(() => onHint(), [onHint]);

  return (
    <View style={styles.pad}>
      <View style={styles.row}>
        {QWERTY_ROWS[0].map(k => (
          <Key key={k} label={k} width={KEY_W} onPress={onKey} dim={lettersDim} />
        ))}
      </View>
      <View style={styles.row}>
        {QWERTY_ROWS[1].map(k => (
          <Key key={k} label={k} width={KEY_W} onPress={onKey} dim={lettersDim} />
        ))}
      </View>
      <View style={styles.row}>
        <Key
          label="UNDO"
          width={WIDE_KEY_W}
          onPress={handleUndo}
          Icon={Undo2}
        />
        {QWERTY_ROWS[2].map(k => (
          <Key key={k} label={k} width={KEY_W} onPress={onKey} dim={lettersDim} />
        ))}
        <Key
          label="HINT"
          width={WIDE_KEY_W}
          onPress={handleHint}
          Icon={Lightbulb}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: KEYBOARD_PAD,
    paddingTop: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: KEY_GAP,
  },
  key: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  keyLabel: {
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  keyStack: {
    flexDirection: 'column',
    gap: 1,
  },
  keyLabelSmall: {
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1,
  },
});

export const Keyboard = React.memo(KeyboardBase);
