import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { assets } from '../assets';
import { ScreenBackground } from '../components/ScreenBackground';
import {
  LOADER_BAR_MS,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
} from '../constants/config';
import { theme } from '../constants/theme';

type Props = { onDone: () => void };

const BAR_W = 180;

export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(14)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.45)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 48,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(logoY, {
        toValue: 0,
        duration: 500,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // width cannot run on the native driver
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    const fadeTimer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start();
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    const doneTimer = setTimeout(() => {
      doneRef.current();
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      loop.stop();
    };
  }, [bar, cardOpacity, cardScale, fade, logoY, pulse]);

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <ScreenBackground variant="loader">
      <Animated.View style={[styles.root, { opacity: fade }]}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <Animated.Image
            source={assets.logo}
            style={[styles.logo, { transform: [{ translateY: logoY }] }]}
          />
        </Animated.View>

        <View style={styles.cardRule} />

        <Text style={styles.titleTop}>QUILL RUNG</Text>
        <Text style={styles.titleBottom}>TILES</Text>
        <View style={styles.titleRule} />
        <Text style={styles.subtitle}>ONE LETTER AT A TIME</Text>

        <View style={styles.barBlock}>
          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Animated.Text style={[styles.loading, { opacity: pulse }]}>
            LOADING
          </Animated.Text>
        </View>

        <Image source={assets.sprite1} style={styles.cornerSprite} />
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 168,
    height: 168,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(247,243,234,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(247,243,234,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 132,
    height: 132,
    resizeMode: 'contain',
  },
  cardRule: {
    width: 56,
    height: 2,
    backgroundColor: theme.colors.earth.terracotta,
    marginTop: 20,
  },
  titleTop: {
    fontFamily: 'serif',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.onInk,
    marginTop: 22,
    textAlign: 'center',
  },
  titleBottom: {
    fontFamily: 'serif',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.earth.terracottaSoft,
    textAlign: 'center',
  },
  titleRule: {
    width: 140,
    height: 1,
    backgroundColor: 'rgba(247,243,234,0.25)',
    marginTop: 14,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 4,
    color: theme.colors.text.onInkMuted,
    marginTop: 14,
    textAlign: 'center',
  },
  barBlock: {
    alignItems: 'center',
    marginTop: 40,
  },
  track: {
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(247,243,234,0.14)',
    overflow: 'hidden',
  },
  fillWrap: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loading: {
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 3,
    color: 'rgba(247,243,234,0.55)',
    marginTop: 10,
  },
  cornerSprite: {
    position: 'absolute',
    width: 96,
    height: 96,
    right: 12,
    bottom: 24,
    opacity: 0.35,
    resizeMode: 'contain',
  },
});
