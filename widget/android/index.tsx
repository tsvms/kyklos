// Android home-screen widgets. Android wakes this code without the UI: the
// task handler reads (and on a tap, writes) the same SQLite database, then
// renders both widget kinds so they always agree with each other.
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { requestWidgetUpdate, type WidgetInfo, type WidgetTaskHandlerProps } from 'react-native-android-widget';
import { todayKey } from '@/lib/date';
import { DB_NAME, getHabit, groupCheckins, listCheckins, listHabits, migrate, setCount } from '@/lib/db';
import { t } from '@/lib/i18n';
import { syncReminders } from '@/lib/notifications';
import { nextCount, widgetSnapshot, type WidgetSnapshot } from '@/lib/widget-data';
import { StreakWidget, TodayWidget, WIDGET_TOGGLE } from './KyklosWidgets';

const WIDGETS = ['Streak', 'Today'] as const;

async function snapshot(db: SQLiteDatabase) {
  const [habits, rows] = await Promise.all([listHabits(db), listCheckins(db)]);
  return { habits, rows, data: widgetSnapshot(habits, rows, todayKey()) };
}

function render(info: WidgetInfo, data: WidgetSnapshot) {
  const make = (scheme: 'light' | 'dark') =>
    info.widgetName === 'Today' ? (
      <TodayWidget data={data} scheme={scheme} height={info.height} />
    ) : (
      <StreakWidget data={data} scheme={scheme} width={info.width} />
    );
  return { light: make('light'), dark: make('dark') };
}

/** Redraws every Kyklos widget on the home screen. Never throws. */
export async function updateWidgets(db: SQLiteDatabase) {
  try {
    const { data } = await snapshot(db);
    await Promise.all(WIDGETS.map((widgetName) => requestWidgetUpdate({ widgetName, renderWidget: (info) => render(info, data) })));
  } catch (e) {
    console.warn('[kyklos] widget update failed', e);
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  if (props.widgetAction === 'WIDGET_DELETED') return;
  // Its own connection: the app may be open with the shared one.
  const db = await openDatabaseAsync(DB_NAME, { useNewConnection: true });
  try {
    await migrate(db);
    if (props.widgetAction === 'WIDGET_CLICK' && props.clickAction === WIDGET_TOGGLE) {
      const habit = await getHabit(db, Number(props.clickActionData?.habitId));
      if (habit) {
        const today = todayKey();
        const row = await db.getFirstAsync<{ count: number }>('SELECT count FROM checkins WHERE habit_id = ? AND date = ?', [habit.id, today]);
        await setCount(db, habit.id, today, nextCount(row?.count ?? 0, habit.per_day));
      }
      const { habits, rows, data } = await snapshot(db);
      // The other widget shows the same numbers; reminders skip what is done.
      await Promise.all(WIDGETS.map((widgetName) => requestWidgetUpdate({ widgetName, renderWidget: (info) => render(info, data) })));
      await syncReminders(habits, groupCheckins(rows, habits), t);
      return;
    }
    props.renderWidget(render(props.widgetInfo, (await snapshot(db)).data));
  } catch (e) {
    console.warn('[kyklos] widget task failed', e);
  } finally {
    await db.closeAsync().catch(() => {});
  }
}
