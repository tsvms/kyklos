// Calendar-day helpers. Every date in Kyklos is a local "YYYY-MM-DD" key:
// a check-in belongs to a day on the user's wall clock, not to an instant.

export type DateKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12); // noon: immune to DST edges
}

export function todayKey(): DateKey {
  return toKey(new Date());
}

/** Accepts either a Date or a key and returns a key. */
export function asKey(d: Date | DateKey): DateKey {
  return typeof d === 'string' ? d : toKey(d);
}

// Day numbers are computed in UTC from the date parts so that DST
// transitions (23h / 25h days) never shift the result.
function dayNumber(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function daysBetween(from: DateKey, to: DateKey): number {
  return dayNumber(to) - dayNumber(from);
}

export function addDays(key: DateKey, n: number): DateKey {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** 0 = Sunday … 6 = Saturday (same as Date#getDay). */
export function weekday(key: DateKey): number {
  return fromKey(key).getDay();
}

/** Weeks start on Monday (Greek / ISO convention). */
export function startOfWeek(key: DateKey): DateKey {
  const offset = (weekday(key) + 6) % 7;
  return addDays(key, -offset);
}

export function range(from: DateKey, to: DateKey): DateKey[] {
  const out: DateKey[] = [];
  for (let k = from; k <= to; k = addDays(k, 1)) out.push(k);
  return out;
}
