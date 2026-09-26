import type { Checkin, Habit } from '../db';
import { nextCount, widgetSnapshot } from '../widget-data';

const base = { icon: 'droplet', color: 'dustyBlue', days_mask: 127, times_per_week: 3, interval_days: 2, reminder_time: null, archived: 0, created_at: '2026-09-01' } as const;
const water: Habit = { ...base, id: 1, name: 'Water', schedule_type: 'daily', per_day: 6 };
const read: Habit = { ...base, id: 2, name: 'Read', schedule_type: 'weekdays', days_mask: 0b0000010, per_day: 1 }; // Mondays
const row = (id: number, habit_id: number, date: string, count: number): Checkin => ({ id, habit_id, date, count });

describe('widgetSnapshot', () => {
  it('lists only what is due today, with counts', () => {
    // 2026-09-26 is a Saturday: Read (Mondays) is not due.
    const s = widgetSnapshot([water, read], [row(1, 1, '2026-09-26', 4)], '2026-09-26');
    expect(s.items.map((i) => i.name)).toEqual(['Water']);
    expect(s.items[0]).toMatchObject({ count: 4, perDay: 6, done: false });
    expect(s).toMatchObject({ done: 0, total: 1 });
  });

  it('a partial day does not light the fire; a full one does', () => {
    const partial = widgetSnapshot([water], [row(1, 1, '2026-09-25', 6), row(2, 1, '2026-09-26', 5)], '2026-09-26');
    expect(partial).toMatchObject({ streak: 1, state: 'waiting' });
    const full = widgetSnapshot([water], [row(1, 1, '2026-09-25', 6), row(2, 1, '2026-09-26', 6)], '2026-09-26');
    expect(full).toMatchObject({ streak: 2, state: 'lit', done: 1, rank: 'Spark' });
  });
});

describe('nextCount', () => {
  it('adds one, and a full circle undoes the last tap', () => {
    expect(nextCount(0, 1)).toBe(1);
    expect(nextCount(1, 1)).toBe(0);
    expect(nextCount(3, 6)).toBe(4);
    expect(nextCount(6, 6)).toBe(5);
  });
});
