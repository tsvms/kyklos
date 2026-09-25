import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '@/lib/app-state';

/**
 * The Kyklos mark: one terracotta ring with a small opening near the top —
 * a cycle that is almost, but not yet, closed. Same geometry as the app icon.
 */
export function RingMark({ size = 64, color }: { size?: number; color?: string }) {
  const { colors } = useApp();
  const stroke = size * 0.14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = c * 0.09;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color ?? colors.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c - gap} ${gap}`}
          fill="none"
          transform={`rotate(-70 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
