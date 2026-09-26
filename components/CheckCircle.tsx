import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '@/lib/app-state';
import { FLAME } from '@/lib/theme';
import { nextCount } from '@/lib/widget-data';
import { Text } from './ui';

const SIZE = 32;
const STROKE = 2.5;

// Eight embers thrown outwards when a habit is completed for the day.
const EMBERS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + (i % 2 ? 0.25 : 0);
  const reach = i % 2 ? 20 : 26;
  return {
    x: Math.cos(angle) * reach,
    y: Math.sin(angle) * reach,
    size: i % 2 ? 4 : 5,
    color: [FLAME.base, FLAME.mid, FLAME.tip][i % 3],
  };
});

/**
 * The 32px tap-to-complete circle (48px touch target). With a daily target
 * above one it is a counter: tap adds one and a ring fills towards the
 * target, long-press takes one away. Tapping a full circle undoes the last
 * tap, which for a simple habit is just "uncheck".
 */
export function CheckCircle({
  count,
  target,
  color,
  onChange,
  label,
}: {
  count: number;
  target: number;
  color: string;
  onChange: (next: number) => void;
  label: string;
}) {
  const { colors } = useApp();
  const done = count >= target;
  const [scale] = useState(() => new Animated.Value(1));
  const [fill] = useState(() => new Animated.Value(done ? 1 : 0));
  const [burst] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fill, { toValue: done ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [done, fill]);

  const change = (next: number) => {
    const completes = next >= target && !done;
    if (Platform.OS !== 'web') {
      if (completes) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      else Haptics.selectionAsync().catch(() => {});
    }
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.82, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
    if (completes) {
      burst.setValue(0);
      Animated.timing(burst, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
    onChange(next);
  };

  const increment = () => change(nextCount(count, target));
  const decrement = () => count > 0 && change(count - 1);

  const emberOpacity = burst.interpolate({ inputRange: [0, 0.1, 0.6, 1], outputRange: [0, 1, 0.8, 0] });
  const emberScale = burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] });
  const r = (SIZE - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const multi = target > 1;

  return (
    <Pressable
      onPress={increment}
      onLongPress={multi ? decrement : undefined}
      delayLongPress={350}
      hitSlop={10}
      accessibilityRole={multi ? 'adjustable' : 'checkbox'}
      accessibilityState={multi ? undefined : { checked: done }}
      accessibilityValue={multi ? { min: 0, max: target, now: Math.min(count, target) } : undefined}
      accessibilityActions={multi ? [{ name: 'increment' }, { name: 'decrement' }] : undefined}
      onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'decrement' ? decrement() : increment())}
      accessibilityLabel={label}
      style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
    >
      <View pointerEvents="none" style={{ position: 'absolute', width: 0, height: 0, left: 24, top: 24 }}>
        {EMBERS.map((e, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: -e.size / 2,
              top: -e.size / 2,
              width: e.size,
              height: e.size,
              borderRadius: e.size / 2,
              backgroundColor: e.color,
              opacity: emberOpacity,
              transform: [
                { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, e.x] }) },
                // Embers drift a little upwards as they fade, like sparks.
                { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, e.y - 6] }) },
                { scale: emberScale },
              ],
            }}
          />
        ))}
      </View>
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: multi ? 0 : STROKE,
          borderColor: done ? color : colors.ash,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
          overflow: 'hidden',
        }}
      >
        {multi && (
          <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={r} stroke={colors.ash} strokeWidth={STROKE} fill="none" />
            {count > 0 && (
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={r}
                stroke={color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(c * Math.min(count, target)) / target} ${c}`}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            )}
          </Svg>
        )}
        <Animated.View
          style={{
            position: 'absolute',
            width: SIZE,
            height: SIZE,
            backgroundColor: color,
            opacity: fill,
            transform: [{ scale: fill }],
            borderRadius: SIZE / 2,
          }}
        />
        {done ? (
          <Feather name="check" size={18} color="#FFFFFF" />
        ) : (
          multi && (
            <Text variant="caption" color={count > 0 ? colors.text : colors.muted} style={{ fontWeight: '800', fontVariant: ['tabular-nums'] }} maxFontSizeMultiplier={1}>
              {count}
            </Text>
          )
        )}
      </Animated.View>
    </Pressable>
  );
}
