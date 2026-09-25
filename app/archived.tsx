import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { View } from 'react-native';
import { HabitIcon } from '@/components/HabitIcon';
import { Card, EmptyState, Row, Screen, Text } from '@/components/ui';
import { useApp, useData } from '@/lib/app-state';
import { listHabits } from '@/lib/db';
import { scheduleSummary } from '@/lib/format';
import { habitColor, space } from '@/lib/theme';

export default function Archived() {
  const { colors, t } = useApp();
  const habits = useData((db) => listHabits(db, { archived: true }));

  if (!habits) return <Screen>{null}</Screen>;
  if (habits.length === 0) {
    return (
      <Screen>
        <EmptyState title={t('settings.archivedNone')} body={t('detail.archived')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={{ paddingVertical: space.xs }}>
        {habits.map((h, i) => (
          <Row
            key={h.id}
            last={i === habits.length - 1}
            onPress={() => router.push({ pathname: '/habit/[id]', params: { id: String(h.id) } })}
          >
            <HabitIcon name={h.icon} color={habitColor(h.color)} size={36} />
            <View style={{ flex: 1 }}>
              <Text variant="label">{h.name}</Text>
              <Text variant="caption" muted>
                {scheduleSummary(h, t)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </Row>
        ))}
      </Card>
    </Screen>
  );
}
