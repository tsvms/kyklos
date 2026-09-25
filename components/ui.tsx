import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps, ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/lib/app-state';
import { upper } from '@/lib/text';
import { hairline, radius, space, TAB_BAR_GAP, TAB_BAR_HEIGHT, type } from '@/lib/theme';
import { RingMark } from './RingMark';

export type IconName = ComponentProps<typeof Feather>['name'];

type Variant = keyof typeof type;

// Android clips glyphs that hang left of the first character when a line is
// ellipsized (numberOfLines), so the tonos of a leading Έ/Ή/Ί… vanishes. A thin space in front gives it
// room; a negative margin of the same width keeps the text where it was.
const TONOS_CAPS = /^[ΆΈΉΊΌΎΏ]/;
const THIN_SPACE_EM = 0.2;

export function Text({
  variant = 'body',
  muted,
  color,
  style,
  children,
  ...rest
}: TextProps & { variant?: Variant; muted?: boolean; color?: string }) {
  const { colors } = useApp();
  const shift = Platform.OS === 'android' && typeof children === 'string' && TONOS_CAPS.test(children);
  const size = StyleSheet.flatten(style)?.fontSize ?? (type[variant] as TextStyle).fontSize ?? 17;
  return (
    <RNText
      {...rest}
      style={[
        type[variant] as TextStyle,
        { color: color ?? (muted ? colors.muted : colors.text) },
        shift && { marginLeft: -Math.round(size * THIN_SPACE_EM) },
        style,
      ]}
    >
      {shift ? ` ${children}` : children}
    </RNText>
  );
}

export function Screen({
  children,
  scroll = true,
  edgeTop = false,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  /** A tab screen: no header, so pad for the status bar and the floating tab bar. */
  edgeTop?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const pad = [
    styles.screenContent,
    {
      paddingTop: edgeTop ? insets.top + space.md : space.md,
      // Tab screens (the only ones without a header) scroll under the floating bar.
      paddingBottom: edgeTop ? Math.max(insets.bottom, 8) + TAB_BAR_HEIGHT + TAB_BAR_GAP + space.lg : space.xxl,
    },
    contentStyle,
  ];
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: colors.bg }, pad]}>{children}</View>;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {/* Edge-to-edge: keep scrolled content from running under the status bar. */}
      {edgeTop && (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.bg }} />
      )}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>
  );
}

/** Small all-caps label. Greek caps drop the tonos (ΟΝΟΜΑ, not ΌΝΟΜΑ). */
export function SectionLabel({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return (
    <Text variant="caption" muted style={[styles.section, style]} accessibilityRole="header">
      {upper(children)}
    </Text>
  );
}

type ButtonKind = 'primary' | 'secondary' | 'danger' | 'ghost';

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  kind?: ButtonKind;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useApp();
  const bg = kind === 'primary' ? colors.accent : kind === 'secondary' ? colors.faint : 'transparent';
  const fg = kind === 'primary' ? colors.onAccent : kind === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        kind === 'danger' && { borderWidth: hairline, borderColor: colors.border },
        style,
      ]}
    >
      {icon && <Feather name={icon} size={18} color={fg} />}
      <Text variant="label" color={fg} style={{ fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Evenly split pill control. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useApp();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.faint }]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, active && [styles.segmentActive, { backgroundColor: colors.text }]]}
          >
            <Text variant="label" color={active ? colors.bg : colors.muted} numberOfLines={1} style={{ fontWeight: active ? '700' : '500' }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** − value + */
export function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  label: string;
}) {
  const { colors } = useApp();
  const wrap = (v: number) => (v > max ? min : v < min ? max : v);
  return (
    <View style={styles.stepper} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ text: format(value) }}>
      <Pressable
        accessibilityLabel={`${label} −`}
        onPress={() => onChange(wrap(value - step))}
        style={[styles.stepBtn, { backgroundColor: colors.faint }]}
        hitSlop={6}
      >
        <Feather name="minus" size={18} color={colors.text} />
      </Pressable>
      <Text variant="numberSmall" style={styles.stepValue}>
        {format(value)}
      </Text>
      <Pressable
        accessibilityLabel={`${label} +`}
        onPress={() => onChange(wrap(value + step))}
        style={[styles.stepBtn, { backgroundColor: colors.faint }]}
        hitSlop={6}
      >
        <Feather name="plus" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.empty}>
      <RingMark size={72} />
      <Text variant="title" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {!!body && (
        <Text muted style={{ textAlign: 'center', maxWidth: 300 }}>
          {body}
        </Text>
      )}
      {action && <Button label={action.label} onPress={action.onPress} icon="plus" style={{ marginTop: space.sm }} />}
    </View>
  );
}

export function Row({
  children,
  onPress,
  last,
}: {
  children: ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const { colors } = useApp();
  const border = last ? null : { borderBottomWidth: hairline, borderBottomColor: colors.border };
  if (!onPress) return <View style={[styles.row, border]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, border, pressed && { opacity: 0.6 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingHorizontal: space.md + 4, gap: space.md },
  card: { borderRadius: radius.card, borderWidth: hairline, padding: space.md + 4 },
  section: { marginTop: space.md, marginLeft: space.xs, letterSpacing: 1, fontWeight: '700', fontSize: 12 },
  button: {
    minHeight: 52,
    borderRadius: radius.button,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  segmented: { flexDirection: 'row', borderRadius: radius.chip + 2, padding: 3 },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xs,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  stepBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  stepValue: { minWidth: 44, textAlign: 'center' },
  empty: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 56,
    paddingVertical: space.sm + 2,
  },
});
