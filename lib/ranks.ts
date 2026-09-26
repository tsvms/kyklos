// Streak ranks: the longer the fire burns, the higher the rank.
// Thresholds are consecutive days (or, for weekly habits, consecutive
// check-ins across weeks that met their target).

export type RankId =
  | 'coal'
  | 'spark'
  | 'flame'
  | 'blaze'
  | 'torch'
  | 'beacon'
  | 'volcano'
  | 'phoenix'
  | 'sun'
  | 'olympian';

export interface Rank {
  id: RankId;
  /** Streak needed to reach this rank. */
  min: number;
  /** Emblem colour. */
  color: string;
  name: string;
}

export const RANKS: readonly Rank[] = [
  { id: 'coal', min: 0, color: '#8C857B', name: 'Coal' },
  { id: 'spark', min: 1, color: '#F2A541', name: 'Spark' },
  { id: 'flame', min: 3, color: '#FF8A3D', name: 'Flame' },
  { id: 'blaze', min: 7, color: '#FF6A2B', name: 'Blaze' },
  { id: 'torch', min: 14, color: '#EF4E2B', name: 'Torch' },
  { id: 'beacon', min: 30, color: '#E23D4B', name: 'Beacon' },
  { id: 'volcano', min: 60, color: '#C62F5C', name: 'Volcano' },
  { id: 'phoenix', min: 100, color: '#A43AD1', name: 'Phoenix' },
  { id: 'sun', min: 200, color: '#E9A800', name: 'Sun' },
  { id: 'olympian', min: 365, color: '#2F9BEA', name: 'Olympian' },
];

/** Position of the rank reached with `streak` (0 = Coal). */
export function rankIndex(streak: number): number {
  let i = 0;
  for (let k = 0; k < RANKS.length; k++) if (streak >= RANKS[k].min) i = k;
  return i;
}

export function rankFor(streak: number): Rank {
  return RANKS[rankIndex(streak)];
}

/**
 * How far `streak` has come towards the next rank.
 * At the top rank `next` is null and progress is 1.
 */
export function rankProgress(streak: number): { rank: Rank; next: Rank | null; progress: number; toGo: number } {
  const i = rankIndex(streak);
  const rank = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  if (!next) return { rank, next, progress: 1, toGo: 0 };
  // Measured from zero so the bar is never empty once the fire is lit.
  const progress = streak / next.min;
  return { rank, next, progress: Math.max(0, Math.min(1, progress)), toGo: next.min - streak };
}

/** True when going from `before` to `after` crosses into a new rank. */
export function rankedUp(before: number, after: number): boolean {
  return after > before && rankIndex(after) > rankIndex(before);
}
