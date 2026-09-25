import { View } from 'react-native';
import { Card, Row, Screen, Text } from '@/components/ui';
import { useApp } from '@/lib/app-state';
import { LICENSES } from '@/lib/legal';
import { space } from '@/lib/theme';

export default function Licenses() {
  const { t } = useApp();
  return (
    <Screen>
      <Text muted>{t('licenses.intro')}</Text>
      <Card style={{ paddingVertical: space.xs }}>
        {LICENSES.map((l, i) => (
          <Row key={l.name} last={i === LICENSES.length - 1}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="label">{l.name}</Text>
              <Text variant="caption" muted>
                {l.author}
              </Text>
            </View>
            <Text variant="caption" muted>
              {l.license}
            </Text>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}
