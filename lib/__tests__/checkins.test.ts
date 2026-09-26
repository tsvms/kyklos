import { groupCheckins } from '../db';

describe('groupCheckins', () => {
  const habits = [
    { id: 1, per_day: 1 },
    { id: 2, per_day: 8 },
  ];

  it('a day is done only once it reaches the daily target', () => {
    const done = groupCheckins(
      [
        { id: 1, habit_id: 1, date: '2026-09-21', count: 1 },
        { id: 2, habit_id: 2, date: '2026-09-21', count: 5 },
        { id: 3, habit_id: 2, date: '2026-09-22', count: 8 },
        { id: 4, habit_id: 2, date: '2026-09-23', count: 9 },
      ],
      habits,
    );
    expect([...(done.get(1) ?? [])]).toEqual(['2026-09-21']);
    expect([...(done.get(2) ?? [])]).toEqual(['2026-09-22', '2026-09-23']);
  });
});
