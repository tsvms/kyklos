import { View } from 'react-native';
import { useApp } from '@/lib/app-state';
import { fromKey, type DateKey } from '@/lib/date';
import { Text } from './ui';

const HEIGHT = 120;

/** One bar per Monday-week; the current week is terracotta, the rest ink-faint. */
export function WeekBars({ weeks }: { weeks: { weekStart: DateKey; count: number }[] }) {
  const { colors, t } = useApp();
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const label = (k: DateKey) => {
    const d = fromKey(k);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      {weeks.map((w, i) => {
        const current = i === weeks.length - 1;
        const h = w.count === 0 ? 4 : Math.max(8, (w.count / max) * HEIGHT);
        return (
          <View
            key={w.weekStart}
            style={{ flex: 1, alignItems: 'center', gap: 6 }}
            accessible
            accessibilityLabel={`${label(w.weekStart)}: ${t('detail.checkins', { n: w.count })}`}
          >
            <Text variant="caption" muted={!current} style={{ fontVariant: ['tabular-nums'] }}>
              {w.count}
            </Text>
            <View
              style={{
                width: '100%',
                maxWidth: 28,
                height: h,
                borderRadius: 8,
                backgroundColor: current ? colors.accent : colors.faint,
              }}
            />
            <Text variant="caption" muted style={{ fontSize: 11, fontVariant: ['tabular-nums'] }}>
              {label(w.weekStart)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
