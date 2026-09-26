import { FlexWidget, SvgWidget, TextWidget, type ColorProp } from 'react-native-android-widget';
import { flameSvg } from '@/lib/flame';
import { t } from '@/lib/i18n';
import { habitColor, palettes, type Scheme } from '@/lib/theme';
import type { WidgetItem, WidgetSnapshot } from '@/lib/widget-data';

// Widgets can't read the app's theme state: each one is rendered twice and
// Android shows the variant that matches the system (light / dark).

const c = (s: string) => s as ColorProp;
function rgba(hex: string, a: number): ColorProp {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const TOGGLE = 'TOGGLE';
export const WIDGET_TOGGLE = TOGGLE;

function Flame({ state, scheme, size }: { state: WidgetSnapshot['state']; scheme: Scheme; size: number }) {
  const p = palettes[scheme];
  return <SvgWidget svg={flameSvg(state, p.ash, p.ashCore)} style={{ width: size, height: Math.round(size * 1.28) }} />;
}

/** 2×2: the fire, the streak, the rank and today's progress. Tap opens the app. */
export function StreakWidget({ data, scheme, width }: { data: WidgetSnapshot; scheme: Scheme; width: number }) {
  const p = palettes[scheme];
  const barWidth = Math.max(40, width - 32);
  const ratio = data.total === 0 ? 0 : data.done / data.total;
  const out = data.state === 'out';
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel={t('widget.streakA11y', { n: data.streak, rank: data.rank, done: data.done, total: data.total })}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 24,
        backgroundGradient: { from: c(p.hero), to: c(p.card), orientation: 'TL_BR' },
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent' }}>
        <Flame state={data.state} scheme={scheme} size={44} />
        <FlexWidget style={{ flexDirection: 'column', marginLeft: 10 }}>
          <TextWidget
            text={String(data.streak)}
            style={{ fontSize: 46, fontWeight: '800', color: c(out ? p.heroMuted : p.heroText) }}
            allowFontScaling={false}
          />
          <TextWidget text={t(data.streak === 1 ? 'streak.unitOne' : 'streak.unit')} style={{ fontSize: 12, color: c(p.heroMuted) }} />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        <TextWidget text={data.rank} style={{ fontSize: 15, fontWeight: '700', color: c(p.heroText) }} />
        <FlexWidget style={{ height: 6, width: barWidth, borderRadius: 3, backgroundColor: rgba(p.accent, 0.16), marginTop: 8 }}>
          <FlexWidget style={{ height: 6, width: Math.round(barWidth * ratio), borderRadius: 3, backgroundColor: c(p.accent) }} />
        </FlexWidget>
        <TextWidget
          text={data.total === 0 ? t('widget.nothingDue') : t('widget.today', { done: data.done, total: data.total })}
          style={{ fontSize: 12, color: c(p.heroMuted), marginTop: 6 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

/** 4×2 and up: today's habits, checked off right from the home screen. */
export function TodayWidget({ data, scheme, height }: { data: WidgetSnapshot; scheme: Scheme; height: number }) {
  const p = palettes[scheme];
  // Header ≈ 44dp, each row 40dp, one line for "+N more".
  const fits = Math.max(1, Math.floor((height - 44 - 16) / 40));
  const shown = data.items.length > fits ? data.items.slice(0, fits - 1) : data.items;
  const hidden = data.items.length - shown.length;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: c(p.card),
      }}
    >
      <FlexWidget
        clickAction="OPEN_APP"
        style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent', height: 40 }}
      >
        <Flame state={data.state} scheme={scheme} size={20} />
        <TextWidget text={String(data.streak)} style={{ fontSize: 20, fontWeight: '800', color: c(p.text), marginLeft: 8 }} allowFontScaling={false} />
        <TextWidget text={`  ${data.rank}`} style={{ fontSize: 13, color: c(p.muted) }} maxLines={1} truncate="END" />
        <FlexWidget style={{ flex: 1 }} />
        <TextWidget
          text={data.total === 0 ? t('today.freeTitle') : t('widget.todayShort', { done: data.done, total: data.total })}
          style={{ fontSize: 13, fontWeight: '600', color: c(data.total > 0 && data.done === data.total ? p.accent : p.muted) }}
        />
      </FlexWidget>

      {data.items.length === 0 ? (
        <FlexWidget clickAction="OPEN_APP" style={{ flex: 1, width: 'match_parent', justifyContent: 'center', alignItems: 'center' }}>
          <TextWidget text={t('today.freeBody')} style={{ fontSize: 14, color: c(p.muted) }} />
        </FlexWidget>
      ) : (
        <FlexWidget style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', width: 'match_parent' }}>
          {shown.map((item) => (
            <Row key={item.id} item={item} scheme={scheme} />
          ))}
          {hidden > 0 && (
            <TextWidget clickAction="OPEN_APP" text={t('widget.more', { n: hidden })} style={{ fontSize: 12, color: c(p.muted), marginTop: 4, marginLeft: 22 }} />
          )}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

function Row({ item, scheme }: { item: WidgetItem; scheme: Scheme }) {
  const p = palettes[scheme];
  const color = habitColor(item.color);
  const multi = item.perDay > 1;
  return (
    <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent', height: 40 }}>
      <FlexWidget style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c(color), marginRight: 12 }} />
      <FlexWidget clickAction="OPEN_APP" style={{ flex: 1, flexDirection: 'column' }}>
        <TextWidget
          text={item.name}
          maxLines={1}
          truncate="END"
          style={{ fontSize: 15, fontWeight: '600', color: c(item.done ? p.muted : p.text) }}
        />
        {multi && !item.done && <TextWidget text={t('today.doneOf', { done: item.count, total: item.perDay })} style={{ fontSize: 11, color: c(p.muted) }} />}
      </FlexWidget>
      {/* The circle is the only tap target that changes data: tap +1, a full circle undoes one. */}
      <FlexWidget
        clickAction={TOGGLE}
        clickActionData={{ habitId: item.id }}
        accessibilityLabel={t(item.done ? 'widget.undo' : 'widget.markDone', { name: item.name })}
        style={{ width: 48, height: 40, alignItems: 'center', justifyContent: 'center' }}
      >
        <FlexWidget
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: item.done ? 0 : 2,
            borderColor: c(item.count > 0 ? color : p.ash),
            backgroundColor: item.done ? c(color) : rgba(color, item.count > 0 ? 0.14 : 0),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.done ? (
            <TextWidget text="✓" style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF' }} allowFontScaling={false} />
          ) : multi ? (
            <TextWidget text={String(item.count)} style={{ fontSize: 12, fontWeight: '800', color: c(p.text) }} allowFontScaling={false} />
          ) : null}
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
