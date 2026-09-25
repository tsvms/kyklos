import { Platform, type TextStyle } from 'react-native';

export type Scheme = 'light' | 'dark';
export type ThemePref = 'system' | Scheme;

export interface Palette {
  bg: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  faint: string; // empty tracks, idle heatmap cells
  accent: string; // terracotta — the brand ring
  onAccent: string;
  danger: string;
  /** The glowing surface behind the streak fire: warm cream by day, ember-dark by night. */
  hero: string;
  heroText: string;
  heroMuted: string;
  heroBorder: string;
  /** Chips and progress tracks that sit on the hero. */
  heroChip: string;
  heroTrack: string;
  /** Colour of an extinguished flame. */
  ash: string;
  ashCore: string;
}

export const palettes: Record<Scheme, Palette> = {
  light: {
    bg: '#F6F3EE',
    card: '#FFFFFF',
    border: '#E9E3DA',
    text: '#161310',
    muted: '#766F68',
    faint: '#EEE9E1',
    accent: '#E0592F',
    onAccent: '#FFFFFF',
    danger: '#D23B2A',
    hero: '#FFF3E8',
    heroText: '#2B1A10',
    heroMuted: '#8A6D59',
    heroBorder: 'rgba(224,89,47,0.22)',
    heroChip: 'rgba(224,89,47,0.10)',
    heroTrack: 'rgba(224,89,47,0.13)',
    ash: '#C8C1B7',
    ashCore: '#E2DCD3',
  },
  dark: {
    bg: '#0E0C0B',
    card: '#1A1716',
    border: '#2B2724',
    text: '#F7F3EE',
    muted: '#A0978F',
    faint: '#26221F',
    accent: '#FF7043',
    onAccent: '#140F0C',
    danger: '#FF6B57',
    hero: '#1F1814',
    heroText: '#FFF8F1',
    heroMuted: '#B9ABA0',
    heroBorder: 'rgba(255,138,61,0.28)',
    heroChip: 'rgba(255,255,255,0.10)',
    heroTrack: 'rgba(255,255,255,0.12)',
    ash: '#4A4541',
    ashCore: '#5F5954',
  },
};

// The eight fixed, muted habit colours. Keys are what the DB stores.
export const HABIT_COLORS = {
  sage: '#8A9A7B',
  terracotta: '#C4674A',
  honey: '#CFA052',
  dustyBlue: '#6F8FAF',
  plum: '#8E6C8A',
  teal: '#4F8A8B',
  coral: '#DE8B74',
  stone: '#8C857B',
} as const;

export type HabitColor = keyof typeof HABIT_COLORS;
export const HABIT_COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColor[];

export function habitColor(key: string): string {
  return HABIT_COLORS[key as HabitColor] ?? HABIT_COLORS.stone;
}

/** Hex colour + alpha (0…1) → #RRGGBBAA. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.slice(0, 7)}${a}`;
}

// The fire: deep red at the tips, amber at the base, a pale-gold core.
export const FLAME = { tip: '#FF3B2F', mid: '#FF7A1A', base: '#FFB627', core: '#FFE7A3', coreBase: '#FFC93C' } as const;

/** The floating tab bar: its height and its gap above the bottom inset. */
export const TAB_BAR_HEIGHT = 66;
export const TAB_BAR_GAP = 12;

export const radius = { card: 24, button: 18, chip: 12 } as const;
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

// System fonts only. Sizes are generous; numbers are always tabular.
export const type = {
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 17, fontWeight: '400' },
  label: { fontSize: 15, fontWeight: '500' },
  caption: { fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
  number: { fontSize: 40, fontWeight: '800', letterSpacing: -1.2, ...tabular },
  numberSmall: { fontSize: 22, fontWeight: '600', ...tabular },
  tabular,
} satisfies Record<string, TextStyle>;

export const hairline = Platform.select({ ios: 0.5, default: 1 });
