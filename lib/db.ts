import type { SQLiteDatabase } from 'expo-sqlite';
import type { Backup } from './backup';
import { toKey, todayKey, type DateKey } from './date';
import { t } from './i18n';
import { maskFromDays, type Schedule, type ScheduleType } from './schedule';
import type { HabitColor } from './theme';

export const DB_NAME = 'kyklos.db';
const DB_VERSION = 2;

export interface Habit extends Schedule {
  id: number;
  name: string;
  icon: string;
  color: HabitColor;
  schedule_type: ScheduleType;
  /** How many times a day make the day done (1 = a simple check). */
  per_day: number;
  reminder_time: string | null; // "HH:MM"
  archived: number; // 0 | 1
}

export type HabitInput = Omit<Habit, 'id' | 'archived' | 'created_at'>;

export interface Checkin {
  id: number;
  habit_id: number;
  date: DateKey;
  /** Times done that day; the day is complete once it reaches the habit's `per_day`. */
  count: number;
}

export const MAX_PER_DAY = 20;

export async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= DB_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily','weekly','weekdays','interval')),
        days_mask INTEGER NOT NULL DEFAULT 127,
        times_per_week INTEGER NOT NULL DEFAULT 3,
        interval_days INTEGER NOT NULL DEFAULT 2,
        reminder_time TEXT,
        archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        UNIQUE (habit_id, date)
      );
      CREATE INDEX IF NOT EXISTS checkins_date ON checkins(date);
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    `);
  }

  if (version < 2) {
    // "N times a day": existing habits and check-ins stay simple (1 of 1).
    await addColumn(db, 'habits', 'per_day', 'INTEGER NOT NULL DEFAULT 1');
    await addColumn(db, 'checkins', 'count', 'INTEGER NOT NULL DEFAULT 1');
  }

  if (version === 0) await seed(db);
  await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
}

/** Idempotent ALTER: a half-finished upgrade can simply run again. */
async function addColumn(db: SQLiteDatabase, table: string, column: string, type: string) {
  const cols = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (!cols.some((c) => c.name === column)) await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}

/** First launch only: three gentle examples. */
async function seed(db: SQLiteDatabase) {
  const today = todayKey();
  const examples: HabitInput[] = [
    {
      name: t('seed.read'),
      icon: 'book-open',
      color: 'terracotta',
      schedule_type: 'weekdays',
      days_mask: maskFromDays([1, 3, 5]),
      times_per_week: 3,
      interval_days: 2,
      per_day: 1,
      reminder_time: '21:00',
    },
    {
      name: t('seed.water'),
      icon: 'droplet',
      color: 'dustyBlue',
      schedule_type: 'daily',
      days_mask: 127,
      times_per_week: 7,
      interval_days: 1,
      per_day: 6,
      reminder_time: null,
    },
    {
      name: t('seed.walk'),
      icon: 'wind',
      color: 'sage',
      schedule_type: 'weekly',
      days_mask: 127,
      times_per_week: 3,
      interval_days: 2,
      per_day: 1,
      reminder_time: null,
    },
  ];
  for (const h of examples) await insertHabit(db, h, today);
}

async function insertHabit(db: SQLiteDatabase, h: HabitInput, createdAt: DateKey) {
  const res = await db.runAsync(
    `INSERT INTO habits (name, icon, color, schedule_type, days_mask, times_per_week, interval_days, per_day, reminder_time, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [h.name, h.icon, h.color, h.schedule_type, h.days_mask, h.times_per_week, h.interval_days, h.per_day, h.reminder_time, createdAt],
  );
  return res.lastInsertRowId;
}

// ——— habits ———

export function listHabits(db: SQLiteDatabase, { archived = false } = {}) {
  return db.getAllAsync<Habit>('SELECT * FROM habits WHERE archived = ? ORDER BY id', [archived ? 1 : 0]);
}

export function getHabit(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Habit>('SELECT * FROM habits WHERE id = ?', [id]);
}

export function createHabit(db: SQLiteDatabase, h: HabitInput) {
  return insertHabit(db, h, todayKey());
}

export async function updateHabit(db: SQLiteDatabase, id: number, h: HabitInput) {
  await db.withTransactionAsync(async () => {
    // A new daily target never rewrites history: days that were done stay done.
    const old = await db.getFirstAsync<{ per_day: number }>('SELECT per_day FROM habits WHERE id = ?', [id]);
    if (old && h.per_day > old.per_day) {
      await db.runAsync('UPDATE checkins SET count = ? WHERE habit_id = ? AND count >= ?', [h.per_day, id, old.per_day]);
    }
    await db.runAsync(
      `UPDATE habits SET name = ?, icon = ?, color = ?, schedule_type = ?, days_mask = ?, times_per_week = ?,
         interval_days = ?, per_day = ?, reminder_time = ? WHERE id = ?`,
      [h.name, h.icon, h.color, h.schedule_type, h.days_mask, h.times_per_week, h.interval_days, h.per_day, h.reminder_time, id],
    );
  });
}

export async function setArchived(db: SQLiteDatabase, id: number, archived: boolean) {
  await db.runAsync('UPDATE habits SET archived = ? WHERE id = ?', [archived ? 1 : 0, id]);
}

export async function deleteHabit(db: SQLiteDatabase, id: number) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM checkins WHERE habit_id = ?', [id]);
    await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
  });
}

// ——— check-ins ———

/** How many times the habit was done on `date`; 0 removes the check-in. */
export async function setCount(db: SQLiteDatabase, habitId: number, date: DateKey, count: number) {
  if (count > 0) {
    await db.runAsync(
      'INSERT INTO checkins (habit_id, date, count) VALUES (?, ?, ?) ON CONFLICT (habit_id, date) DO UPDATE SET count = excluded.count',
      [habitId, date, count],
    );
  } else {
    await db.runAsync('DELETE FROM checkins WHERE habit_id = ? AND date = ?', [habitId, date]);
  }
}

export function listCheckins(db: SQLiteDatabase, habitId?: number) {
  return habitId === undefined
    ? db.getAllAsync<Checkin>('SELECT * FROM checkins ORDER BY date')
    : db.getAllAsync<Checkin>('SELECT * FROM checkins WHERE habit_id = ? ORDER BY date', [habitId]);
}

/** habit_id → set of completed dates (days that reached the habit's `per_day`). */
export function groupCheckins(rows: Checkin[], habits: Pick<Habit, 'id' | 'per_day'>[]) {
  const perDay = new Map(habits.map((h) => [h.id, h.per_day]));
  const map = new Map<number, Set<DateKey>>();
  for (const r of rows) {
    if (r.count < (perDay.get(r.habit_id) ?? 1)) continue;
    let s = map.get(r.habit_id);
    if (!s) map.set(r.habit_id, (s = new Set()));
    s.add(r.date);
  }
  return map;
}

// ——— settings ———

export async function getSetting(db: SQLiteDatabase, key: string) {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
  return row?.value ?? null;
}

export async function setSetting(db: SQLiteDatabase, key: string, value: string) {
  await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
}

// ——— export ———

export async function exportData(db: SQLiteDatabase, appVersion: string) {
  const [active, archived, checkins] = await Promise.all([
    listHabits(db),
    listHabits(db, { archived: true }),
    listCheckins(db),
  ]);
  return {
    app: 'Kyklos',
    version: appVersion,
    exportedAt: new Date().toISOString(),
    exportedOn: toKey(new Date()),
    habits: [...active, ...archived],
    checkins,
  };
}

// ——— restore / erase (both all-or-nothing) ———

export async function restoreBackup(db: SQLiteDatabase, backup: Backup) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM checkins');
    await db.runAsync('DELETE FROM habits');
    for (const h of backup.habits) {
      await db.runAsync(
        `INSERT INTO habits (id, name, icon, color, schedule_type, days_mask, times_per_week, interval_days, per_day, reminder_time, archived, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [h.id, h.name, h.icon, h.color, h.schedule_type, h.days_mask, h.times_per_week, h.interval_days, h.per_day, h.reminder_time, h.archived, h.created_at],
      );
    }
    for (const c of backup.checkins) {
      await db.runAsync('INSERT OR IGNORE INTO checkins (habit_id, date, count) VALUES (?, ?, ?)', [c.habit_id, c.date, c.count]);
    }
  });
}

/** Right to erasure: every habit and check-in goes. Preferences stay. */
export async function deleteAllData(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM checkins');
    await db.runAsync('DELETE FROM habits');
  });
}
