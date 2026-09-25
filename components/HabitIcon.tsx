import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';
import { withAlpha } from '@/lib/theme';
import type { IconName } from './ui';

// Built-in vector set only (Feather ships with @expo/vector-icons).
export const HABIT_ICONS: IconName[] = [
  'book-open',
  'droplet',
  'wind',
  'sun',
  'moon',
  'heart',
  'activity',
  'coffee',
  'feather',
  'edit-3',
  'music',
  'headphones',
  'smile',
  'compass',
  'globe',
  'home',
  'phone',
  'camera',
  'code',
  'umbrella',
];

export function HabitIcon({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: withAlpha(color, 0.16),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather name={name as IconName} size={Math.round(size * 0.48)} color={color} />
    </View>
  );
}
