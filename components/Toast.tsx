import { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/lib/app-state';
import { RingMark } from './RingMark';
import { Text } from './ui';

/** Quiet confirmation pill above the tab bar. Announced to screen readers. */
export function Toast() {
  const { toast, colors } = useApp();
  const insets = useSafeAreaInsets();
  const [anim] = useState(() => new Animated.Value(0));
  // Keep the last message on screen while it fades out.
  const [shown, setShown] = useState(toast);
  if (toast && toast !== shown) setShown(toast);

  useEffect(() => {
    if (toast) {
      Animated.timing(anim, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setShown(null));
    }
  }, [toast, anim]);

  if (!shown) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(insets.bottom, 8) + 96, alignItems: 'center' }}>
      <Animated.View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          maxWidth: 420,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          backgroundColor: colors.text,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}
      >
        <RingMark size={18} />
        <Text variant="label" color={colors.bg} style={{ flexShrink: 1 }}>
          {shown.text}
        </Text>
      </Animated.View>
    </View>
  );
}
