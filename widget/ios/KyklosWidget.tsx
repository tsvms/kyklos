import { Circle, HStack, Image, ProgressView, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  monospacedDigit,
  opacity,
  padding,
  progressViewStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

/** Plain JSON: the widget runs in its own runtime and only sees these props. */
export type KyklosWidgetProps = {
  streak: number;
  state: 'lit' | 'waiting' | 'out';
  rank: string;
  done: number;
  total: number;
  /** Already-translated text, so the widget needs no strings of its own. */
  unit: string;
  progress: string;
  progressShort: string;
  items: { name: string; color: string; count: number; perDay: number; done: boolean }[];
};

// systemSmall: the fire, the streak, the rank and today's progress.
// systemMedium: the same header plus today's habits. Tapping opens the app.
const KyklosWidget = (props: KyklosWidgetProps, env: WidgetEnvironment) => {
  'widget';
  // Everything must live inside this function: it is serialised into the widget runtime.
  const dark = env.colorScheme === 'dark';
  const c = dark
    ? { bgTop: '#1F1814', bgBottom: '#1A1716', text: '#FFF8F1', muted: '#B9ABA0', accent: '#FF7043', ash: '#4A4541', track: '#2B2724' }
    : { bgTop: '#FFF3E8', bgBottom: '#FFFFFF', text: '#2B1A10', muted: '#8A6D59', accent: '#E0592F', ash: '#C8C1B7', track: '#F4E4D8' };
  const out = props.state === 'out';
  const flame = out
    ? foregroundStyle(c.ash)
    : foregroundStyle({ type: 'linearGradient', colors: ['#FF3B2F', '#FF7A1A', '#FFB627'], startPoint: { x: 0.5, y: 0 }, endPoint: { x: 0.5, y: 1 } });
  // Waiting: yesterday was kept, today is still open.
  const dim = opacity(props.state === 'waiting' ? 0.5 : 1);
  const background = containerBackground(
    { type: 'linearGradient', colors: [c.bgTop, c.bgBottom], startPoint: { x: 0, y: 0 }, endPoint: { x: 1, y: 1 } },
    'widget',
  );
  const ratio = props.total === 0 ? 0 : props.done / props.total;
  const allDone = props.total > 0 && props.done === props.total;

  if (env.widgetFamily === 'systemSmall') {
    return (
      <VStack alignment="leading" spacing={4} modifiers={[background, frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' })]}>
        <HStack spacing={8}>
          <Image systemName="flame.fill" size={30} modifiers={[flame, dim]} />
          <Text modifiers={[font({ size: 38, weight: 'heavy' }), monospacedDigit(), foregroundStyle(out ? c.muted : c.text)]}>{String(props.streak)}</Text>
        </HStack>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(c.muted)]}>{props.unit}</Text>
        <Spacer />
        <Text modifiers={[font({ size: 14, weight: 'bold' }), foregroundStyle(c.text)]}>{props.rank}</Text>
        <ProgressView value={ratio} modifiers={[progressViewStyle('linear'), tint(c.accent)]} />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(c.muted)]}>{props.progress}</Text>
      </VStack>
    );
  }

  const rows = props.items.slice(0, 3);
  return (
    <VStack alignment="leading" spacing={8} modifiers={[background, frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' })]}>
      <HStack spacing={6}>
        <Image systemName="flame.fill" size={18} modifiers={[flame, dim]} />
        <Text modifiers={[font({ size: 18, weight: 'heavy' }), monospacedDigit(), foregroundStyle(c.text)]}>{String(props.streak)}</Text>
        <Text modifiers={[font({ size: 13 }), foregroundStyle(c.muted), lineLimit(1)]}>{props.rank}</Text>
        <Spacer />
        <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(allDone ? c.accent : c.muted)]}>{props.progressShort}</Text>
      </HStack>
      {rows.map((item, i) => (
        <HStack key={i} spacing={10} modifiers={[padding({ top: 2 })]}>
          <Circle modifiers={[foregroundStyle(item.color), frame({ width: 8, height: 8 })]} />
          <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(item.done ? c.muted : c.text), lineLimit(1)]}>{item.name}</Text>
          <Spacer />
          {item.done ? (
            <Image systemName="checkmark.circle.fill" size={22} color={item.color} />
          ) : item.perDay > 1 ? (
            <Text modifiers={[font({ size: 13, weight: 'bold' }), monospacedDigit(), foregroundStyle(c.muted)]}>{`${item.count}/${item.perDay}`}</Text>
          ) : (
            <Image systemName="circle" size={22} color={c.ash} />
          )}
        </HStack>
      ))}
    </VStack>
  );
};

export default createWidget<KyklosWidgetProps>('KyklosWidget', KyklosWidget);
