import { addDays, asKey, daysBetween, startOfWeek, weekday, type DateKey } from './date';

export type ScheduleType = 'daily' | 'weekly' | 'weekdays' | 'interval';

/** The subset of a habit row that decides when it is due. */
export interface Schedule {
  schedule_type: ScheduleType;
  /** Bit i set = due on weekday i (0 = Sunday … 6 = Saturday). */
  days_mask: number;
  /** For 'weekly': how many check-ins per Monday–Sunday week. */
  times_per_week: number;
  /** For 'interval': due every N days, counted from created_at. */
  interval_days: number;
  /** Local "YYYY-MM-DD". Nothing is due before a habit existed. */
  created_at: DateKey;
}

export const ALL_DAYS_MASK = 0b1111111;

export function maskFromDays(days: number[]): number {
  return days.reduce((m, d) => m | (1 << d), 0);
}

export function daysFromMask(mask: number): number[] {
  return [0, 1, 2, 3, 4, 5, 6].filter((d) => mask & (1 << d));
}

function isDueSingle(habit: Schedule, day: DateKey, done: ReadonlySet<DateKey>): boolean {
  if (day < habit.created_at) return false;

  switch (habit.schedule_type) {
    case 'daily':
      return true;

    case 'weekdays':
      return (habit.days_mask & (1 << weekday(day))) !== 0;

    case 'interval': {
      const n = Math.max(1, habit.interval_days);
      return daysBetween(habit.created_at, day) % n === 0;
    }

    case 'weekly': {
      // Due every day of the week until the weekly target is reached by
      // check-ins on *other* days. A day you already checked stays due, so
      // it keeps showing as done instead of vanishing from Today.
      let others = 0;
      for (let k = startOfWeek(day), i = 0; i < 7; k = addDays(k, 1), i++) {
        if (k !== day && done.has(k)) others++;
      }
      return others < Math.max(1, habit.times_per_week);
    }
  }
}

/**
 * Pure: returns every date in [date, date + span) on which `habit` is due.
 * With the default span of 1 the result is either `[date]` or `[]`.
 *
 * `completions` only matters for 'weekly' habits, whose due-ness depends on
 * how many check-ins already happened that week.
 */
export function dueDates(
  habit: Schedule,
  date: Date | DateKey,
  span = 1,
  completions: Iterable<DateKey> = [],
): DateKey[] {
  const done = completions instanceof Set ? completions : new Set(completions);
  const start = asKey(date);
  const out: DateKey[] = [];
  for (let i = 0; i < span; i++) {
    const day = addDays(start, i);
    if (isDueSingle(habit, day, done as ReadonlySet<DateKey>)) out.push(day);
  }
  return out;
}

export function isDue(habit: Schedule, date: Date | DateKey, completions?: Iterable<DateKey>): boolean {
  return dueDates(habit, date, 1, completions).length === 1;
}
