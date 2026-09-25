import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable } from 'react-native';
import { useApp } from '@/lib/app-state';

const SIZE = 32;

/**
 * The 32px tap-to-complete circle. The visible circle is small and calm; the
 * touch target around it is a comfortable 48px.
 */
export function CheckCircle({
  checked,
  color,
  onToggle,
  label,
}: {
  checked: boolean;
  color: string;
  onToggle: (next: boolean) => void;
  label: string;
}) {
  const { colors } = useApp();
  const [scale] = useState(() => new Animated.Value(1));
  const [fill] = useState(() => new Animated.Value(checked ? 1 : 0));

  useEffect(() => {
    Animated.timing(fill, { toValue: checked ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [checked, fill]);

  const press = () => {
    const next = !checked;
    if (Platform.OS !== 'web') {
      if (next) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      else Haptics.selectionAsync().catch(() => {});
    }
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.82, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
    onToggle(next);
  };

  return (
    <Pressable
      onPress={press}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 2.5,
          borderColor: checked ? color : colors.ash,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
          overflow: 'hidden',
        }}
      >
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
        {checked && <Feather name="check" size={18} color="#FFFFFF" />}
      </Animated.View>
    </Pressable>
  );
}
