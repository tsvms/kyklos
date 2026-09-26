import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Animated, Easing, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { CheckCircle } from '@/components/CheckCircle';
import { HabitIcon } from '@/components/HabitIcon';
import { FlameCount, StreakHero } from '@/components/Streak';
import { WeekStrip } from '@/components/WeekStrip';
import { Appear, Button, Card, EmptyState, Screen, SectionLabel, Text } from '@/components/ui';
import { useApp, useData } from '@/lib/app-state';
import { fromKey, type DateKey } from '@/lib/date';
import { deleteHabit, groupCheckins, listCheckins, listHabits, setArchived, setCount, type Habit } from '@/lib/db';
import { greeting, longDate, scheduleSummary, weekdayName } from '@/lib/format';
import type { StringKey } from '@/lib/i18n';
import { getPermission, requestPermission, type PermissionState } from '@/lib/notifications';
import { rankFor, rankedUp } from '@/lib/ranks';
import { isDue } from '@/lib/schedule';
import { bestDailyStreak, currentStreak, dailyStreak, dayCompletion, flameState, isMilestone, weekProgress } from '@/lib/stats';
import { habitColor, radius, space, withAlpha } from '@/lib/theme';

const MILESTONE_KEYS: Record<number, StringKey> = {
  3: 'milestone.3',
  7: 'milestone.7',
  14: 'milestone.14',
  21: 'milestone.21',
  30: 'milestone.30',
  100: 'milestone.100',
  365: 'milestone.365',
};

const openHabit = (id: number) => router.push({ pathname: '/habit/[id]', params: { id: String(id) } });
const editHabit = (id: number) => router.push({ pathname: '/habit/[id]/edit', params: { id: String(id) } });

export default function Today() {
  const db = useSQLiteContext();
  const { colors, t, changed, commit, today, notify } = useApp();
  const [selected, setSelected] = useState<DateKey>(today);
  const [editing, setEditing] = useState(false);
  // Snap back to today when the date rolls over.
  const [lastToday, setLastToday] = useState(today);
  if (lastToday !== today) {
    setLastToday(today);
    setSelected(today);
  }
  const day = selected > today ? today : selected;
  const isToday = day === today;

  const data = useData(async (db) => {
    const [habits, checkins] = await Promise.all([listHabits(db), listCheckins(db)]);
    const counts = new Map(checkins.map((c) => [`${c.habit_id}|${c.date}`, c.count]));
    return { habits, counts, done: groupCheckins(checkins, habits) };
  });

  // Optimistic overlay (habit id + date → times done) so the circle responds instantly.
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [permission, setPermission] = useState<PermissionState>('unavailable');

  useFocusEffect(
    useCallback(() => {
      setOverrides({});
      getPermission().then(setPermission);
      return () => setEditing(false);
    }, []),
  );

  if (!data) return <Screen edgeTop>{null}</Screen>;

  const doneMap = new Map<number, Set<DateKey>>();
  for (const h of data.habits) doneMap.set(h.id, new Set(data.done.get(h.id) ?? []));
  const perDay = new Map(data.habits.map((h) => [h.id, h.per_day]));
  for (const [key, count] of Object.entries(overrides)) {
    const [id, date] = key.split('|');
    const set = doneMap.get(Number(id));
    if (!set) continue;
    if (count >= (perDay.get(Number(id)) ?? 1)) set.add(date);
    else set.delete(date);
  }
  const doneOf = (h: Habit) => doneMap.get(h.id)!;
  const countOf = (h: Habit) => overrides[`${h.id}|${day}`] ?? data.counts.get(`${h.id}|${day}`) ?? 0;

  const due = data.habits.filter((h) => isDue(h, day, doneOf(h)));
  const completed = due.filter((h) => doneOf(h).has(day)).length;
  const fire = dailyStreak(data.habits, doneMap, today);
  const best = bestDailyStreak(data.habits, doneMap, today);
  const fireState = flameState(fire.count, fire.doneToday);
  const wantsReminders = data.habits.some((h) => h.reminder_time);
  const showReminderNudge = isToday && wantsReminders && (permission === 'undetermined' || permission === 'denied');

  const setTimes = async (h: Habit, next: number) => {
    const key = `${h.id}|${day}`;
    const before = countOf(h);
    setOverrides((o) => ({ ...o, [key]: next }));
    if (isToday && before < h.per_day && next >= h.per_day) {
      // Celebrate a new rank first, then a habit milestone, then a finished day.
      const after = new Map(doneMap);
      after.set(h.id, new Set(doneOf(h)).add(day));
      const fireAfter = dailyStreak(data.habits, after, today).count;
      const streak = currentStreak(h, after.get(h.id)!, today);
      const dayDone = completed + 1 === due.length && due.includes(h);
      if (rankedUp(fire.count, fireAfter)) notify(t('rank.up', { rank: rankFor(fireAfter).name }));
      else if (isMilestone(streak)) notify(t(MILESTONE_KEYS[streak] ?? 'milestone.generic', { n: streak }));
      else if (dayDone) notify(t('today.allDone'));
    }
    try {
      await setCount(db, h.id, day, next);
      changed();
    } catch (e) {
      console.warn('[kyklos] check-in failed', e);
      setOverrides((o) => ({ ...o, [key]: before }));
      notify(t('today.saveFailed'));
    }
  };

  const confirmDelete = (h: Habit) => {
    Alert.alert(t('detail.deleteTitle'), `${h.name}\n\n${t('detail.deleteBody')}`, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.archive'), onPress: () => commit(() => setArchived(db, h.id, true)) },
      { text: t('common.delete'), style: 'destructive', onPress: () => commit(() => deleteHabit(db, h.id)) },
    ]);
  };

  // Android shows at most three alert buttons: edit, delete (which offers archive), cancel.
  const showActions = (h: Habit) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert(h.name, undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => confirmDelete(h) },
      { text: t('common.edit'), onPress: () => editHabit(h.id) },
    ]);
  };

  const enableReminders = async () => {
    if (permission === 'denied') return Linking.openSettings();
    setPermission(await requestPermission(t));
    changed(); // re-plan reminders now that we may schedule them
  };

  const now = new Date();
  const caption = t(fireState === 'lit' ? 'streak.lit' : fireState === 'waiting' ? 'streak.waiting' : 'streak.out');
  const hasHabits = data.habits.length > 0;

  return (
    <Screen edgeTop>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="display" numberOfLines={1} adjustsFontSizeToFit>
            {isToday ? greeting(now, t) : weekdayName(fromKey(day), t)}
          </Text>
          <Text muted style={{ marginTop: 2 }}>
            {longDate(isToday ? now : fromKey(day), t)}
          </Text>
        </View>
        {hasHabits && (
          <Pressable
            onPress={() => setEditing((e) => !e)}
            accessibilityRole="button"
            accessibilityLabel={editing ? t('today.editDone') : t('today.edit')}
            accessibilityState={{ selected: editing }}
            hitSlop={6}
            style={({ pressed }) => [
              styles.round,
              { backgroundColor: editing ? colors.text : colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name={editing ? 'check' : 'edit-3'} size={20} color={editing ? colors.bg : colors.text} />
          </Pressable>
        )}
        <Pressable
          onPress={() => router.push('/habit/new')}
          accessibilityRole="button"
          accessibilityLabel={t('common.newHabit')}
          hitSlop={6}
          style={({ pressed }) => [styles.add, { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }]}
        >
          <Feather name="plus" size={24} color={colors.onAccent} />
        </Pressable>
      </View>

      {!hasHabits ? (
        <EmptyState
          title={t('today.emptyTitle')}
          body={t('today.emptyBody')}
          action={{ label: t('common.newHabit'), onPress: () => router.push('/habit/new') }}
        />
      ) : (
        <>
          <StreakHero
            count={fire.count}
            state={fireState}
            best={best}
            caption={caption}
            unit={fire.count === 1 ? t('streak.unitOne') : t('streak.unit')}
          />

          <WeekStrip
            today={today}
            selected={day}
            onSelect={setSelected}
            progressFor={(d) => dayCompletion(data.habits, doneMap, d)}
          />

          {!isToday && (
            <Card style={styles.pastCard}>
              <Text muted>{t('today.pastHint')}</Text>
              <Button
                kind="secondary"
                icon="corner-up-left"
                label={t('today.backToToday')}
                onPress={() => setSelected(today)}
                style={{ minHeight: 44, alignSelf: 'flex-start', paddingHorizontal: space.md }}
              />
            </Card>
          )}

          {showReminderNudge && (
            <Card style={{ gap: space.sm }}>
              <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
                <Feather name="bell-off" size={18} color={colors.muted} />
                <Text variant="label">{t('notif.offTitle')}</Text>
              </View>
              <Text muted>{permission === 'denied' ? t('notif.deniedHint') : t('notif.offBody')}</Text>
              <Button
                kind="secondary"
                label={permission === 'denied' ? t('notif.openSettings') : t('notif.enable')}
                onPress={enableReminders}
              />
            </Card>
          )}

          {editing && (
            <View style={[styles.hint, { backgroundColor: withAlpha(colors.accent, 0.1) }]}>
              <Feather name="info" size={16} color={colors.accent} />
              <Text variant="caption" style={{ flex: 1 }}>
                {t('today.editHint')}
              </Text>
            </View>
          )}

          {due.length === 0 && !editing ? (
            <EmptyState title={t('today.freeTitle')} body={isToday ? t('today.freeBody') : t('today.restDay')} />
          ) : (
            <View style={{ gap: space.sm + 2 }}>
              <View style={styles.listHead}>
                <SectionLabel style={{ marginTop: 0 }}>
                  {editing ? t('stats.habits') : isToday ? t('today.listTitle') : longDate(fromKey(day), t)}
                </SectionLabel>
                {!editing && (
                  <Text variant="caption" muted style={{ fontVariant: ['tabular-nums'] }}>
                    {t('today.doneOf', { done: completed, total: due.length })}
                  </Text>
                )}
              </View>
              {!editing && <DayBar done={completed} total={due.length} />}

              {(editing ? data.habits : due).map((h, i) => {
                const done = doneOf(h);
                const checked = done.has(day);
                const color = habitColor(h.color);
                const streak = currentStreak(h, done, day);
                const doneToday = done.has(day) || !isDue(h, day, done);
                let subtitle = scheduleSummary(h, t);
                const times = countOf(h);
                if (h.per_day > 1 && !checked) subtitle = t('today.perDayProgress', { done: times, total: h.per_day });
                else if (h.schedule_type === 'weekly') subtitle = t('today.weekProgress', weekProgress(h, done, day));
                else if (isToday && !checked && streak >= 2) subtitle = t('today.streakKeep', { n: streak });
                return (
                  <Appear key={h.id} index={i}>
                    <Pressable
                      onPress={() => (editing ? editHabit(h.id) : openHabit(h.id))}
                      onLongPress={editing ? undefined : () => showActions(h)}
                      delayLongPress={350}
                      accessibilityRole="button"
                      accessibilityLabel={h.name}
                      accessibilityHint={editing ? t('detail.editA11y') : `${subtitle}. ${t('today.actionsHint')}`}
                      style={({ pressed }) => [
                        styles.habit,
                        {
                          backgroundColor: checked && !editing ? withAlpha(color, 0.12) : colors.card,
                          borderColor: checked && !editing ? withAlpha(color, 0.35) : colors.border,
                          transform: [{ scale: pressed ? 0.985 : 1 }],
                        },
                      ]}
                    >
                      <HabitIcon name={h.icon} color={color} size={46} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text variant="label" numberOfLines={1} style={{ fontSize: 16, fontWeight: '600' }}>
                          {h.name}
                        </Text>
                        <Text variant="caption" muted numberOfLines={1} style={{ fontVariant: ['tabular-nums'] }}>
                          {editing ? scheduleSummary(h, t) : subtitle}
                        </Text>
                      </View>
                      {editing ? (
                        <>
                          <Feather name="edit-2" size={18} color={colors.muted} style={{ marginHorizontal: 6 }} />
                          <Pressable
                            onPress={() => confirmDelete(h)}
                            accessibilityRole="button"
                            accessibilityLabel={t('today.deleteA11y', { name: h.name })}
                            hitSlop={8}
                            style={({ pressed }) => [
                              styles.trash,
                              { backgroundColor: withAlpha(colors.danger, 0.12), opacity: pressed ? 0.6 : 1 },
                            ]}
                          >
                            <Feather name="trash-2" size={18} color={colors.danger} />
                          </Pressable>
                        </>
                      ) : (
                        <>
                          <FlameCount n={streak} state={flameState(streak, doneToday)} />
                          <CheckCircle
                            count={times}
                            target={h.per_day}
                            color={color}
                            onChange={(next) => setTimes(h, next)}
                            label={
                              h.per_day > 1
                                ? t('today.countA11y', { name: h.name, done: times, total: h.per_day })
                                : t(checked ? 'today.markUndone' : 'today.markDone', { name: h.name })
                            }
                          />
                        </>
                      )}
                    </Pressable>
                  </Appear>
                );
              })}

              <Pressable
                onPress={() => router.push('/habit/new')}
                accessibilityRole="button"
                style={({ pressed }) => [styles.addCard, { borderColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
              >
                <View style={[styles.addIcon, { backgroundColor: colors.faint }]}>
                  <Feather name="plus" size={20} color={colors.text} />
                </View>
                <Text variant="label" muted style={{ fontWeight: '600' }}>
                  {t('today.addHabit')}
                </Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

/** Slim progress for the day's list; it glides to each new value. */
function DayBar({ done, total }: { done: number; total: number }) {
  const { colors } = useApp();
  const ratio = total === 0 ? 0 : done / total;
  const [anim] = useState(() => new Animated.Value(ratio));
  useEffect(() => {
    Animated.timing(anim, { toValue: ratio, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [ratio, anim]);
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.faint, overflow: 'hidden', marginBottom: 4 }}>
      <Animated.View
        style={{
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.accent,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 2, marginBottom: space.xs },
  round: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  add: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  pastCard: { gap: space.md, paddingVertical: space.md },
  hint: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: 12, borderRadius: radius.chip },
  listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xs },
  habit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md - 4,
    paddingLeft: 14,
    paddingRight: space.xs,
    paddingVertical: 12,
    borderRadius: radius.card - 4,
    borderWidth: 1,
  },
  trash: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md - 4,
    padding: 12,
    paddingLeft: 14,
    borderRadius: radius.card - 4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
