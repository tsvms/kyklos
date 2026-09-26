import { addDays, daysBetween, startOfWeek, toKey, weekday } from '../date';
import { dueDates, isDue, maskFromDays, type Schedule } from '../schedule';
import { bestStreak, completionRate, currentStreak, dayCompletion, isMilestone, weekProgress, weeklyTotals } from '../stats';
import { upper } from '../text';

// Fixture week: Monday 2026-09-21 … Sunday 2026-09-27.
const MON = '2026-09-21';
const TUE = '2026-09-22';
const WED = '2026-09-23';
const THU = '2026-09-24';
const FRI = '2026-09-25';
const SAT = '2026-09-26';
const SUN = '2026-09-27';
const WEEK = [MON, TUE, WED, THU, FRI, SAT, SUN];

const base: Schedule = {
  schedule_type: 'daily',
  days_mask: 0,
  times_per_week: 1,
  interval_days: 1,
  created_at: '2026-09-01',
};

describe('date helpers', () => {
  it('knows the fixture weekdays', () => {
    expect(weekday(MON)).toBe(1);
    expect(weekday(SUN)).toBe(0);
    expect(startOfWeek(SUN)).toBe(MON);
    expect(startOfWeek(MON)).toBe(MON);
  });

  it('counts days across a DST change without drifting', () => {
    // EU clocks go back on 2026-10-25.
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2);
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2);
  });

  it('accepts Date objects', () => {
    expect(dueDates(base, new Date(2026, 8, 23, 23, 59))).toEqual([WED]);
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('dueDates — daily', () => {
  it('is due every day', () => {
    expect(dueDates(base, MON, 7)).toEqual(WEEK);
  });

  it('is never due before the habit existed', () => {
    const h = { ...base, created_at: WED };
    expect(dueDates(h, MON, 7)).toEqual([WED, THU, FRI, SAT, SUN]);
  });
});

describe('dueDates — specific weekdays', () => {
  const read: Schedule = { ...base, schedule_type: 'weekdays', days_mask: maskFromDays([1, 3, 5]) };

  it('"Read" Mon/Wed/Fri appears only on those days', () => {
    expect(dueDates(read, MON, 7)).toEqual([MON, WED, FRI]);
    expect(isDue(read, TUE)).toBe(false);
    expect(isDue(read, SUN)).toBe(false);
  });

  it('handles weekends-only', () => {
    const h = { ...read, days_mask: maskFromDays([0, 6]) };
    expect(dueDates(h, MON, 7)).toEqual([SAT, SUN]);
  });

  it('an empty mask is never due', () => {
    expect(dueDates({ ...read, days_mask: 0 }, MON, 7)).toEqual([]);
  });
});

describe('dueDates — every N days', () => {
  it('counts from the creation date', () => {
    const h: Schedule = { ...base, schedule_type: 'interval', interval_days: 3, created_at: MON };
    expect(dueDates(h, MON, 10)).toEqual([MON, THU, SUN, addDays(SUN, 3)]);
  });

  it('every 1 day behaves like daily', () => {
    const h: Schedule = { ...base, schedule_type: 'interval', interval_days: 1 };
    expect(dueDates(h, MON, 7)).toEqual(WEEK);
  });

  it('keeps its rhythm across DST', () => {
    const h: Schedule = { ...base, schedule_type: 'interval', interval_days: 2, created_at: '2026-10-24' };
    expect(dueDates(h, '2026-10-24', 5)).toEqual(['2026-10-24', '2026-10-26', '2026-10-28']);
  });
});

describe('dueDates — X times per week', () => {
  const h: Schedule = { ...base, schedule_type: 'weekly', times_per_week: 3 };

  it('is due every day while the target is open', () => {
    expect(dueDates(h, MON, 7)).toEqual(WEEK);
  });

  it('stops being due once the week target is met elsewhere', () => {
    const done = [MON, TUE, WED];
    expect(isDue(h, THU, done)).toBe(false);
    // Days already checked stay due so Today can show them as done.
    expect(isDue(h, WED, done)).toBe(true);
  });

  it('resets on Monday', () => {
    expect(isDue(h, addDays(SUN, 1), [MON, TUE, WED])).toBe(true);
  });
});

describe('streaks', () => {
  const read: Schedule = { ...base, schedule_type: 'weekdays', days_mask: maskFromDays([1, 3, 5]) };

  it('3 consecutive completions = streak 3', () => {
    const done = new Set([MON, WED, FRI]);
    expect(currentStreak(read, done, FRI)).toBe(3);
    // Not-due days in between do not break it.
    expect(currentStreak(read, done, SUN)).toBe(3);
  });

  it('an open today does not break the streak', () => {
    const done = new Set([MON, WED]);
    expect(currentStreak(read, done, FRI)).toBe(2);
  });

  it('a missed due day breaks it', () => {
    const done = new Set([MON, FRI]);
    expect(currentStreak(read, done, FRI)).toBe(1);
    expect(bestStreak(read, done, FRI)).toBe(1);
  });

  it('best streak remembers the longest run', () => {
    const done = new Set(['2026-09-14', '2026-09-16', '2026-09-18', MON, FRI]);
    expect(bestStreak(read, done, FRI)).toBe(4); // 14,16,18,21 then 23 missed
    expect(currentStreak(read, done, FRI)).toBe(1);
  });

  it('daily streak', () => {
    const done = new Set([TUE, WED, THU]);
    expect(currentStreak(base, done, THU)).toBe(3);
    expect(currentStreak(base, done, FRI)).toBe(3);
    expect(currentStreak(base, done, SAT)).toBe(0);
  });

  it('weekly streak sums consecutive successful weeks', () => {
    const h: Schedule = { ...base, schedule_type: 'weekly', times_per_week: 2, created_at: '2026-09-07' };
    const done = new Set(['2026-09-08', '2026-09-10', '2026-09-15', '2026-09-17', MON]);
    expect(currentStreak(h, done, WED)).toBe(5);
    expect(weekProgress(h, done, WED)).toEqual({ done: 1, target: 2 });
  });
});

describe('completion rate', () => {
  it('ignores an unchecked today and days before creation', () => {
    const h = { ...base, created_at: MON };
    expect(completionRate(h, new Set([MON, TUE]), WED)).toBe(1);
    expect(completionRate(h, new Set([MON]), WED)).toBe(0.5);
  });

  it('is null when nothing was due yet', () => {
    expect(completionRate({ ...base, created_at: THU }, new Set(), THU)).toBeNull();
  });
});

describe('weekly totals', () => {
  it('buckets check-ins into Monday weeks', () => {
    const totals = weeklyTotals([MON, WED, '2026-09-14', '2020-01-01'], THU, 2);
    expect(totals).toEqual([
      { weekStart: '2026-09-14', count: 1 },
      { weekStart: MON, count: 2 },
    ]);
  });
});

describe('across habits', () => {
  const read: Schedule & { id: number } = { ...base, id: 1, schedule_type: 'weekdays', days_mask: maskFromDays([1, 3, 5]) };
  const water: Schedule & { id: number } = { ...base, id: 2 };

  it('counts what was due and done on a day', () => {
    const done = new Map([[1, new Set([MON])], [2, new Set<string>()]]);
    expect(dayCompletion([read, water], done, MON)).toEqual({ done: 1, total: 2 });
    expect(dayCompletion([read, water], done, TUE)).toEqual({ done: 0, total: 1 });
  });

});

describe('milestones', () => {
  it('knows the gentle targets', () => {
    expect(isMilestone(7)).toBe(true);
    expect(isMilestone(8)).toBe(false);
  });
});

describe('greek uppercase', () => {
  it('drops the tonos, keeps dialytika', () => {
    expect(upper('Όνομα')).toBe('ΟΝΟΜΑ');
    expect(upper('Εικονίδιο')).toBe('ΕΙΚΟΝΙΔΙΟ');
    expect(upper('Χρώμα')).toBe('ΧΡΩΜΑ');
    expect(upper('προΐστασθαι')).toBe('ΠΡΟΪΣΤΑΣΘΑΙ');
    expect(upper('Your data')).toBe('YOUR DATA');
  });
});
