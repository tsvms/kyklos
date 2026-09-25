// Greek all-caps drop the tonos (ΟΝΟΜΑ, not ΌΝΟΜΑ); a tonos on ι/υ that sits
// on a diphthong-breaking vowel keeps its dialytika (ΐ → Ϊ, ΰ → Ϋ).
// `textTransform: 'uppercase'` gets this wrong on both platforms.
const GREEK_CAPS: Record<string, string> = {
  ά: 'Α', έ: 'Ε', ή: 'Η', ί: 'Ι', ό: 'Ο', ύ: 'Υ', ώ: 'Ω',
  Ά: 'Α', Έ: 'Ε', Ή: 'Η', Ί: 'Ι', Ό: 'Ο', Ύ: 'Υ', Ώ: 'Ω',
  ΐ: 'Ϊ', ΰ: 'Ϋ', ς: 'Σ',
};

export function upper(s: string): string {
  let out = '';
  for (const ch of s) out += GREEK_CAPS[ch] ?? ch.toUpperCase();
  return out;
}
