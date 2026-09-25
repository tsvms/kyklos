import { maskFromDays } from '../schedule';
import { MAX_PENDING, reminderPlan, type Remindable } from '../reminders';

const base: Remindable = {
  id: 1,
  archived: 0,
  reminder_time: '21:00',
  schedule_type: 'daily',
  days_mask: 127,
  times_per_week: 3,
  interval_days: 2,
  created_at: '2026-09-01',
};
const THU_NOON = new Date(2026, 8, 24, 12, 0);
const keys = (p: { at: Date }[]) =>
  p.map((x) => `${x.at.getMonth() + 1}/${x.at.getDate()} ${x.at.getHours()}:${String(x.at.getMinutes()).padStart(2, '0')}`);

describe('reminderPlan', () => {
  it('"Read" Mon/Wed/Fri 21:00 is only planned on those days', () => {
    const read = { ...base, schedule_type: 'weekdays' as const, days_mask: maskFromDays([1, 3, 5]) };
    expect(keys(reminderPlan([read], new Map(), THU_NOON)).slice(0, 3)).toEqual(['9/25 21:00', '9/28 21:00', '9/30 21:00']);
  });

  it('skips today once it is done, and past times', () => {
    const done = new Map([[1, new Set(['2026-09-24'])]]);
    expect(keys(reminderPlan([base], done, THU_NOON))[0]).toBe('9/25 21:00');
    expect(keys(reminderPlan([base], new Map(), THU_NOON))[0]).toBe('9/24 21:00');
    expect(keys(reminderPlan([base], new Map(), new Date(2026, 8, 24, 22)))[0]).toBe('9/25 21:00');
  });

  it('ignores archived habits and habits without a time', () => {
    expect(reminderPlan([{ ...base, archived: 1 }, { ...base, id: 2, reminder_time: null }], new Map(), THU_NOON)).toEqual([]);
  });

  it('stops a weekly habit once the target is met', () => {
    const weekly = { ...base, schedule_type: 'weekly' as const, times_per_week: 2 };
    const done = new Map([[1, new Set(['2026-09-21', '2026-09-22'])]]);
    expect(keys(reminderPlan([weekly], done, THU_NOON))[0]).toBe('9/28 21:00');
  });

  it('never exceeds the iOS pending limit, soonest first', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ ...base, id: i + 1 }));
    const plan = reminderPlan(many, new Map(), THU_NOON);
    expect(plan).toHaveLength(MAX_PENDING);
    expect(plan.every((p, i) => i === 0 || p.at >= plan[i - 1].at)).toBe(true);
  });
});
