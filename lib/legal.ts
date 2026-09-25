// Single source for legal facts. Fill in `publisher` and `contactEmail`
// before submitting to the stores — the privacy policy and terms read them.

export const LEGAL = {
  /** Your name or company, exactly as shown in App Store Connect / Play Console. */
  publisher: 'Lumena',
  /** A contact address for privacy and support requests. Required by both stores. */
  contactEmail: 'lumenateam@gmail.com',
  /** Date the current privacy policy and terms take effect (YYYY-MM-DD). */
  effectiveDate: '2026-09-24',
} as const;

/** Third-party software shipped inside the app (all verified from node_modules). */
export const LICENSES: { name: string; license: string; author: string }[] = [
  { name: 'React', license: 'MIT', author: 'Meta Platforms, Inc.' },
  { name: 'React Native', license: 'MIT', author: 'Meta Platforms, Inc.' },
  { name: 'Expo SDK & Expo Router', license: 'MIT', author: '650 Industries, Inc.' },
  { name: 'expo-sqlite · expo-notifications · expo-haptics · expo-file-system · expo-sharing · expo-document-picker', license: 'MIT', author: '650 Industries, Inc.' },
  { name: 'SQLite', license: 'Public domain', author: 'D. Richard Hipp et al.' },
  { name: '@expo/vector-icons', license: 'MIT', author: 'Brent Vatne & contributors' },
  { name: 'Feather icons', license: 'MIT', author: 'Cole Bemis' },
  { name: 'react-native-svg', license: 'MIT', author: 'react-native-svg contributors' },
  { name: 'react-native-screens', license: 'MIT', author: 'Software Mansion' },
  { name: 'react-native-safe-area-context', license: 'MIT', author: 'Th3rd Wave' },
];
