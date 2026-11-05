import { Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/** Board geometry — the parent's padding AND border are part of the frame. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 8;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 10
export const TILE_GAP = 6;

/** Visual cap so a 4-letter rung does not eat the whole ladder area. */
const TILE_MAX = 58;
const TILE_MIN = 34;

export function tileSizeFor(cols: number): number {
  const raw = Math.floor(
    (BOARD_MAX_W - 2 * BOARD_FRAME - TILE_GAP * (cols - 1)) / cols,
  );
  return Math.max(TILE_MIN, Math.min(TILE_MAX, raw));
}

export function boardWidthFor(cols: number): number {
  const tile = tileSizeFor(cols);
  return tile * cols + TILE_GAP * (cols - 1) + 2 * BOARD_FRAME;
}

/** The goal / start plaques use a smaller tile than the live rungs. */
export function plaqueTileSizeFor(cols: number): number {
  return Math.max(26, Math.min(40, tileSizeFor(cols) - 14));
}

/** Keyboard metrics — 10 keys on the top row decide the key width. */
export const KEY_GAP = 4;
export const KEYBOARD_PAD = 12;
export const KEY_W = Math.max(
  26,
  Math.floor((SCREEN_W - KEYBOARD_PAD * 2 - KEY_GAP * 9) / 10),
);
export const KEY_H = 46;
export const WIDE_KEY_W = Math.round(KEY_W * 1.5 + KEY_GAP / 2);

export const HEADER_PAD_TOP = 44;
export const HEADER_CONTENT_H = 56;
