import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { HabitForm } from '@/components/HabitForm';
import { EmptyState, Screen } from '@/components/ui';
import { useApp, useData } from '@/lib/app-state';
import { getHabit, updateHabit } from '@/lib/db';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Number(id);
  const db = useSQLiteContext();
  const { t, changed } = useApp();
  const habit = useData((db) => getHabit(db, habitId), habitId);

  if (habit === undefined) return <Screen>{null}</Screen>;
  if (habit === null) {
    return (
      <Screen>
        <EmptyState title={t('detail.notFound')} body="" />
      </Screen>
    );
  }

  const { id: _id, archived: _a, created_at: _c, ...initial } = habit;
  return (
    <Screen>
      <HabitForm
        key={habit.id}
        initial={initial}
        submitLabel={t('common.save')}
        onSubmit={async (h) => {
          await updateHabit(db, habitId, h);
          changed();
          router.back();
        }}
      />
    </Screen>
  );
}
