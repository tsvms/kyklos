import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState, useColorScheme } from 'react-native';
import { addDays, fromKey, todayKey, type DateKey } from './date';
import { getSetting, groupCheckins, listCheckins, listHabits, setSetting } from './db';
import { t, type Translator } from './i18n';
import { syncReminders } from './notifications';
import { palettes, type Palette, type Scheme, type ThemePref } from './theme';

interface AppCtx {
  ready: boolean;
  scheme: Scheme;
  colors: Palette;
  themePref: ThemePref;
  setThemePref: (p: ThemePref) => void;
  t: Translator;
  /** Bumped after every write; screens reload when it changes. */
  version: number;
  /** Call after any write: refreshes screens and re-plans reminders. */
  changed: () => void;
  /** Runs a write, then `changed()`. A failure is reported, never thrown; resolves true on success. */
  commit: (write: () => Promise<unknown>) => Promise<boolean>;
  /** Today's local date; rolls over at midnight and on returning to the app. */
  today: DateKey;
  /** A short, gentle message shown at the bottom of the screen. */
  toast: { id: number; text: string } | null;
  notify: (text: string) => void;
}

const AppContext = createContext<AppCtx | null>(null);

/** Never throws: a failed re-plan must not take the UI down with it. */
async function planReminders(db: SQLiteDatabase, t: Translator) {
  try {
    const [habits, checkins] = await Promise.all([listHabits(db), listCheckins(db)]);
    await syncReminders(habits, groupCheckins(checkins, habits), t);
  } catch (e) {
    console.warn('[kyklos] could not plan reminders', e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const system = useColorScheme();
  const [ready, setReady] = useState(false);
  const [themePref, setThemePrefState] = useState<ThemePref>('system');
  const [version, setVersion] = useState(0);
  const [today, setToday] = useState(todayKey);
  const [toast, setToast] = useState<AppCtx['toast']>(null);

  const scheme: Scheme = themePref === 'system' ? (system === 'dark' ? 'dark' : 'light') : themePref;
  const colors = palettes[scheme];

  useEffect(() => {
    let alive = true;
    (async () => {
      const theme = await getSetting(db, 'theme').catch(() => null);
      if (!alive) return;
      if (theme === 'light' || theme === 'dark' || theme === 'system') setThemePrefState(theme);
      setReady(true);
      // Kill + reopen: reminders are re-planned from the database every launch.
      planReminders(db, t);
    })();
    return () => {
      alive = false;
    };
  }, [db]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});
  }, [colors.bg]);

  // Midnight rollover while open, and a fresh day when coming back to the app.
  useEffect(() => {
    const refresh = () => {
      const now = todayKey();
      if (now === today) return;
      setToday(now);
      setVersion((v) => v + 1);
      planReminders(db, t);
    };
    const midnight = fromKey(addDays(today, 1));
    midnight.setHours(0, 0, 1, 0);
    const timer = setTimeout(refresh, Math.max(1000, midnight.getTime() - Date.now()));
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, [db, today]);

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const setThemePref = useCallback(
    (p: ThemePref) => {
      setThemePrefState(p);
      setSetting(db, 'theme', p).catch((e) => console.warn('[kyklos] could not save theme', e));
    },
    [db],
  );


  const changed = useCallback(() => {
    setVersion((v) => v + 1);
    planReminders(db, t);
  }, [db, t]);

  const commit = useCallback(
    async (write: () => Promise<unknown>) => {
      try {
        await write();
        changed();
        return true;
      } catch (e) {
        console.warn('[kyklos] write failed', e);
        notify(t('today.saveFailed'));
        return false;
      }
    },
    [changed, notify, t],
  );

  const value = useMemo<AppCtx>(
    () => ({ ready, scheme, colors, themePref, setThemePref, t, version, changed, commit, today, toast, notify }),
    [ready, scheme, colors, themePref, setThemePref, t, version, changed, commit, today, toast, notify],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

/**
 * Loads data whenever the screen gains focus or anything was written.
 * `key` identifies the query's own inputs (e.g. a habit id).
 */
export function useData<T>(load: (db: SQLiteDatabase) => Promise<T>, key: string | number = '') {
  const db = useSQLiteContext();
  const { version } = useApp();
  const [data, setData] = useState<T | undefined>(undefined);

  useFocusEffect(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      let alive = true;
      load(db)
        .then((d) => alive && setData(d))
        // The database can close under an in-flight query (e.g. while reloading).
        .catch((e) => alive && console.warn('[kyklos] load failed', e));
      return () => {
        alive = false;
      };
    }, [db, version, key]),
  );

  return data;
}
