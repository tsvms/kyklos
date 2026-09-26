import type { FlameState } from './stats';
import { FLAME } from './theme';

// One flame drawn in a 100 × 128 box: an outer tongue and a pale core.
export const FLAME_PATH =
  'M50 4 C60 28 82 40 85 68 C88 98 70 124 50 124 C29 124 12 106 14 80 C15 63 24 53 31 45 C32 58 37 66 43 68 C38 46 42 22 50 4 Z';
export const FLAME_CORE =
  'M50 60 C57 73 69 82 69 99 C69 113 60 121 50 121 C40 121 31 113 31 101 C31 90 37 84 42 78 C44 86 47 89 51 89 C47 80 46 70 50 60 Z';

/** The flame as a standalone SVG document, for surfaces without react-native-svg (widgets). */
export function flameSvg(state: FlameState, ash: string, ashCore: string): string {
  const out = state === 'out';
  const o = out ? [ash, ash, ash] : [FLAME.tip, FLAME.mid, FLAME.base];
  const c = out ? [ashCore, ashCore] : [FLAME.coreBase, FLAME.core];
  const opacity = state === 'waiting' ? 0.5 : 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="128" viewBox="0 0 100 128">
<defs>
<linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o[0]}"/><stop offset="0.55" stop-color="${o[1]}"/><stop offset="1" stop-color="${o[2]}"/></linearGradient>
<linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
</defs>
<g opacity="${opacity}"><path d="${FLAME_PATH}" fill="url(#o)"/><path d="${FLAME_CORE}" fill="url(#c)"/></g>
</svg>`;
}
