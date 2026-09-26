// iOS home-screen widget. The widget runs outside the app and can't read the
// database, so the app hands it ready-made snapshots: one for now and one for
// midnight, when the day turns over even if the app isn't opened.
import type { SQLiteDatabase } from 'expo-sqlite';
import { addDays, fromKey, todayKey } from '@/lib/date';
import { listCheckins, listHabits } from '@/lib/db';
import { t } from '@/lib/i18n';
import { habitColor } from '@/lib/theme';
import { widgetSnapshot, type WidgetSnapshot } from '@/lib/widget-data';
import KyklosWidget, { type KyklosWidgetProps } from './ios/KyklosWidget';

export function registerWidgets() {}

function toProps(s: WidgetSnapshot): KyklosWidgetProps {
  return {
    streak: s.streak,
    state: s.state,
    rank: s.rank,
    done: s.done,
    total: s.total,
    unit: t(s.streak === 1 ? 'streak.unitOne' : 'streak.unit'),
    progress: s.total === 0 ? t('widget.nothingDue') : t('widget.today', { done: s.done, total: s.total }),
    progressShort: s.total === 0 ? t('today.freeTitle') : t('widget.todayShort', { done: s.done, total: s.total }),
    items: s.items.map((i) => ({ name: i.name, color: habitColor(i.color), count: i.count, perDay: i.perDay, done: i.done })),
  };
}

/** Never throws: a widget refresh must not affect the app. */
export async function updateWidgets(db: SQLiteDatabase) {
  try {
    const [habits, rows] = await Promise.all([listHabits(db), listCheckins(db)]);
    const today = todayKey();
    const tomorrow = addDays(today, 1);
    const midnight = fromKey(tomorrow);
    midnight.setHours(0, 0, 1, 0);
    KyklosWidget.updateTimeline([
      { date: new Date(), props: toProps(widgetSnapshot(habits, rows, today)) },
      { date: midnight, props: toProps(widgetSnapshot(habits, rows, tomorrow)) },
    ]);
  } catch (e) {
    console.warn('[kyklos] widget update failed', e);
  }
}
