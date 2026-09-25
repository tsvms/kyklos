import { useState } from 'react';
import { View } from 'react-native';
import { useApp } from '@/lib/app-state';
import { addDays, startOfWeek, type DateKey } from '@/lib/date';
import { isDue, type Schedule } from '@/lib/schedule';
import { withAlpha } from '@/lib/theme';
import { Text } from './ui';

const WEEKS = 17;
const GAP = 3;

/** GitHub-style grid: columns are Monday-weeks, rows Monday…Sunday. */
export function Heatmap({
  habit,
  done,
  color,
  today,
}: {
  habit: Schedule;
  done: ReadonlySet<DateKey>;
  color: string;
  today: DateKey;
}) {
  const { colors, t } = useApp();
  const [width, setWidth] = useState(0);
  const cell = width > 0 ? Math.floor((width - GAP * (WEEKS - 1)) / WEEKS) : 0;
  const first = addDays(startOfWeek(today), -7 * (WEEKS - 1));

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)),
  );

  const fillFor = (day: DateKey) => {
    if (day > today) return 'transparent';
    if (done.has(day)) return color;
    if (day >= habit.created_at && isDue(habit, day, done)) return withAlpha(color, 0.18);
    return colors.faint;
  };

  return (
    <View>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{ flexDirection: 'row', gap: GAP }}
        accessibilityLabel={t('detail.history')}
      >
        {cell > 0 &&
          columns.map((days, w) => (
            <View key={w} style={{ gap: GAP }}>
              {days.map((day) => (
                <View
                  key={day}
                  style={{ width: cell, height: cell, borderRadius: Math.max(2, cell / 4), backgroundColor: fillFor(day) }}
                />
              ))}
            </View>
          ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
        <Legend color={color} label={t('detail.legendDone')} />
        <Legend color={withAlpha(color, 0.18)} label={t('detail.legendMissed')} />
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}
