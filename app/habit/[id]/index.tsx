import Feather from '@expo/vector-icons/Feather';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Pressable, StyleSheet, View } from 'react-native';
import { HabitIcon } from '@/components/HabitIcon';
import { Heatmap } from '@/components/Heatmap';
import { StreakHero } from '@/components/Streak';
import { Button, Card, EmptyState, Screen, Text } from '@/components/ui';
import { useApp, useData } from '@/lib/app-state';
import { alert } from '@/lib/alert';
import { deleteHabit, getHabit, listCheckins, setArchived } from '@/lib/db';
import { scheduleSummary } from '@/lib/format';
import { isDue } from '@/lib/schedule';
import { bestStreak, completionRate, currentStreak, flameState } from '@/lib/stats';
import { habitColor, space } from '@/lib/theme';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Number(id);
  const db = useSQLiteContext();
  const { colors, t, commit, today } = useApp();

  const data = useData(async (db) => {
    const [habit, checkins] = await Promise.all([getHabit(db, habitId), listCheckins(db, habitId)]);
    const perDay = habit?.per_day ?? 1;
    return { habit, done: new Set(checkins.filter((c) => c.count >= perDay).map((c) => c.date)) };
  }, habitId);

  if (!data) return <Screen>{null}</Screen>;
  const { habit, done } = data;
  if (!habit) {
    return (
      <Screen>
        <EmptyState title={t('detail.notFound')} body="" />
      </Screen>
    );
  }

  const color = habitColor(habit.color);
  const rate = completionRate(habit, done, today, 30);
  const archived = habit.archived === 1;
  const streak = currentStreak(habit, done, today);
  const fire = flameState(streak, done.has(today) || !isDue(habit, today, done));

  const toggleArchive = () => commit(() => setArchived(db, habit.id, !archived));

  const confirmDelete = () => {
    alert(t('detail.deleteTitle'), t('detail.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      ...(archived ? [] : [{ text: t('common.archive'), onPress: toggleArchive }]),
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          if (!(await commit(() => deleteHabit(db, habit.id)))) return;
          // Opened from a reminder on a cold start, there is nothing to go back to.
          if (router.canGoBack()) router.back();
          else router.replace('/');
        },
      },
    ]);
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <Pressable
              onPress={() => router.push({ pathname: '/habit/[id]/edit', params: { id: String(habit.id) } })}
              accessibilityRole="button"
              accessibilityLabel={t('detail.editA11y')}
              hitSlop={12}
              style={({ pressed }) => [styles.editBtn, { backgroundColor: colors.faint, opacity: pressed ? 0.6 : 1 }]}
            >
              <Feather name="edit-2" size={18} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.hero}>
        <HabitIcon name={habit.icon} color={color} size={64} />
        <Text variant="display" style={{ textAlign: 'center' }}>
          {habit.name}
        </Text>
        <Text muted>
          {scheduleSummary(habit, t)}
          {habit.reminder_time ? `  ·  ${habit.reminder_time}` : ''}
        </Text>
      </View>

      {archived && (
        <Card>
          <Text muted>{t('detail.archived')}</Text>
        </Card>
      )}

      <StreakHero
        count={streak}
        state={fire}
        best={bestStreak(habit, done, today)}
        caption={t(fire === 'lit' ? 'streak.habitLit' : fire === 'waiting' ? 'streak.habitWaiting' : 'streak.habitOut')}
        unit={t('streak.habitUnit')}
      />

      <View style={styles.stats}>
        <Stat label={t('detail.rate')} value={rate === null ? '—' : `${Math.round(rate * 100)}%`} />
        <Stat label={t('detail.total')} value={String(done.size)} />
      </View>

      <Card style={{ gap: space.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="label">{t('detail.history')}</Text>
          <Text variant="caption" muted style={{ fontVariant: ['tabular-nums'] }}>
            {t('detail.checkins', { n: done.size })}
          </Text>
        </View>
        <Heatmap habit={habit} done={done} color={color} today={today} />
      </Card>

      <View style={{ gap: space.sm, marginTop: space.sm }}>
        <Button
          kind="secondary"
          icon={archived ? 'rotate-ccw' : 'archive'}
          label={archived ? t('common.unarchive') : t('common.archive')}
          onPress={toggleArchive}
        />
        <Button kind="danger" icon="trash-2" label={t('common.delete')} onPress={confirmDelete} />
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, gap: space.xs, paddingHorizontal: space.md }}>
      <Text variant="numberSmall" style={{ fontSize: 28 }}>
        {value}
      </Text>
      <Text variant="caption" muted numberOfLines={2}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.sm, paddingVertical: space.md },
  stats: { flexDirection: 'row', gap: space.sm },
  editBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
