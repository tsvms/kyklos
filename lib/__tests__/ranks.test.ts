import { maskFromDays, type Schedule } from '../schedule';
import { RANKS, rankFor, rankProgress, rankedUp } from '../ranks';
import { bestDailyStreak, dailyStreak, flameState } from '../stats';

// Fixture week: Monday 2026-09-21 … Sunday 2026-09-27.
const MON = '2026-09-21';
const TUE = '2026-09-22';
const WED = '2026-09-23';
const THU = '2026-09-24';
const FRI = '2026-09-25';
const SAT = '2026-09-26';

const base: Schedule = { schedule_type: 'daily', days_mask: 0, times_per_week: 1, interval_days: 1, created_at: MON };
const water = { ...base, id: 1 };
const read = { ...base, id: 2, schedule_type: 'weekdays' as const, days_mask: maskFromDays([1, 3, 5]) };

describe('ranks', () => {
  test('thresholds are strictly increasing and start at 0', () => {
    expect(RANKS[0].min).toBe(0);
    for (let i = 1; i < RANKS.length; i++) expect(RANKS[i].min).toBeGreaterThan(RANKS[i - 1].min);
  });

  test('rank boundaries', () => {
    expect(rankFor(0).id).toBe('coal');
    expect(rankFor(1).id).toBe('spark');
    expect(rankFor(6).id).toBe('flame');
    expect(rankFor(7).id).toBe('blaze');
    expect(rankFor(365).id).toBe('olympian');
    expect(rankFor(5000).id).toBe('olympian');
  });

  test('progress towards the next rank', () => {
    expect(rankProgress(5)).toMatchObject({ next: { id: 'blaze' }, toGo: 2 });
    expect(rankProgress(5).progress).toBeCloseTo(5 / 7);
    expect(rankProgress(0).progress).toBe(0);
    expect(rankProgress(400)).toMatchObject({ next: null, progress: 1, toGo: 0 });
  });

  test('rank-up only when a threshold is crossed upwards', () => {
    expect(rankedUp(6, 7)).toBe(true);
    expect(rankedUp(7, 8)).toBe(false);
    expect(rankedUp(7, 6)).toBe(false);
  });
});

describe('app-wide daily streak', () => {
  test('one habit done per day keeps the fire going; open today is forgiven', () => {
    const done = new Map([[1, new Set([MON, TUE, WED])]]);
    expect(dailyStreak([water], done, WED)).toEqual({ count: 3, doneToday: true });
    expect(dailyStreak([water], done, THU)).toEqual({ count: 3, doneToday: false });
    expect(dailyStreak([water], done, FRI)).toEqual({ count: 0, doneToday: false });
  });

  test('days with nothing due never break it', () => {
    // Only "read" (Mon/Wed/Fri): Tue and Thu are rest days.
    const done = new Map([[2, new Set([MON, WED, FRI])]]);
    expect(dailyStreak([read], done, SAT).count).toBe(3);
  });

  test('best streak survives a later break', () => {
    const done = new Map([[1, new Set([MON, TUE, WED, FRI])]]);
    expect(bestDailyStreak([water], done, SAT)).toBe(3);
    expect(dailyStreak([water], done, SAT).count).toBe(1);
  });

  test('no habits, no fire', () => {
    expect(dailyStreak([], new Map(), MON)).toEqual({ count: 0, doneToday: false });
  });

  test('flame state', () => {
    expect(flameState(0, false)).toBe('out');
    expect(flameState(4, false)).toBe('waiting');
    expect(flameState(4, true)).toBe('lit');
  });
});
