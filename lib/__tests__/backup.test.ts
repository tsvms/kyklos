import { parseBackup } from '../backup';

const habit = {
  id: 1,
  name: 'Read',
  icon: 'book-open',
  color: 'terracotta',
  schedule_type: 'weekdays',
  days_mask: 42,
  times_per_week: 3,
  interval_days: 2,
  reminder_time: '21:00',
  archived: 0,
  created_at: '2026-09-01',
};
const valid = {
  app: 'Kyklos',
  exportedOn: '2026-09-24',
  habits: [habit],
  checkins: [{ id: 9, habit_id: 1, date: '2026-09-21' }],
};

describe('parseBackup', () => {
  it('accepts a real export (round-trip shape)', () => {
    const b = parseBackup(JSON.stringify(valid));
    expect(b?.habits).toHaveLength(1);
    expect(b?.checkins).toEqual([{ habit_id: 1, date: '2026-09-21', count: 1 }]);
    expect(b?.habits[0].per_day).toBe(1); // older backups: a simple check
    expect(b?.exportedOn).toBe('2026-09-24');
  });

  it('rejects anything that is not a Kyklos backup', () => {
    expect(parseBackup('not json')).toBeNull();
    expect(parseBackup('{}')).toBeNull();
    expect(parseBackup(JSON.stringify({ ...valid, app: 'Other' }))).toBeNull();
  });

  it('rejects the whole file if one row is broken', () => {
    expect(parseBackup(JSON.stringify({ ...valid, habits: [{ ...habit, schedule_type: 'hourly' }] }))).toBeNull();
    expect(parseBackup(JSON.stringify({ ...valid, habits: [{ ...habit, reminder_time: '25:00' }] }))).toBeNull();
    expect(parseBackup(JSON.stringify({ ...valid, checkins: [{ habit_id: 2, date: '2026-09-21' }] }))).toBeNull();
    expect(parseBackup(JSON.stringify({ ...valid, checkins: [{ habit_id: 1, date: '21/09/2026' }] }))).toBeNull();
  });

  it('keeps "N times a day" habits and their counts', () => {
    const b = parseBackup(
      JSON.stringify({ ...valid, habits: [{ ...habit, per_day: 8 }], checkins: [{ habit_id: 1, date: '2026-09-21', count: 5 }] }),
    );
    expect(b?.habits[0].per_day).toBe(8);
    expect(b?.checkins[0].count).toBe(5);
    expect(parseBackup(JSON.stringify({ ...valid, habits: [{ ...habit, per_day: 0 }] }))).toBeNull();
  });

  it('softens what is safe to soften', () => {
    const b = parseBackup(
      JSON.stringify({
        ...valid,
        habits: [{ ...habit, color: 'neon', name: '  Read  ' }],
        checkins: [valid.checkins[0], valid.checkins[0]],
      }),
    );
    expect(b?.habits[0].color).toBe('stone');
    expect(b?.habits[0].name).toBe('Read');
    expect(b?.checkins).toHaveLength(1);
  });
});
