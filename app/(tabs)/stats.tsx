import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Flame } from '@/components/Flame';
import { HabitIcon } from '@/components/HabitIcon';
import { FlameCount, RankEmblem } from '@/components/Streak';
import { WeekBars } from '@/components/WeekBars';
import { Card, EmptyState, Row, Screen, SectionLabel, Text } from '@/components/ui';
import { useApp, useData } from '@/lib/app-state';
import { groupCheckins, listCheckins, listHabits } from '@/lib/db';
import { scheduleSummary } from '@/lib/format';
import { RANKS, rankIndex } from '@/lib/ranks';
import { isDue } from '@/lib/schedule';
import { bestDailyStreak, completionRate, currentStreak, dailyStreak, flameState, weeklyTotals } from '@/lib/stats';
import { habitColor, space, withAlpha } from '@/lib/theme';

export default function Stats() {
  const { t, today, colors } = useApp();

  const data = useData(async (db) => {
    const [habits, all] = await Promise.all([listHabits(db), listCheckins(db)]);
    // Only completed days of active habits count; archived ones keep their history.
    const done = groupCheckins(all, habits);
    const days = [...done.values()].flatMap((s) => [...s]);
    return { habits, days, done };
  });

  if (!data) return <Screen edgeTop>{null}</Screen>;

  const weeks = weeklyTotals(data.days, today, 8);
  const thisWeek = weeks[weeks.length - 1].count;
  const fire = dailyStreak(data.habits, data.done, today);
  const best = bestDailyStreak(data.habits, data.done, today);
  const rates = data.habits
    .map((h) => completionRate(h, data.done.get(h.id) ?? new Set<string>(), today, 30))
    .filter((r): r is number => r !== null);
  const rate = rates.length ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) : null;
  const current = rankIndex(fire.count);
  const unlocked = rankIndex(best);

  return (
    <Screen edgeTop>
      <Text variant="display">{t('tabs.stats')}</Text>

      {data.days.length === 0 ? (
        <EmptyState title={t('stats.emptyTitle')} body={t('stats.emptyBody')} />
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: space.sm + 4 }}>
            <Figure
              value={String(fire.count)}
              label={t('stats.streak')}
              lead={<Flame state={flameState(fire.count, fire.doneToday)} size={22} glow={false} />}
            />
            <Figure value={String(best)} label={t('stats.bestStreak')} lead={<Feather name="award" size={20} color={colors.accent} />} />
          </View>
          <View style={{ flexDirection: 'row', gap: space.sm + 4 }}>
            <Figure value={String(thisWeek)} label={t('stats.thisWeek')} />
            <Figure value={rate === null ? '—' : `${rate}%`} label={t('stats.rate30')} />
          </View>

          <SectionLabel>{t('stats.weeks')}</SectionLabel>
          <Card>
            <WeekBars weeks={weeks} />
          </Card>
        </>
      )}

      {data.habits.length > 0 && (
        <>
          <SectionLabel>{t('stats.habits')}</SectionLabel>
          <Card style={{ paddingVertical: space.xs }}>
            {data.habits.map((h, i) => {
              const done = data.done.get(h.id) ?? new Set<string>();
              const streak = currentStreak(h, done, today);
              return (
                <Row
                  key={h.id}
                  last={i === data.habits.length - 1}
                  onPress={() => router.push({ pathname: '/habit/[id]', params: { id: String(h.id) } })}
                >
                  <HabitIcon name={h.icon} color={habitColor(h.color)} size={38} />
                  <View style={{ flex: 1 }}>
                    <Text variant="label" numberOfLines={1} style={{ fontWeight: '600' }}>
                      {h.name}
                    </Text>
                    <Text variant="caption" muted numberOfLines={1}>
                      {scheduleSummary(h, t)}
                    </Text>
                  </View>
                  <FlameCount n={streak} state={flameState(streak, done.has(today) || !isDue(h, today, done))} />
                </Row>
              );
            })}
          </Card>
        </>
      )}

      <SectionLabel>{t('rank.title')}</SectionLabel>
      <Text variant="caption" muted style={{ marginHorizontal: space.xs, marginTop: -space.xs }}>
        {t('rank.intro')}
      </Text>
      <Card style={{ paddingVertical: space.xs }}>
        {RANKS.map((r, i) => {
          const isCurrent = i === current;
          const locked = i > unlocked;
          return (
            <Row key={r.id} last={i === RANKS.length - 1}>
              <RankEmblem rank={r} size={36} locked={locked} />
              <View style={{ flex: 1 }}>
                <Text variant="label" color={locked ? colors.muted : colors.text} style={{ fontWeight: '700' }}>
                  {r.name[t.lang]}
                </Text>
                <Text variant="caption" muted style={{ fontVariant: ['tabular-nums'] }}>
                  {r.min === 0 ? t('rank.fromStart') : r.min === 1 ? t('rank.fromOne') : t('rank.from', { n: r.min })}
                </Text>
              </View>
              {isCurrent ? (
                <View style={{ backgroundColor: withAlpha(r.color, 0.16), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                  <Text variant="caption" color={r.color} style={{ fontWeight: '800' }}>
                    {t('rank.now')}
                  </Text>
                </View>
              ) : locked ? (
                <Feather name="lock" size={16} color={colors.muted} />
              ) : (
                <Feather name="check" size={18} color={r.color} />
              )}
            </Row>
          );
        })}
      </Card>
    </Screen>
  );
}

function Figure({ value, label, lead }: { value: string; label: string; lead?: ReactNode }) {
  return (
    <Card style={{ flex: 1, gap: space.xs, padding: space.md + 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {lead}
        <Text variant="number" maxFontSizeMultiplier={1.3} style={{ fontSize: 34 }}>
          {value}
        </Text>
      </View>
      <Text variant="caption" muted>
        {label}
      </Text>
    </Card>
  );
}
