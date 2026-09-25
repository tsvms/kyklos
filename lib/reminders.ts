// Pure reminder planning. Reminders are concrete dates over the next two weeks
// rather than OS-level repeats: that is the only way to skip a day that is
// already done, to support "every N days", and to stop a weekly habit once its
// target is met. The plan is rebuilt on every launch and after every change.
import { fromKey, toKey, type DateKey } from './date';
import { dueDates, type Schedule } from './schedule';

export const HORIZON_DAYS = 14;
/** iOS keeps at most 64 pending local notifications per app. */
export const MAX_PENDING = 60;

export interface Remindable extends Schedule {
  id: number;
  archived: number;
  reminder_time: string | null;
}

export function reminderPlan<H extends Remindable>(
  habits: H[],
  done: ReadonlyMap<number, ReadonlySet<DateKey>>,
  now: Date,
): { habit: H; at: Date }[] {
  const today = toKey(now);
  const plan: { habit: H; at: Date }[] = [];
  for (const habit of habits) {
    if (habit.archived || !habit.reminder_time) continue;
    const [hour, minute] = habit.reminder_time.split(':').map(Number);
    const d = done.get(habit.id) ?? new Set<DateKey>();
    for (const day of dueDates(habit, today, HORIZON_DAYS, d)) {
      if (d.has(day)) continue;
      const at = fromKey(day);
      at.setHours(hour, minute, 0, 0);
      if (at.getTime() > now.getTime()) plan.push({ habit, at });
    }
  }
  // Soonest first across all habits, so the OS limit trims the far future.
  return plan.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, MAX_PENDING);
}
