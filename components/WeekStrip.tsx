import * as Haptics from 'expo-haptics';
import { Platform, Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '@/lib/app-state';
import { addDays, fromKey, weekday, type DateKey } from '@/lib/date';
import { longDate } from '@/lib/format';
import { Text } from './ui';

const RING = 34;
const STROKE = 3.5;

/**
 * The last seven days ending today. Each day shows a small ring filled by the
 * share of that day's habits that were done; tapping a past day lets you
 * fill in a check-in you forgot.
 */
export function WeekStrip({
  today,
  selected,
  onSelect,
  progressFor,
}: {
  today: DateKey;
  selected: DateKey;
  onSelect: (d: DateKey) => void;
  progressFor: (d: DateKey) => { done: number; total: number };
}) {
  const { colors, t } = useApp();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const r = (RING - STROKE) / 2;
  const c = 2 * Math.PI * r;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} accessibilityRole="tablist">
      {days.map((d) => {
        const { done, total } = progressFor(d);
        const ratio = total === 0 ? 0 : done / total;
        const active = d === selected;
        const isToday = d === today;
        const complete = total > 0 && done === total;
        return (
          <Pressable
            key={d}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              onSelect(d);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t('today.dayA11y', { date: longDate(fromKey(d), t), done, total })}
            style={{
              alignItems: 'center',
              gap: 6,
              paddingVertical: 8,
              width: 44,
              borderRadius: 16,
              backgroundColor: active ? colors.card : 'transparent',
              borderWidth: active ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text variant="caption" muted={!isToday} style={{ fontSize: 12 }}>
              {t.weekday(weekday(d))}
            </Text>
            <View style={{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={RING} height={RING} style={{ position: 'absolute' }}>
                <Circle cx={RING / 2} cy={RING / 2} r={r} stroke={colors.faint} strokeWidth={STROKE} fill={complete ? colors.accent : 'none'} />
                {ratio > 0 && !complete && (
                  <Circle
                    cx={RING / 2}
                    cy={RING / 2}
                    r={r}
                    stroke={colors.accent}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${c * ratio} ${c}`}
                    transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
                  />
                )}
              </Svg>
              <Text
                variant="caption"
                color={complete ? colors.onAccent : isToday ? colors.text : colors.muted}
                style={{ fontVariant: ['tabular-nums'], fontWeight: isToday ? '700' : '500' }}
              >
                {fromKey(d).getDate()}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
