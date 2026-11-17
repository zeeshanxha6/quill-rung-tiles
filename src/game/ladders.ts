export type Ladder = {
  id: string;
  book: number; // index into BOOKS
  start: string;
  target: string;
  par: number; // number of rungs in the shipped par path
  parPath: string[]; // start ... target, every step one letter apart
  /** Positions that can never be changed on this ladder (editorial "pinned" letters). */
  lockedMask: number[];
};

const mk = (
  id: string,
  book: number,
  parPath: string[],
  lockedMask: number[] = [],
): Ladder => ({
  id,
  book,
  start: parPath[0],
  target: parPath[parPath.length - 1],
  par: parPath.length - 1,
  parPath,
  lockedMask,
});

/** Book FOUR — four-letter rungs. */
const BOOK_FOUR: Ladder[] = [
  mk('4-01', 0, ['CORN', 'BORN', 'BARN']),
  mk('4-02', 0, ['LEAD', 'LOAD', 'GOAD', 'GOLD']),
  mk('4-03', 0, ['RING', 'RANG', 'SANG', 'SONG']),
  mk('4-04', 0, ['COLD', 'CORD', 'CARD', 'WARD', 'WARM']),
  mk('4-05', 0, ['LAMB', 'LIMB', 'LIME', 'TIME']),
  mk('4-06', 0, ['MOSS', 'MOST', 'MAST', 'MASK']),
  mk('4-07', 0, ['BIRD', 'BARD', 'BARN', 'BORN']),
  mk('4-08', 0, ['HATE', 'HAVE', 'HOVE', 'LOVE']),
  mk('4-09', 0, ['FIRE', 'HIRE', 'HERE', 'HERD', 'HEAD', 'HEAT']),
  mk('4-10', 0, ['HEAD', 'HEAL', 'TEAL', 'TELL', 'TALL', 'TAIL']),
  mk('4-11', 0, ['FOOT', 'FOOL', 'FOIL', 'FAIL', 'FALL', 'BALL']),
  mk('4-12', 0, ['SALT', 'MALT', 'MALE', 'MILE', 'MILD', 'MIND', 'MINE']),
];

/** Book FIVE — five-letter rungs. */
const BOOK_FIVE: Ladder[] = [
  mk('5-01', 1, ['HOUSE', 'MOUSE', 'MOOSE']),
  mk('5-02', 1, ['WHEAT', 'CHEAT', 'CHEAP']),
  mk('5-03', 1, ['PLANT', 'PLANE', 'PLACE']),
  mk('5-04', 1, ['WATER', 'LATER', 'LAYER']),
  mk('5-05', 1, ['BREAD', 'BREAK', 'BLEAK']),
  mk('5-06', 1, ['NIGHT', 'LIGHT', 'RIGHT', 'MIGHT']),
  mk('5-07', 1, ['STORE', 'STONE', 'SHONE', 'SHINE']),
  mk('5-08', 1, ['CRANE', 'CRATE', 'GRATE', 'GRADE']),
  mk('5-09', 1, ['SMOKE', 'SPOKE', 'STOKE', 'STOLE', 'STONE']),
];

/** Book SIX — six-letter rungs. */
const BOOK_SIX: Ladder[] = [
  mk('6-01', 2, ['HARDER', 'HARDEN', 'GARDEN']),
  mk('6-02', 2, ['BUTTER', 'BATTER', 'BETTER']),
  mk('6-03', 2, ['WINTER', 'WINDER', 'WANDER']),
  mk('6-04', 2, ['MASTER', 'MATTER', 'MUTTER']),
  mk('6-05', 2, ['MARKET', 'MARKED', 'BARKED']),
  mk('6-06', 2, ['SUMMER', 'SIMMER', 'DIMMER']),
];

export const LADDERS: Ladder[] = [...BOOK_FOUR, ...BOOK_FIVE, ...BOOK_SIX];

export function laddersForBook(book: number): Ladder[] {
  return LADDERS.filter(l => l.book === book);
}

/**
 * Deterministic pick. `index` wraps, so the catalogue is endless offline and
 * the same seed always yields the same ladder (used by the Daily Ladder too).
 */
export function ladderAt(book: number, index: number): Ladder {
  const pool = laddersForBook(book);
  const safe = pool.length > 0 ? pool : LADDERS;
  return safe[((index % safe.length) + safe.length) % safe.length];
}

/** Today's ladder, seeded by the calendar date. */
export function dailyLadderIndex(book: number): number {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const pool = laddersForBook(book);
  const len = pool.length > 0 ? pool.length : LADDERS.length;
  return seed % len;
}
