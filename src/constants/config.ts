/** Tunable gameplay + timing parameters. */

/** Splash length. Must stay at 8000 — shorter races the screenshot window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;
export const LOADER_FADE_MS = 320;

/** Animation timings (ms). */
export const TIMING = {
  fade: 320,
  rungSlide: 220,
  letterFlip: 180,
  shake: 240,
  solveLine: 900,
  pulse: 300,
  stagger: 70,
};

/** Economy — ink drops only. Nothing is purchasable, there is no money anywhere. */
export const START_INK = 5;
export const HINT_COST = 1;
export const DROPS_UNDER_PAR = 3;
export const DROPS_ON_PAR = 2;
export const DROPS_OVER_PAR = 1;

/** How many rungs beyond par the climber is allowed before the ladder runs out. */
export const RUNG_ALLOWANCE_EXTRA = 4;

/** How many rungs of the climb stay mounted in the ladder area (no ScrollView). */
export const VISIBLE_RUNGS = 3;

/** Books on the library shelf. */
export const BOOKS = [
  { id: 0, name: 'FOUR', letters: 4, total: 80 },
  { id: 1, name: 'FIVE', letters: 5, total: 70 },
  { id: 2, name: 'SIX', letters: 6, total: 50 },
];

export const QWERTY_ROWS: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];
