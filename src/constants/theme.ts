/**
 * WARM_EARTHY preset, accent colours overridden to the editorial / magazine brief
 * (parchment + navy ink + vermilion). The `name` field is the preset value verbatim.
 */

export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#F7F3EA',
      secondary: '#F2EAD8',
      tertiary: '#E8DDC4',
      accent: '#D8C9A8',
      ink: '#26385C',
      inkDeep: '#1B2A47',
      inkNight: '#121B2E',
    },
    surface: {
      card: '#FFFDF7',
      alt: '#F2EAD8',
      sunk: '#E8DDC4',
      inkCard: 'rgba(247,243,234,0.07)',
      inkCardSoft: 'rgba(247,243,234,0.05)',
    },
    earth: {
      sage: '#7FA46B',
      olive: '#8B9B5B',
      terracotta: '#C8553D',
      terracottaDeep: '#A8412D',
      terracottaSoft: '#E0795F',
      mustard: '#D9B36C',
      gold: '#F5D77A',
      walnut: '#6B5740',
      stone: '#C9CBBF',
      cream: '#F7F3EA',
    },
    text: {
      primary: '#1A1F2B',
      secondary: '#5A6475',
      muted: '#8B93A1',
      accent: '#C8553D',
      ink: '#26385C',
      onInk: '#F7F3EA',
      onInkMuted: '#C9CBBF',
    },
    ui: {
      border: '#D8C9A8',
      borderStrong: '#C3B291',
      hairline: 'rgba(26,31,43,0.07)',
      hairlineInk: 'rgba(247,243,234,0.16)',
      divider: '#E8DDC4',
      overlay: 'rgba(18,27,46,0.74)',
      glass: 'rgba(255,253,247,0.92)',
      inkTint: 'rgba(38,56,92,0.06)',
      inkTintStrong: 'rgba(38,56,92,0.14)',
    },
  },

  gradients: {
    parchment: ['#F7F3EA', '#F2EAD8', '#E8DDC4'] as string[],
    board: ['#F7F3EA', '#EFE8DA'] as string[],
    ink: ['#121B2E', '#1B2A47', '#26385C'] as string[],
    result: ['#26385C', '#1B2A47', '#121B2E'] as string[],
    primaryButton: ['#26385C', '#1B2A47'] as string[],
    accentButton: ['#C8553D', '#A8412D'] as string[],
    progress: ['#C8553D', '#E0795F'] as string[],
  },

  typography: {
    hero: { fontFamily: 'serif', fontSize: 40, fontWeight: '700' as const, letterSpacing: 1 },
    title: { fontFamily: 'serif', fontSize: 26, fontWeight: '700' as const, letterSpacing: 1 },
    heading: { fontFamily: 'serif', fontSize: 20, fontWeight: '700' as const, letterSpacing: 1 },
    button: { fontFamily: 'serif', fontSize: 18, fontWeight: '700' as const, letterSpacing: 2 },
    body: { fontFamily: 'monospace', fontSize: 14, fontWeight: '400' as const, letterSpacing: 0.5 },
    label: { fontFamily: 'monospace', fontSize: 12, fontWeight: '700' as const, letterSpacing: 1.5 },
    caption: { fontFamily: 'monospace', fontSize: 10, fontWeight: '700' as const, letterSpacing: 3 },
    tile: { fontFamily: 'monospace', fontWeight: '700' as const, letterSpacing: 0 },
  },

  radius: { xs: 4, sm: 6, md: 10, lg: 16, xl: 20, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    primary: {
      shadowColor: '#26385C',
      shadowOpacity: 0.3,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    accent: {
      shadowColor: '#C8553D',
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
    controls: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.07,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 6,
    },
  },

  animation: {
    press: { tension: 220, friction: 12 },
    entrance: { tension: 55, friction: 9 },
    pop: { tension: 70, friction: 7 },
  },
};

export type Theme = typeof theme;
