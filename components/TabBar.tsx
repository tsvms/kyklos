import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/lib/app-state';
import { TAB_BAR_GAP, TAB_BAR_HEIGHT, withAlpha } from '@/lib/theme';
import type { IconName } from './ui';
import { Text } from './ui';


const ICONS: Record<string, IconName> = { index: 'check-circle', stats: 'bar-chart-2', settings: 'settings' };

/**
 * A floating, translucent pill. The active tab sits on a soft accent capsule
 * that slides between items.
 */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, scheme } = useApp();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const [slide] = useState(() => new Animated.Value(state.index));
  const count = state.routes.length;
  const itemWidth = width / Math.max(1, count);

  useEffect(() => {
    Animated.spring(slide, { toValue: state.index, friction: 9, tension: 90, useNativeDriver: true }).start();
  }, [state.index, slide]);

  // Frosted, not see-through: text scrolling underneath must never compete with the labels.
  const glass = scheme === 'dark' ? withAlpha(colors.card, 0.95) : 'rgba(255,255,255,0.94)';

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 8) + TAB_BAR_GAP - 4 }]}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width - 12)}
        style={[
          styles.bar,
          {
            backgroundColor: glass,
            borderColor: scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(22,19,16,0.06)',
            // boxShadow only paints outside the pill, so the glass stays clean on Android.
            boxShadow: scheme === 'dark' ? '0 10px 30px rgba(0,0,0,0.55)' : '0 10px 30px rgba(60,40,20,0.14)',
          },
        ]}
      >
        {width > 0 && (
          <Animated.View
            style={[
              styles.capsule,
              {
                width: itemWidth,
                backgroundColor: withAlpha(colors.accent, scheme === 'dark' ? 0.2 : 0.12),
                transform: [{ translateX: Animated.multiply(slide, itemWidth) }],
              },
            ]}
          />
        )}
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const tint = focused ? colors.accent : colors.muted;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={styles.item}
            >
              <TabIcon name={ICONS[route.name] ?? 'circle'} color={tint} focused={focused} />
              <Text variant="caption" color={tint} numberOfLines={1} style={{ fontSize: 11, fontWeight: focused ? '800' : '600' }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TabIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  const [scale] = useState(() => new Animated.Value(focused ? 1 : 0));
  useEffect(() => {
    Animated.timing(scale, { toValue: focused ? 1 : 0, duration: 220, easing: Easing.out(Easing.back(2)), useNativeDriver: true }).start();
  }, [focused, scale]);
  return (
    <Animated.View style={{ transform: [{ scale: scale.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }] }}>
      <Feather name={name} size={22} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, alignItems: 'stretch' },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 6,
  },
  capsule: { position: 'absolute', top: 6, bottom: 6, left: 6, borderRadius: (TAB_BAR_HEIGHT - 12) / 2 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
});
