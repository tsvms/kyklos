import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useApp } from '@/lib/app-state';
import { MAX_PER_DAY, type HabitInput } from '@/lib/db';
import { WEEK_ORDER } from '@/lib/format';
import { requestPermission, type PermissionState } from '@/lib/notifications';
import { ALL_DAYS_MASK, type ScheduleType } from '@/lib/schedule';
import { HABIT_COLOR_KEYS, HABIT_COLORS, habitColor, radius, space, withAlpha, type HabitColor } from '@/lib/theme';
import { HABIT_ICONS, HabitIcon } from './HabitIcon';
import { Button, Card, SectionLabel, Stepper, Text, type IconName } from './ui';

export const EMPTY_HABIT: HabitInput = {
  name: '',
  icon: 'book-open',
  color: 'terracotta',
  schedule_type: 'daily',
  days_mask: ALL_DAYS_MASK,
  times_per_week: 3,
  interval_days: 2,
  per_day: 1,
  reminder_time: null,
};

const pad = (n: number) => String(n).padStart(2, '0');
const ICON_COLS = 5;
const ICON_GAP = 6;

export function HabitForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: HabitInput;
  submitLabel: string;
  onSubmit: (h: HabitInput) => Promise<void>;
}) {
  const { colors, t } = useApp();
  const [h, setH] = useState<HabitInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [saving, setSaving] = useState(false);
  // Square cells, five per row, sized from the real width so the selection is centred.
  const [gridWidth, setGridWidth] = useState(0);
  const cell = gridWidth > 0 ? Math.floor((gridWidth - ICON_GAP * (ICON_COLS - 1)) / ICON_COLS) : 0;
  const set = (patch: Partial<HabitInput>) => {
    setError(null);
    setH((prev) => ({ ...prev, ...patch }));
  };

  const [hour, minute] = (h.reminder_time ?? '20:00').split(':').map(Number);
  const accent = habitColor(h.color);

  const toggleReminder = async (on: boolean) => {
    if (!on) return set({ reminder_time: null });
    set({ reminder_time: h.reminder_time ?? '20:00' });
    setPermission(await requestPermission(t));
  };

  const toggleDay = (d: number) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    set({ days_mask: h.days_mask ^ (1 << d) });
  };

  // One save at a time: a quick double tap must not create the habit twice.
  const submit = async () => {
    if (saving) return;
    const name = h.name.trim();
    if (!name) return setError(t('form.nameRequired'));
    if (h.schedule_type === 'weekdays' && h.days_mask === 0) return setError(t('form.dayRequired'));
    setSaving(true);
    try {
      await onSubmit({ ...h, name });
    } catch (e) {
      console.warn('[kyklos] save failed', e);
      setError(t('today.saveFailed'));
      setSaving(false);
    }
  };

  const scheduleOptions: { value: ScheduleType; label: string; hint: string; icon: IconName }[] = [
    { value: 'daily', label: t('schedule.daily'), hint: t('schedule.dailyHint'), icon: 'sun' },
    { value: 'weekdays', label: t('schedule.weekdays'), hint: t('schedule.weekdaysHint'), icon: 'calendar' },
    { value: 'weekly', label: t('schedule.weekly'), hint: t('schedule.weeklyHint'), icon: 'bar-chart-2' },
    { value: 'interval', label: t('schedule.interval'), hint: t('schedule.intervalHint'), icon: 'repeat' },
  ];

  return (
    <View style={{ gap: space.md }}>
      <View style={styles.preview}>
        <HabitIcon name={h.icon} color={accent} size={64} />
      </View>

      <SectionLabel>{t('form.name')}</SectionLabel>
      <TextInput
        value={h.name}
        onChangeText={(name) => set({ name })}
        placeholder={t('form.namePlaceholder')}
        placeholderTextColor={colors.muted}
        maxLength={40}
        returnKeyType="done"
        accessibilityLabel={t('form.name')}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
      />

      <SectionLabel>{t('form.icon')}</SectionLabel>
      <Card style={{ padding: space.sm + 2 }}>
        <View style={styles.iconGrid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
          {cell > 0 &&
            HABIT_ICONS.map((icon) => {
              const active = icon === h.icon;
              return (
                <Pressable
                  key={icon}
                  onPress={() => set({ icon })}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={icon}
                  style={[
                    styles.iconCell,
                    { width: cell, height: cell },
                    active && { backgroundColor: withAlpha(accent, 0.14), borderColor: accent },
                  ]}
                >
                  <Feather name={icon} size={22} color={active ? accent : colors.muted} />
                </Pressable>
              );
            })}
        </View>
      </Card>

      <SectionLabel>{t('form.color')}</SectionLabel>
      <View style={styles.colors}>
        {HABIT_COLOR_KEYS.map((key: HabitColor) => {
          const active = key === h.color;
          return (
            <Pressable
              key={key}
              onPress={() => set({ color: key })}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={key}
              hitSlop={4}
              style={[styles.colorRing, { borderColor: active ? HABIT_COLORS[key] : 'transparent' }]}
            >
              <View style={[styles.colorDot, { backgroundColor: HABIT_COLORS[key] }]} />
            </Pressable>
          );
        })}
      </View>

      <SectionLabel>{t('form.schedule')}</SectionLabel>
      <Card style={{ gap: space.md }}>
        <View style={styles.scheduleGrid} accessibilityRole="radiogroup">
          {scheduleOptions.map((o) => {
            const active = o.value === h.schedule_type;
            return (
              <Pressable
                key={o.value}
                onPress={() => set({ schedule_type: o.value })}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityHint={o.hint}
                style={[
                  styles.scheduleCell,
                  { borderColor: active ? accent : colors.border, backgroundColor: active ? withAlpha(accent, 0.1) : 'transparent' },
                ]}
              >
                <Feather name={o.icon} size={18} color={active ? accent : colors.muted} />
                <Text variant="label" numberOfLines={2}>
                  {o.label}
                </Text>
                <Text variant="caption" muted numberOfLines={2}>
                  {o.hint}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {h.schedule_type === 'weekdays' && (
          <View style={styles.days}>
            {WEEK_ORDER.map((d) => {
              const on = (h.days_mask & (1 << d)) !== 0;
              return (
                <Pressable
                  key={d}
                  onPress={() => toggleDay(d)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={[styles.day, { backgroundColor: on ? accent : colors.faint }]}
                >
                  <Text variant="label" color={on ? colors.card : colors.muted}>
                    {t.weekday(d)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {h.schedule_type === 'weekly' && (
          <View style={styles.inline}>
            <Text muted>{t('form.timesPerWeek')}</Text>
            <Stepper label={t('form.timesPerWeek')} value={h.times_per_week} min={1} max={6} onChange={(n) => set({ times_per_week: n })} />
          </View>
        )}

        {h.schedule_type === 'interval' && (
          <View style={styles.inline}>
            <Text muted>{t('form.everyNDays')}</Text>
            <Stepper label={t('form.everyNDays')} value={h.interval_days} min={2} max={30} onChange={(n) => set({ interval_days: n })} />
          </View>
        )}

        <View style={{ gap: space.xs }}>
          <View style={styles.inline}>
            <Text muted>{t('form.perDay')}</Text>
            <Stepper label={t('form.perDay')} value={h.per_day} min={1} max={MAX_PER_DAY} onChange={(n) => set({ per_day: n })} />
          </View>
          {h.per_day > 1 && (
            <Text variant="caption" muted>
              {t('form.perDayHint')}
            </Text>
          )}
        </View>
      </Card>

      <SectionLabel>{t('form.reminder')}</SectionLabel>
      <Card style={{ gap: space.md }}>
        <View style={styles.inline}>
          <Text>{t('form.reminderOn')}</Text>
          <Switch
            value={h.reminder_time !== null}
            onValueChange={toggleReminder}
            trackColor={{ true: accent, false: colors.faint }}
            thumbColor={Platform.OS === 'android' ? colors.card : undefined}
            ios_backgroundColor={colors.faint}
            accessibilityLabel={t('form.reminderOn')}
          />
        </View>
        {h.reminder_time !== null && (
          <>
            <View style={styles.inline}>
              <Text muted>{t('form.hour')}</Text>
              <Stepper label={t('form.hour')} value={hour} min={0} max={23} format={pad} onChange={(v) => set({ reminder_time: `${pad(v)}:${pad(minute)}` })} />
            </View>
            <View style={styles.inline}>
              <Text muted>{t('form.minute')}</Text>
              <Stepper label={t('form.minute')} value={minute} min={0} max={55} step={5} format={pad} onChange={(v) => set({ reminder_time: `${pad(hour)}:${pad(v)}` })} />
            </View>
            {permission === 'denied' && (
              <View style={{ gap: space.sm }}>
                <Text variant="caption" muted>
                  {t('notif.deniedHint')}
                </Text>
                <Button kind="secondary" label={t('notif.openSettings')} onPress={() => Linking.openSettings()} />
              </View>
            )}
          </>
        )}
      </Card>

      {error && (
        <Text color={colors.danger} accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>
          {error}
        </Text>
      )}
      <Button label={submitLabel} onPress={submit} disabled={saving} style={{ marginTop: space.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center', paddingTop: space.sm },
  input: { minHeight: 54, borderRadius: radius.button, borderWidth: 1, paddingHorizontal: space.md, fontSize: 17 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: ICON_GAP },
  iconCell: { borderRadius: radius.chip, borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colors: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.xs },
  colorRing: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  colorDot: { width: 26, height: 26, borderRadius: 13 },
  days: { flexDirection: 'row', justifyContent: 'space-between', gap: space.xs },
  day: { flex: 1, aspectRatio: 1, maxWidth: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.sm },
  scheduleCell: { width: '48.5%', borderWidth: 1.5, borderRadius: radius.button, padding: space.md - 2, gap: 4 },
  inline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
});
