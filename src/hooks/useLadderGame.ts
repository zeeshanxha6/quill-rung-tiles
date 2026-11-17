import { useCallback, useMemo, useRef, useState } from 'react';

import {
  DROPS_ON_PAR,
  DROPS_OVER_PAR,
  DROPS_UNDER_PAR,
  HINT_COST,
  RUNG_ALLOWANCE_EXTRA,
} from '../constants/config';
import {
  checkCandidate,
  diffIndex,
  parHint,
  RejectReason,
  replaceAt,
  verdictFor,
} from '../game/ladderLogic';
import type { Ladder } from '../game/ladders';
import {
  addJournal,
  earnInk,
  getInk,
  recordFailed,
  recordSolved,
  spendInk,
} from '../game/store';

export type RoundResult = {
  won: boolean;
  path: string[];
  parPath: string[];
  moves: number;
  par: number;
  drops: number;
  book: number;
};

export type LadderGame = ReturnType<typeof useLadderGame>;

export function useLadderGame(
  ladder: Ladder,
  onFinish: (result: RoundResult) => void,
) {
  const [path, setPath] = useState<string[]>([ladder.start]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reject, setReject] = useState<RejectReason>(null);
  const [rejectTick, setRejectTick] = useState(0);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [ink, setInk] = useState(getInk());
  const [solving, setSolving] = useState(false);

  /** Read inside animation / timer callbacks — never from state. */
  const finishedRef = useRef(false);
  const pathRef = useRef(path);
  pathRef.current = path;

  const current = path[path.length - 1];
  const moves = path.length - 1;
  const allowance = ladder.par + RUNG_ALLOWANCE_EXTRA;
  const rungsLeft = Math.max(0, allowance - moves);
  const cols = ladder.start.length;

  const changedIndex = useMemo(() => {
    if (path.length < 2) {
      return -1;
    }
    return diffIndex(path[path.length - 2], current);
  }, [path, current]);

  const finish = useCallback(
    (won: boolean) => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      const finalPath = pathRef.current;
      const finalMoves = finalPath.length - 1;
      const verdict = verdictFor(finalMoves, ladder.par);
      let drops = 0;
      if (won) {
        drops =
          verdict === 'under'
            ? DROPS_UNDER_PAR
            : verdict === 'match'
            ? DROPS_ON_PAR
            : DROPS_OVER_PAR;
        earnInk(drops);
        recordSolved(ladder.book, verdict === 'under');
      } else {
        recordFailed();
      }
      onFinish({
        won,
        path: finalPath,
        parPath: ladder.parPath,
        moves: finalMoves,
        par: ladder.par,
        drops,
        book: ladder.book,
      });
    },
    [ladder, onFinish],
  );

  const bounce = useCallback((reason: RejectReason) => {
    setReject(reason);
    setRejectTick(t => t + 1);
  }, []);

  const selectPosition = useCallback(
    (index: number) => {
      if (finishedRef.current || solving) {
        return;
      }
      if (ladder.lockedMask.indexOf(index) !== -1) {
        bounce('locked');
        return;
      }
      setReject(null);
      setSelectedIndex(prev => (prev === index ? null : index));
    },
    [bounce, ladder.lockedMask, solving],
  );

  const commit = useCallback(
    (index: number, letter: string) => {
      const base = pathRef.current;
      const cur = base[base.length - 1];
      const candidate = replaceAt(cur, index, letter);
      const reason = checkCandidate(candidate, cur, base);
      if (reason) {
        bounce(reason);
        return false;
      }
      const next = [...base, candidate];
      pathRef.current = next;
      setPath(next);
      setReject(null);
      setSelectedIndex(null);
      setHintIndex(null);
      addJournal(candidate);

      if (candidate === ladder.target) {
        setSolving(true);
        setTimeout(() => finish(true), 900);
      } else if (next.length - 1 >= ladder.par + RUNG_ALLOWANCE_EXTRA) {
        setTimeout(() => finish(false), 520);
      }
      return true;
    },
    [bounce, finish, ladder.par, ladder.target],
  );

  const pressKey = useCallback(
    (letter: string) => {
      if (finishedRef.current || solving) {
        return;
      }
      if (selectedIndex === null) {
        bounce('nopos');
        return;
      }
      commit(selectedIndex, letter);
    },
    [bounce, commit, selectedIndex, solving],
  );

  const undo = useCallback(() => {
    if (finishedRef.current || solving) {
      return;
    }
    const base = pathRef.current;
    if (base.length <= 1) {
      bounce('nothing');
      return;
    }
    const next = base.slice(0, base.length - 1);
    pathRef.current = next;
    setPath(next);
    setSelectedIndex(null);
    setHintIndex(null);
    setReject(null);
  }, [bounce, solving]);

  /** Spends one ink drop and plays the next par rung for the climber. */
  const useHint = useCallback(() => {
    if (finishedRef.current || solving) {
      return;
    }
    const base = pathRef.current;
    const cur = base[base.length - 1];
    const tip = parHint(cur, ladder.parPath);
    if (!tip) {
      bounce('unknown');
      return;
    }
    if (!spendInk(HINT_COST)) {
      bounce('noink');
      return;
    }
    setInk(getInk());
    setHintIndex(tip.index);
    setSelectedIndex(tip.index);
    commit(tip.index, tip.letter);
  }, [bounce, commit, ladder.parPath, solving]);

  const giveUp = useCallback(() => {
    finish(false);
  }, [finish]);

  return {
    cols,
    path,
    current,
    moves,
    rungsLeft,
    allowance,
    changedIndex,
    selectedIndex,
    hintIndex,
    reject,
    rejectTick,
    ink,
    solving,
    selectPosition,
    pressKey,
    undo,
    useHint,
    giveUp,
  };
}
