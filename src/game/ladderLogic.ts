import { isValidWord } from './dictionary';

export type RejectReason =
  | 'locked'
  | 'same'
  | 'unknown'
  | 'used'
  | 'nopos'
  | 'noink'
  | 'nothing'
  | null;

export function replaceAt(word: string, index: number, letter: string): string {
  if (index < 0 || index >= word.length) {
    return word;
  }
  return word.slice(0, index) + letter.toUpperCase() + word.slice(index + 1);
}

export function diffIndex(a: string, b: string): number {
  if (a.length !== b.length) {
    return -1;
  }
  let found = -1;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      if (found !== -1) {
        return -1;
      }
      found = i;
    }
  }
  return found;
}

export function isOneLetterApart(a: string, b: string): boolean {
  return diffIndex(a, b) !== -1;
}

/** Validate a candidate rung against the climb so far. */
export function checkCandidate(
  candidate: string,
  current: string,
  path: string[],
): RejectReason {
  if (candidate === current) {
    return 'same';
  }
  if (!isValidWord(candidate)) {
    return 'unknown';
  }
  if (path.indexOf(candidate) !== -1) {
    return 'used';
  }
  return null;
}

export const REJECT_TEXT: Record<Exclude<RejectReason, null>, string> = {
  locked: 'THAT TILE IS PINNED',
  same: 'THAT IS THE SAME WORD',
  unknown: 'NOT IN THE WORD BOOK',
  used: 'ALREADY ON THIS LADDER',
  nopos: 'PICK A TILE FIRST',
  noink: 'NOT ENOUGH INK FOR A HINT',
  nothing: 'NOTHING TO UNDO',
};

/**
 * Which position should change next according to the shipped par path.
 * Returns null when the climb has left the par path behind.
 */
export function parHint(
  current: string,
  parPath: string[],
): { index: number; letter: string } | null {
  const at = parPath.indexOf(current);
  if (at !== -1 && at < parPath.length - 1) {
    const next = parPath[at + 1];
    const idx = diffIndex(current, next);
    if (idx >= 0) {
      return { index: idx, letter: next[idx] };
    }
  }
  // Off the par path: nudge toward the target instead.
  const target = parPath[parPath.length - 1];
  for (let i = 0; i < current.length; i += 1) {
    if (current[i] !== target[i]) {
      const candidate = replaceAt(current, i, target[i]);
      if (isValidWord(candidate)) {
        return { index: i, letter: target[i] };
      }
    }
  }
  return null;
}

export type ParVerdict = 'under' | 'match' | 'over';

export function verdictFor(moves: number, par: number): ParVerdict {
  if (moves < par) {
    return 'under';
  }
  if (moves === par) {
    return 'match';
  }
  return 'over';
}

export const VERDICT_LABEL: Record<ParVerdict, string> = {
  under: 'UNDER PAR',
  match: 'MATCHED PAR',
  over: 'OVER PAR',
};
