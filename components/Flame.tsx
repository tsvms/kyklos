import { useEffect, useId, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useApp } from '@/lib/app-state';
import type { FlameState } from '@/lib/stats';
import { FLAME_CORE, FLAME_PATH } from '@/lib/flame';
import { FLAME } from '@/lib/theme';


/**
 * The streak fire. Lit: full colour, a soft glow and a slow flicker.
 * Waiting: the colour is there but dimmed — today is still open.
 * Out: grey ash.
 */
export function Flame({ state, size = 48, glow = true }: { state: FlameState; size?: number; glow?: boolean }) {
  const { colors } = useApp();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const lit = state === 'lit';
  const out = state === 'out';

  const [flicker] = useState(() => new Animated.Value(0));
  const [pop] = useState(() => new Animated.Value(1));
  const prev = useRef(state);

  // Slow, irregular flicker while lit.
  useEffect(() => {
    if (!lit) {
      flicker.setValue(0);
      return;
    }
    const step = (to: number, ms: number) =>
      Animated.timing(flicker, { toValue: to, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence([step(1, 520), step(0.35, 380), step(0.8, 460), step(0, 600)]));
    loop.start();
    return () => loop.stop();
  }, [lit, flicker]);

  // Ignite: a little burst when the fire lights up.
  useEffect(() => {
    if (state === 'lit' && prev.current !== 'lit') {
      pop.setValue(0.55);
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }).start();
    }
    prev.current = state;
  }, [state, pop]);

  const scaleY = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const scaleX = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });
  const glowOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] });

  const w = size;
  const h = size * 1.28;
  const box = size * 1.7;

  return (
    <View
      style={{ width: glow ? box : w, height: glow ? box : h, alignItems: 'center', justifyContent: 'center' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {glow && lit && (
        <Animated.View style={{ position: 'absolute', width: box, height: box, opacity: glowOpacity }}>
          <Svg width={box} height={box}>
            <Defs>
              <RadialGradient id={`g${id}`} cx="50%" cy="55%" r="50%">
                <Stop offset="0" stopColor={FLAME.mid} stopOpacity={0.55} />
                <Stop offset="0.55" stopColor={FLAME.tip} stopOpacity={0.14} />
                <Stop offset="1" stopColor={FLAME.tip} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={box / 2} cy={box / 2} r={box / 2} fill={`url(#g${id})`} />
          </Svg>
        </Animated.View>
      )}
      <Animated.View
        style={{
          width: w,
          height: h,
          opacity: state === 'waiting' ? 0.5 : 1,
          transformOrigin: 'bottom',
          transform: [{ scale: pop }, { scaleY }, { scaleX }],
        }}
      >
        <Svg width={w} height={h} viewBox="0 0 100 128">
          <Defs>
            <LinearGradient id={`o${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={out ? colors.ash : FLAME.tip} />
              <Stop offset="0.55" stopColor={out ? colors.ash : FLAME.mid} />
              <Stop offset="1" stopColor={out ? colors.ash : FLAME.base} />
            </LinearGradient>
            <LinearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={out ? colors.ashCore : FLAME.coreBase} />
              <Stop offset="1" stopColor={out ? colors.ashCore : FLAME.core} />
            </LinearGradient>
          </Defs>
          <Path d={FLAME_PATH} fill={`url(#o${id})`} />
          <Path d={FLAME_CORE} fill={`url(#c${id})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
