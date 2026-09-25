import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { EMPTY_HABIT, HabitForm } from '@/components/HabitForm';
import { Screen } from '@/components/ui';
import { useApp } from '@/lib/app-state';
import { createHabit } from '@/lib/db';

export default function NewHabit() {
  const db = useSQLiteContext();
  const { t, changed } = useApp();
  return (
    <Screen>
      <HabitForm
        initial={EMPTY_HABIT}
        submitLabel={t('common.save')}
        onSubmit={async (h) => {
          await createHabit(db, h);
          changed();
          router.back();
        }}
      />
    </Screen>
  );
}
