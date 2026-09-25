import { addDays, daysBetween, range, startOfWeek, type DateKey } from './date';
import { isDue, type Schedule } from './schedule';

type Done = ReadonlySet<DateKey>;

function weekCount(weekStart: DateKey, done: Done): number {
  let n = 0;
  for (let i = 0; i < 7; i++) if (done.has(addDays(weekStart, i))) n++;
  return n;
}

/** First week may start mid-week: never ask for more days than existed. */
function weekTarget(habit: Schedule, weekStart: DateKey): number {
  const target = Math.max(1, habit.times_per_week);
  if (habit.created_at <= weekStart) return target;
  const available = 7 - daysBetween(weekStart, habit.created_at);
  return Math.min(target, Math.max(1, available));
}

/**
 * Consecutive completions of due occurrences, counted back from today.
 * Today being still open never breaks a streak — you have until midnight.
 * Weekly habits count check-ins across consecutive weeks that met the target
 * (the current week is in progress, so it adds but never breaks).
 */
export function currentStreak(habit: Schedule, done: Done, today: DateKey): number {
  if (today < habit.created_at) return 0;

  if (habit.schedule_type === 'weekly') {
    let streak = 0;
    const thisWeek = startOfWeek(today);
    for (let w = thisWeek; addDays(w, 6) >= habit.created_at; w = addDays(w, -7)) {
      const count = weekCount(w, done);
      if (w === thisWeek || count >= weekTarget(habit, w)) streak += count;
      else break;
    }
    return streak;
  }

  let streak = 0;
  for (let d = today; d >= habit.created_at; d = addDays(d, -1)) {
    if (!isDue(habit, d)) continue;
    if (done.has(d)) streak++;
    else if (d !== today) break;
  }
  return streak;
}

export function bestStreak(habit: Schedule, done: Done, today: DateKey): number {
  if (today < habit.created_at) return 0;
  let best = 0;
  let run = 0;

  if (habit.schedule_type === 'weekly') {
    const thisWeek = startOfWeek(today);
    for (let w = startOfWeek(habit.created_at); w <= thisWeek; w = addDays(w, 7)) {
      const count = weekCount(w, done);
      if (w === thisWeek || count >= weekTarget(habit, w)) run += count;
      else run = 0;
      best = Math.max(best, run);
    }
    return best;
  }

  for (const d of range(habit.created_at, today)) {
    if (!isDue(habit, d)) continue;
    if (done.has(d)) run++;
    else if (d !== today) run = 0;
    best = Math.max(best, run);
  }
  return best;
}

/**
 * Share of due occurrences completed in the last `days` days (0…1), or
 * null when nothing has been due yet. An unchecked today is left out.
 */
export function completionRate(habit: Schedule, done: Done, today: DateKey, days = 30): number | null {
  const windowStart = [addDays(today, -(days - 1)), habit.created_at].sort().pop()!;
  if (windowStart > today) return null;
  const end = done.has(today) ? today : addDays(today, -1);
  if (end < windowStart) return null;
  const window = range(windowStart, end);

  if (habit.schedule_type === 'weekly') {
    const expected = (Math.max(1, habit.times_per_week) * window.length) / 7;
    const got = window.filter((d) => done.has(d)).length;
    return Math.min(1, got / expected);
  }

  const due = window.filter((d) => isDue(habit, d));
  if (due.length === 0) return null;
  return due.filter((d) => done.has(d)).length / due.length;
}

/** Check-ins this Monday–Sunday week vs. the weekly target. */
export function weekProgress(habit: Schedule, done: Done, today: DateKey) {
  const w = startOfWeek(today);
  return { done: weekCount(w, done), target: weekTarget(habit, w) };
}

/** Total check-ins per week for the last `weeks` weeks, oldest first. */
export function weeklyTotals(dates: Iterable<DateKey>, today: DateKey, weeks = 8) {
  const thisWeek = startOfWeek(today);
  const buckets = Array.from({ length: weeks }, (_, i) => ({
    weekStart: addDays(thisWeek, -7 * (weeks - 1 - i)),
    count: 0,
  }));
  const first = buckets[0].weekStart;
  for (const d of dates) {
    if (d < first || d > addDays(thisWeek, 6)) continue;
    const idx = Math.floor(daysBetween(first, d) / 7);
    buckets[idx].count++;
  }
  return buckets;
}

// ——— across habits ———

export type Tracked = Schedule & { id: number };
const NONE: ReadonlySet<DateKey> = new Set();

/** How many of the habits due on `day` were completed. */
export function dayCompletion(habits: Tracked[], done: ReadonlyMap<number, ReadonlySet<DateKey>>, day: DateKey) {
  let total = 0;
  let completed = 0;
  for (const h of habits) {
    const d = done.get(h.id) ?? NONE;
    if (!isDue(h, day, d)) continue;
    total++;
    if (d.has(day)) completed++;
  }
  return { done: completed, total };
}

/**
 * Consecutive days on which *everything* due was done. Days with nothing
 * due are skipped (a rest day never breaks it) and an open today is forgiven.
 */
export function perfectDayStreak(habits: Tracked[], done: ReadonlyMap<number, ReadonlySet<DateKey>>, today: DateKey) {
  if (habits.length === 0) return 0;
  const earliest = habits.reduce((m, h) => (h.created_at < m ? h.created_at : m), today);
  let streak = 0;
  for (let d = today; d >= earliest; d = addDays(d, -1)) {
    const { done: c, total } = dayCompletion(habits, done, d);
    if (total === 0) continue;
    if (c === total) streak++;
    else if (d !== today) break;
  }
  return streak;
}

/**
 * The app-wide fire: consecutive days on which at least one due habit was
 * done. Days with nothing due are skipped (they never break it) and an open
 * today is forgiven until midnight.
 */
export function dailyStreak(habits: Tracked[], done: ReadonlyMap<number, ReadonlySet<DateKey>>, today: DateKey) {
  const doneToday = dayCompletion(habits, done, today).done > 0;
  if (habits.length === 0) return { count: 0, doneToday };
  const earliest = habits.reduce((m, h) => (h.created_at < m ? h.created_at : m), today);
  let count = 0;
  for (let d = today; d >= earliest; d = addDays(d, -1)) {
    const { done: c, total } = dayCompletion(habits, done, d);
    if (c > 0) count++;
    else if (total > 0 && d !== today) break;
  }
  return { count, doneToday };
}

/** The longest app-wide fire ever kept (same rules as `dailyStreak`). */
export function bestDailyStreak(habits: Tracked[], done: ReadonlyMap<number, ReadonlySet<DateKey>>, today: DateKey) {
  if (habits.length === 0) return 0;
  const earliest = habits.reduce((m, h) => (h.created_at < m ? h.created_at : m), today);
  let best = 0;
  let run = 0;
  for (const d of range(earliest, today)) {
    const { done: c, total } = dayCompletion(habits, done, d);
    if (c > 0) run++;
    else if (total > 0 && d !== today) run = 0;
    best = Math.max(best, run);
  }
  return best;
}

export type FlameState = 'lit' | 'waiting' | 'out';

/**
 * Lit: the streak is alive and today is already done.
 * Waiting: alive from yesterday, today still open — keep it going.
 * Out: no streak.
 */
export function flameState(streak: number, doneToday: boolean): FlameState {
  if (streak === 0) return 'out';
  return doneToday ? 'lit' : 'waiting';
}

// ——— milestones (streak psychology only: no points, no badges) ———

export const MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 250, 365, 500, 730, 1000] as const;

export function isMilestone(n: number): boolean {
  return (MILESTONES as readonly number[]).includes(n) || (n > 1000 && n % 365 === 0);
}

/** The next gentle target above `n`. */
export function nextMilestone(n: number): number {
  return MILESTONES.find((m) => m > n) ?? Math.ceil((n + 1) / 365) * 365;
}

/** The milestone just reached or passed (0 when none yet). */
export function previousMilestone(n: number): number {
  let prev = 0;
  for (const m of MILESTONES) if (m <= n) prev = m;
  return prev;
}
