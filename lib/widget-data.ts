// What the home-screen widgets show, computed from the same rows the app
// reads. Pure, so both platforms' widgets (and tests) share one source.
import type { DateKey } from './date';
import { groupCheckins, type Checkin, type Habit } from './db';
import { rankFor } from './ranks';
import { isDue } from './schedule';
import { dailyStreak, flameState, type FlameState } from './stats';

export interface WidgetItem {
  id: number;
  name: string;
  color: string;
  /** Times done today and how many make the day. */
  count: number;
  perDay: number;
  done: boolean;
}

export interface WidgetSnapshot {
  streak: number;
  state: FlameState;
  rank: string;
  /** Habits due today that are complete, out of those due. */
  done: number;
  total: number;
  items: WidgetItem[];
}

export function widgetSnapshot(habits: Habit[], rows: Checkin[], today: DateKey): WidgetSnapshot {
  const doneMap = groupCheckins(rows, habits);
  const counts = new Map(rows.filter((r) => r.date === today).map((r) => [r.habit_id, r.count]));
  const fire = dailyStreak(habits, doneMap, today);

  const items = habits
    .filter((h) => isDue(h, today, doneMap.get(h.id) ?? new Set()))
    .map((h) => {
      const count = counts.get(h.id) ?? 0;
      return { id: h.id, name: h.name, color: h.color, count, perDay: h.per_day, done: count >= h.per_day };
    });

  return {
    streak: fire.count,
    state: flameState(fire.count, fire.doneToday),
    rank: rankFor(fire.count).name,
    done: items.filter((i) => i.done).length,
    total: items.length,
    items,
  };
}

/** Same rule as the circle in the app: tap adds one; a full circle undoes the last tap. */
export function nextCount(count: number, perDay: number): number {
  return count >= perDay ? perDay - 1 : count + 1;
}
