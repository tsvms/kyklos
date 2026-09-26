// Pure validation of a Kyklos JSON backup. Nothing here touches the database:
// a file that fails any check is rejected as a whole, so a bad import can
// never leave the phone half-restored.
import { MAX_PER_DAY, type Checkin, type Habit } from './db';
import type { ScheduleType } from './schedule';
import { HABIT_COLOR_KEYS, type HabitColor } from './theme';

export interface Backup {
  exportedOn: string;
  habits: Habit[];
  checkins: Omit<Checkin, 'id'>[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const TYPES: ScheduleType[] = ['daily', 'weekly', 'weekdays', 'interval'];

const int = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

function habitFrom(raw: unknown): Habit | null {
  if (!raw || typeof raw !== 'object') return null;
  const h = raw as Record<string, unknown>;
  if (!int(h.id, 1, Number.MAX_SAFE_INTEGER)) return null;
  if (typeof h.name !== 'string' || !h.name.trim() || h.name.length > 80) return null;
  if (typeof h.icon !== 'string' || h.icon.length > 40) return null;
  if (!TYPES.includes(h.schedule_type as ScheduleType)) return null;
  if (!int(h.days_mask, 0, 127) || !int(h.times_per_week, 1, 7) || !int(h.interval_days, 1, 365)) return null;
  if (h.reminder_time !== null && !(typeof h.reminder_time === 'string' && TIME.test(h.reminder_time))) return null;
  if (typeof h.created_at !== 'string' || !DATE.test(h.created_at)) return null;
  // Older backups have no per_day: those habits were simple checks.
  if (h.per_day !== undefined && !int(h.per_day, 1, MAX_PER_DAY)) return null;
  return {
    id: h.id as number,
    name: h.name.trim(),
    icon: h.icon,
    color: HABIT_COLOR_KEYS.includes(h.color as HabitColor) ? (h.color as HabitColor) : 'stone',
    schedule_type: h.schedule_type as ScheduleType,
    days_mask: h.days_mask as number,
    times_per_week: h.times_per_week as number,
    interval_days: h.interval_days as number,
    per_day: (h.per_day as number | undefined) ?? 1,
    reminder_time: (h.reminder_time as string | null) ?? null,
    archived: h.archived === 1 ? 1 : 0,
    created_at: h.created_at,
  };
}

/** Returns the backup, or null if the file is not a valid Kyklos export. */
export function parseBackup(text: string): Backup | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;
  if (b.app !== 'Kyklos' || !Array.isArray(b.habits) || !Array.isArray(b.checkins)) return null;

  const habits: Habit[] = [];
  for (const r of b.habits) {
    const h = habitFrom(r);
    if (!h) return null;
    habits.push(h);
  }
  const ids = new Set(habits.map((h) => h.id));
  if (ids.size !== habits.length) return null;

  const seen = new Set<string>();
  const checkins: Omit<Checkin, 'id'>[] = [];
  for (const r of b.checkins) {
    if (!r || typeof r !== 'object') return null;
    const c = r as Record<string, unknown>;
    if (!ids.has(c.habit_id as number) || typeof c.date !== 'string' || !DATE.test(c.date)) return null;
    if (c.count !== undefined && !int(c.count, 1, 999)) return null;
    const key = `${c.habit_id}|${c.date}`;
    if (seen.has(key)) continue; // duplicates are harmless; keep one
    seen.add(key);
    checkins.push({ habit_id: c.habit_id as number, date: c.date, count: (c.count as number | undefined) ?? 1 });
  }

  const exportedOn = typeof b.exportedOn === 'string' && DATE.test(b.exportedOn) ? b.exportedOn : '';
  return { exportedOn, habits, checkins };
}
