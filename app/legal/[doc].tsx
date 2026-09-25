import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Screen, Text } from '@/components/ui';
import { useApp } from '@/lib/app-state';
import { legalDoc, type LegalDocId } from '@/lib/i18n';
import { LEGAL } from '@/lib/legal';
import { space } from '@/lib/theme';

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const { language, t } = useApp();
  const id: LegalDocId = doc === 'terms' ? 'terms' : 'privacy';
  const content = legalDoc(id, language, LEGAL);

  return (
    <Screen>
      <Stack.Screen options={{ title: content.title }} />
      <Text variant="caption" muted style={{ fontVariant: ['tabular-nums'] }}>
        {t('legal.updated', { date: LEGAL.effectiveDate })}
      </Text>
      {content.sections.map((s) => (
        <View key={s.heading} style={{ gap: space.sm, marginTop: space.sm }}>
          <Text variant="label" accessibilityRole="header">
            {s.heading}
          </Text>
          {s.body.map((p, i) => (
            <Text key={i} muted style={{ lineHeight: 25 }}>
              {p}
            </Text>
          ))}
        </View>
      ))}
    </Screen>
  );
}
