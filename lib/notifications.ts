import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { DateKey } from './date';
import type { Habit } from './db';
import type { Translator } from './i18n';
import { reminderPlan } from './reminders';
import { HABIT_COLORS } from './theme';

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unavailable';

const CHANNEL = 'reminders';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

export function configureNotifications() {
  if (!supported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensureChannel(t: Translator) {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: t('notif.channel'),
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: HABIT_COLORS.terracotta,
  });
}

export async function getPermission(): Promise<PermissionState> {
  if (!supported) return 'unavailable';
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    // Android 13+ reports "denied" before the user was ever asked; only a
    // denial the OS will not ask about again is a real "blocked".
    if (status === 'denied' && canAskAgain) return 'undetermined';
    return status as PermissionState;
  } catch {
    return 'unavailable';
  }
}

/** Asks only when the OS still allows asking; otherwise reports the state. */
export async function requestPermission(t: Translator): Promise<PermissionState> {
  if (!supported) return 'unavailable';
  try {
    // Android 13+ only shows the prompt once a channel exists.
    await ensureChannel(t);
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted' || !current.canAskAgain) return current.status as PermissionState;
    const { status } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: false },
    });
    return status as PermissionState;
  } catch {
    return 'unavailable';
  }
}

let queue: Promise<void> = Promise.resolve();

/**
 * Rebuilds every reminder from the database: cancel all, schedule again.
 * Idempotent and serialised, so it is safe to call after any change.
 */
export function syncReminders(habits: Habit[], checkins: Map<number, Set<DateKey>>, t: Translator) {
  queue = queue.then(async () => {
    if (!supported) return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      await Notifications.cancelAllScheduledNotificationsAsync();
      if (status !== 'granted') return;
      await ensureChannel(t);

      for (const { habit, at } of reminderPlan(habits, checkins, new Date())) {
        await Notifications.scheduleNotificationAsync({
          content: { title: habit.name, body: t('notif.body'), data: { habitId: habit.id } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
    } catch (e) {
      // Reminders must never take the app down (e.g. Expo Go limitations).
      console.warn('[kyklos] could not schedule reminders', e);
    }
  });
  return queue;
}

