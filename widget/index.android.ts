import type { SQLiteDatabase } from 'expo-sqlite';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { updateWidgets as update, widgetTaskHandler } from './android';

export function registerWidgets() {
  registerWidgetTaskHandler(widgetTaskHandler);
}

export function updateWidgets(db: SQLiteDatabase) {
  return update(db);
}
