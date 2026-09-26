import { useEffect, useId, useRef, useState } from 'react';
import { Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { useApp } from '@/lib/app-state';
import { rankIndex, rankProgress, type Rank } from '@/lib/ranks';
import type { FlameState } from '@/lib/stats';
import { FLAME, radius, withAlpha } from '@/lib/theme';
import { Flame, FLAME_PATH } from './Flame';
import { Text } from './ui';

/** Small flame + number, used in habit rows. Grey when the streak is out. */
export function FlameCount({ n, state, size = 16 }: { n: number; state: FlameState; size?: number }) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Flame state={state} size={size} glow={false} />
      <Text
        variant="label"
        color={state === 'out' ? colors.muted : colors.text}
        style={{ fontWeight: '800', fontVariant: ['tabular-nums'], minWidth: 10 }}
      >
        {n}
      </Text>
    </View>
  );
}

// A hexagon in the rank colour with a small white flame inside.
const HEX = 'M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5 Z';

export function RankEmblem({ rank, size = 28, locked }: { rank: Rank; size?: number; locked?: boolean }) {
  const { colors } = useApp();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const color = locked ? colors.ash : rank.color;
  const tier = rankIndex(rank.min);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={`r${id}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={locked ? 0.7 : 0.85} />
          <Stop offset="1" stopColor={color} />
        </LinearGradient>
      </Defs>
      <Path d={HEX} fill={`url(#r${id})`} />
      {/* Higher tiers get a brighter inner ring. */}
      {!locked && tier >= 5 && <Path d={HEX} fill="none" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={5} transform="translate(12 12) scale(0.76)" />}
      <Path d={FLAME_PATH} fill="#FFFFFF" fillOpacity={locked ? 0.55 : 0.95} transform="translate(33 26) scale(0.34)" />
    </Svg>
  );
}

/** Emblem + rank name in a soft pill. */
export function RankPill({ rank, onHero, style }: { rank: Rank; onHero?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors, t } = useApp();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 4,
          paddingRight: 12,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: onHero ? colors.heroChip : withAlpha(rank.color, 0.14),
          alignSelf: 'flex-start',
        },
        style,
      ]}
      accessible
      accessibilityLabel={`${t('rank.label')}: ${rank.name[t.lang]}`}
    >
      <RankEmblem rank={rank} size={24} />
      <Text variant="caption" color={onHero ? colors.heroText : colors.text} style={{ fontWeight: '700' }}>
        {rank.name[t.lang]}
      </Text>
    </View>
  );
}

/** Gradient bar towards the next rank, with the "n more to …" line. `onHero`: drawn on the streak hero. */
export function RankProgress({ streak, onHero }: { streak: number; onHero?: boolean }) {
  const { colors, t } = useApp();
  const { next, progress, toGo } = rankProgress(streak);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [anim] = useState(() => new Animated.Value(0));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [progress, anim]);

  const track = onHero ? colors.heroTrack : colors.faint;
  return (
    <View style={{ gap: 8 }}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{ height: 8, borderRadius: 4, backgroundColor: track, overflow: 'hidden' }}
        accessible
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      >
        <Animated.View
          style={{ height: 8, width: anim.interpolate({ inputRange: [0, 1], outputRange: [0, width] }), borderRadius: 4, overflow: 'hidden' }}
        >
          <Svg width={Math.max(width, 1)} height={8}>
            <Defs>
              <LinearGradient id={`p${id}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={FLAME.base} />
                <Stop offset="1" stopColor={FLAME.tip} />
              </LinearGradient>
            </Defs>
            <Path d={`M0 0 H${Math.max(width, 1)} V8 H0 Z`} fill={`url(#p${id})`} />
          </Svg>
        </Animated.View>
      </View>
      <Text variant="caption" color={onHero ? colors.heroMuted : colors.muted} style={{ fontVariant: ['tabular-nums'] }}>
        {next ? t('rank.next', { n: toGo, rank: next.name[t.lang] }) : t('rank.max')}
      </Text>
    </View>
  );
}

/**
 * The hero: a dark, glowing card with the fire, the streak, the rank and
 * the way to the next one. Used on Today (all habits) and on a habit's page.
 */
export function StreakHero({
  count,
  state,
  best,
  caption,
  unit,
}: {
  count: number;
  state: FlameState;
  best: number;
  caption: string;
  unit: string;
}) {
  const { colors, t, scheme } = useApp();
  const { rank } = rankProgress(count);
  const [bump] = useState(() => new Animated.Value(1));
  const prev = useRef(count);

  // The number pops when the streak grows.
  useEffect(() => {
    if (count > prev.current) {
      bump.setValue(1.22);
      Animated.spring(bump, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
    }
    prev.current = count;
  }, [count, bump]);

  return (
    <View
      style={{
        backgroundColor: colors.hero,
        borderRadius: radius.card + 4,
        padding: 20,
        gap: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: state === 'out' ? colors.border : colors.heroBorder,
      }}
      accessible
      accessibilityLabel={`${count} ${unit}. ${rank.name[t.lang]}. ${caption}`}
    >
      {state !== 'out' && <HeroGlow strength={scheme === 'dark' ? 0.32 : 0.22} />}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View style={{ marginLeft: -14, marginVertical: -14 }}>
          <Flame state={state} size={64} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Animated.View style={{ transformOrigin: 'bottom left', transform: [{ scale: bump }] }}>
              <Text
                variant="number"
                color={state === 'out' ? colors.heroMuted : colors.heroText}
                style={{ fontSize: 56, lineHeight: 62 }}
                maxFontSizeMultiplier={1.2}
              >
                {count}
              </Text>
            </Animated.View>
            <Text variant="label" color={colors.heroMuted} style={{ flexShrink: 1 }} numberOfLines={2}>
              {unit}
            </Text>
          </View>
          <RankPill rank={rank} onHero />
        </View>
      </View>
      <Text variant="label" color={colors.heroText} style={{ opacity: 0.92 }}>
        {caption}
      </Text>
      <RankProgress streak={count} onHero />
      {best > count && (
        <Text variant="caption" color={colors.heroMuted} style={{ marginTop: -8, fontVariant: ['tabular-nums'] }}>
          {t('streak.best', { n: best })}
        </Text>
      )}
    </View>
  );
}

/** Warm light spilling from the top-left corner of the hero. */
function HeroGlow({ strength }: { strength: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View style={{ position: 'absolute', top: -120, left: -120, width: 420, height: 420 }} pointerEvents="none">
      <Svg width={420} height={420}>
        <Defs>
          <RadialGradient id={`h${id}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={FLAME.mid} stopOpacity={strength} />
            <Stop offset="0.6" stopColor={FLAME.tip} stopOpacity={0.08} />
            <Stop offset="1" stopColor={FLAME.tip} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={210} cy={210} r={210} fill={`url(#h${id})`} />
      </Svg>
    </View>
  );
}
