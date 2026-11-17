import { START_INK } from '../constants/config';
import { describeWord } from './dictionary';

export type JournalEntry = { word: string; note: string };

type Progress = {
  ink: number;
  streak: number;
  solved: number;
  bestUnderPar: number;
  book: number;
  ladderIndex: number;
  solvedPerBook: number[];
  journal: JournalEntry[];
};

/**
 * Module-level session store. No AsyncStorage, no native storage dependency —
 * the session is complete and self-consistent within one run.
 */
const progress: Progress = {
  ink: START_INK,
  streak: 0,
  solved: 0,
  bestUnderPar: 0,
  book: 0,
  ladderIndex: 0,
  solvedPerBook: [0, 0, 0],
  journal: [],
};

export function getProgress(): Progress {
  return progress;
}

export function getInk(): number {
  return progress.ink;
}

export function spendInk(amount: number): boolean {
  if (progress.ink < amount) {
    return false;
  }
  progress.ink -= amount;
  return true;
}

export function earnInk(amount: number): void {
  progress.ink += amount;
}

export function selectBook(book: number): void {
  progress.book = book;
  progress.ladderIndex = 0;
}

export function advanceLadder(): void {
  progress.ladderIndex += 1;
}

export function recordSolved(book: number, underPar: boolean): void {
  progress.solved += 1;
  progress.streak += 1;
  progress.solvedPerBook[book] = (progress.solvedPerBook[book] || 0) + 1;
  if (underPar) {
    progress.bestUnderPar += 1;
  }
}

export function recordFailed(): void {
  progress.streak = 0;
}

export function addJournal(word: string): void {
  if (progress.journal.some(e => e.word === word)) {
    return;
  }
  progress.journal.unshift({ word, note: describeWord(word) });
  if (progress.journal.length > 40) {
    progress.journal.pop();
  }
}
