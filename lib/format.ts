import type { Translator } from './i18n';
import { daysFromMask, type Schedule } from './schedule';

/** Monday-first order for display (Greek convention). */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function scheduleSummary(h: Schedule, t: Translator): string {
  switch (h.schedule_type) {
    case 'daily':
      return t('schedule.daily');
    case 'weekly':
      return t('schedule.weeklySummary', { n: h.times_per_week });
    case 'interval':
      return h.interval_days <= 1 ? t('schedule.daily') : t('schedule.intervalSummary', { n: h.interval_days });
    case 'weekdays': {
      const days = daysFromMask(h.days_mask);
      if (days.length === 7) return t('schedule.daily');
      return WEEK_ORDER.filter((d) => days.includes(d))
        .map((d) => t.weekday(d))
        .join(' · ');
    }
  }
}

export function longDate(d: Date, t: Translator): string {
  try {
    return d.toLocaleDateString(t.locale, { weekday: 'long', day: 'numeric', month: 'long' });
  } catch {
    return d.toDateString();
  }
}

export function greeting(d: Date, t: Translator): string {
  const h = d.getHours();
  if (h < 12) return t('today.morning');
  if (h < 18) return t('today.afternoon');
  return t('today.evening');
}
